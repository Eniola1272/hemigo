import { db } from "@/lib/db";

type PaystackInit = { authorization_url: string; access_code: string; reference: string };

export async function initializePaystackPayment(orderId: string) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error("Paystack is not configured.");
  const order = await db.order.findUnique({ where: { id: orderId }, include: { vendor: true } });
  if (!order || order.status !== "RESERVED" || !order.customerEmail) throw new Error("This order cannot be paid.");
  const reference = `pay_${order.orderNumber}_${Date.now()}`;
  const response = await fetch("https://api.paystack.co/transaction/initialize", { method: "POST", headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" }, body: JSON.stringify({ email: order.customerEmail, amount: order.totalKobo, reference, subaccount: order.vendor.paystackSubaccountCode, callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/order/${order.id}/success`, metadata: { orderId: order.id } }) });
  const result = await response.json() as { status: boolean; message: string; data: PaystackInit };
  if (!response.ok || !result.status) throw new Error(result.message || "Could not start payment.");
  await db.payment.create({ data: { orderId: order.id, providerReference: reference, amountKobo: order.totalKobo } });
  return result.data;
}

export async function finalizeSuccessfulPayment(reference: string, payload: object) {
  return db.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({ where: { providerReference: reference }, include: { order: { include: { items: true } } } });
    if (!payment) throw new Error("Payment reference not found.");
    const claimed = await tx.payment.updateMany({ where: { id: payment.id, status: "PENDING" }, data: { status: "SUCCESS", processedAt: new Date(), rawPayload: payload } });
    if (!claimed.count) return payment.order;
    for (const item of payment.order.items) await tx.windowProduct.update({ where: { id: item.windowProductId }, data: { reservedQty: { decrement: item.quantity }, soldQty: { increment: item.quantity } } });
    return tx.order.update({ where: { id: payment.order.id }, data: { status: "PAID", paidAt: new Date(), reservationExpiresAt: null } });
  });
}
