import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { finalizeSuccessfulPayment } from "@/lib/services/payments";
import { db } from "@/lib/db";

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
  const eventKey = createHmac("sha256", secret).update(rawBody).digest("hex");
  const existing = await db.webhookEvent.findUnique({ where: { eventKey } });
  if (existing?.processed) return NextResponse.json({ received: true, duplicate: true });
  await db.webhookEvent.upsert({ where: { eventKey }, update: {}, create: { eventKey, eventType: event.event, payload: event } });
  try {
    if (event.event === "charge.success" && event.data.status === "success") await finalizeSuccessfulPayment(event.data.reference, event, event.data.amount);
    await db.webhookEvent.update({ where: { eventKey }, data: { processed: true, processedAt: new Date() } });
  } catch (error) {
    await db.webhookEvent.update({ where: { eventKey }, data: { error: error instanceof Error ? error.message : "Unknown webhook error" } });
    throw error;
  }
  return NextResponse.json({ received: true });
}
