import { NextResponse } from "next/server";
import { z } from "zod";
import { enforceAuthRateLimit } from "@/lib/auth/rate-limit";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().transform((value) => value.toLowerCase()),
  topic: z.enum([
    "General enquiry",
    "Seller support",
    "Buyer support",
    "Payments and billing",
    "Partnerships",
    "Privacy and safety",
  ]),
  subject: z.string().trim().min(3).max(160),
  message: z.string().trim().min(20).max(4000),
  website: z.string().max(0).optional().or(z.literal("")),
});

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character]!);
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  if (payload?.website) return NextResponse.json({ success: true });
  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Check your message." },
      { status: 400 },
    );
  }
  try {
    await enforceAuthRateLimit("contact", parsed.data.email, 5, 60 * 60_000);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Please wait before trying again." },
      { status: 429 },
    );
  }

  const inquiryData = {
    name: parsed.data.name,
    email: parsed.data.email,
    topic: parsed.data.topic,
    subject: parsed.data.subject,
    message: parsed.data.message,
  };
  const inquiry = await db.contactInquiry.create({ data: inquiryData });
  const supportEmail = process.env.CONTACT_EMAIL || "hello@hemigo.ng";
  const safe = Object.fromEntries(
    Object.entries(inquiryData).map(([key, value]) => [key, escapeHtml(value)]),
  );
  const deliveries = await Promise.allSettled([
    sendEmail({
      to: supportEmail,
      subject: `[Hemigo contact] ${parsed.data.subject}`,
      html: `<p><strong>From:</strong> ${safe.name} (${safe.email})</p><p><strong>Topic:</strong> ${safe.topic}</p><p>${safe.message.replace(/\n/g, "<br>")}</p><p>Reference: ${inquiry.id}</p>`,
    }),
    sendEmail({
      to: parsed.data.email,
      subject: "We received your Hemigo message",
      html: `<p>Hi ${safe.name},</p><p>Thanks for contacting Hemigo about “${safe.subject}”. We have received your message and will reply as soon as possible.</p><p>Reference: ${inquiry.id}</p>`,
    }),
  ]);
  for (const delivery of deliveries) {
    if (delivery.status === "rejected") console.error("Contact email failed", delivery.reason);
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
