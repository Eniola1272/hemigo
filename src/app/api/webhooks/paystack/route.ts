import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { finalizeSuccessfulPayment } from "@/lib/services/payments";
import { db } from "@/lib/db";
import { sendOrderReceiptEmail } from "@/lib/email";
import { activateSubscriptionPayment, linkProviderSubscription, updateSubscriptionStatus } from "@/lib/services/subscriptions";

type PaystackEvent = { event: string; data: { reference?: string; status?: string; amount?: number; subscription_code?: string; email_token?: string; customer?: { email?: string }; subscription?: { subscription_code?: string } } };

export async function POST(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return NextResponse.json({ error: "Webhook is not configured." }, { status: 503 });
  const rawBody = await request.text();
  const supplied = request.headers.get("x-paystack-signature") ?? "";
  const expected = createHmac("sha512", secret).update(rawBody).digest("hex");
  const valid = supplied.length === expected.length && timingSafeEqual(Buffer.from(supplied), Buffer.from(expected));
  if (!valid) return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  const event = JSON.parse(rawBody) as PaystackEvent;
  const eventKey = createHmac("sha256", secret).update(rawBody).digest("hex");
  const existing = await db.webhookEvent.findUnique({ where: { eventKey } });
  if (existing?.processed) return NextResponse.json({ received: true, duplicate: true });
  await db.webhookEvent.upsert({ where: { eventKey }, update: {}, create: { eventKey, eventType: event.event, payload: event } });
  try {
    if (event.event === "charge.success" && event.data.status === "success"&&event.data.reference&&typeof event.data.amount==="number") {const subscription=await activateSubscriptionPayment(event.data.reference,undefined,{subscription_code:event.data.subscription_code,email_token:event.data.email_token});if(!subscription){const order=await finalizeSuccessfulPayment(event.data.reference, event, event.data.amount);try{await sendOrderReceiptEmail(order)}catch(error){console.error("Receipt email failed",error)}}}
    if(event.event==="subscription.create"&&event.data.subscription_code&&event.data.customer?.email)await linkProviderSubscription(event.data.customer.email,{subscription_code:event.data.subscription_code,email_token:event.data.email_token});
    if(event.event==="subscription.disable"&&event.data.subscription_code)await updateSubscriptionStatus(event.data.subscription_code,"CANCELLED");
    if(event.event==="invoice.payment_failed"&&event.data.subscription?.subscription_code)await updateSubscriptionStatus(event.data.subscription.subscription_code,"PAST_DUE");
    await db.webhookEvent.update({ where: { eventKey }, data: { processed: true, processedAt: new Date() } });
  } catch (error) {
    await db.webhookEvent.update({ where: { eventKey }, data: { error: error instanceof Error ? error.message : "Unknown webhook error" } });
    throw error;
  }
  return NextResponse.json({ received: true });
}
