import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { finalizeSuccessfulPayment } from "@/lib/services/payments";

type ChargeSuccess = { event: "charge.success"; data: { reference: string; status: string; amount: number } };

export async function POST(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return NextResponse.json({ error: "Webhook is not configured." }, { status: 503 });
  const rawBody = await request.text();
  const supplied = request.headers.get("x-paystack-signature") ?? "";
  const expected = createHmac("sha512", secret).update(rawBody).digest("hex");
  const valid = supplied.length === expected.length && timingSafeEqual(Buffer.from(supplied), Buffer.from(expected));
  if (!valid) return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  const event = JSON.parse(rawBody) as ChargeSuccess;
  if (event.event === "charge.success" && event.data.status === "success") await finalizeSuccessfulPayment(event.data.reference, event);
  return NextResponse.json({ received: true });
}
