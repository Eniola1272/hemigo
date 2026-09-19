import { db } from "@/lib/db";

type PaystackInit = { authorization_url: string; access_code: string; reference: string };

export async function initializePaystackPayment(orderId: string) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const useLocalMock =
    process.env.NODE_ENV !== "production" &&
    (process.env.PAYSTACK_MOCK_MODE === "true" || !secret);
  const order = await db.order.findUnique({ where: { id: orderId }, include: { vendor: true } });
  if (!order || order.status !== "RESERVED" || !order.customerEmail || order.reservationExpiresAt && order.reservationExpiresAt <= new Date()) throw new Error("This order can no longer be paid.");
  const reference = `pay_${order.orderNumber}_${Date.now()}`;
  if (useLocalMock) {
    await db.payment.create({ data: { orderId: order.id, provider: "local-mock", providerReference: reference, amountKobo: order.totalKobo } });
    await finalizeSuccessfulPayment(reference, { localMock: true }, order.totalKobo);
    return { authorization_url: `/order/${order.publicToken}/success`, access_code: "local", reference };
  }
  if (!secret) throw new Error("Paystack is not configured.");
  const response = await fetch("https://api.paystack.co/transaction/initialize", { method: "POST", headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" }, body: JSON.stringify({ email: order.customerEmail, amount: order.totalKobo, reference, subaccount: order.vendor.paystackSubaccountCode || undefined, callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/order/${order.publicToken}/success`, metadata: { orderId: order.id, publicToken: order.publicToken } }) });
  const result = await response.json() as { status: boolean; message: string; data: PaystackInit };
  if (!response.ok || !result.status) throw new Error(result.message || "Could not start payment.");
  await db.payment.create({ data: { orderId: order.id, providerReference: reference, amountKobo: order.totalKobo } });
  return result.data;
}

export async function finalizeSuccessfulPayment(reference: string, payload: object, reportedAmountKobo: number) {
  return db.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({ where: { providerReference: reference }, include: { order: { include: { items: true } } } });
    if (!payment) throw new Error("Payment reference not found.");
    if (payment.amountKobo !== reportedAmountKobo || payment.order.totalKobo !== reportedAmountKobo) throw new Error("Payment amount does not match the order total.");
    await tx.payment.updateMany({ where: { id: payment.id, status: "PENDING" }, data: { status: "SUCCESS", processedAt: new Date(), rawPayload: payload } });
    const claimedOrder = await tx.order.updateMany({
      where: { id: payment.order.id, status: "RESERVED" },
      data: { status: "PAID", paidAt: new Date(), reservationExpiresAt: null },
    });
    if (!claimedOrder.count) {
      return tx.order.findUniqueOrThrow({ where: { id: payment.order.id } });
    }
    const configuredFee = Number(process.env.PLATFORM_FEE_PERCENT ?? "4");
    const platformFeePercent = Number.isFinite(configuredFee)
      ? Math.min(100, Math.max(0, configuredFee))
      : 4;
    const platformFeeKobo = Math.round(reportedAmountKobo * platformFeePercent / 100);
    const isLocalMock = payment.provider === "local-mock";
    await tx.settlement.upsert({
      where: { providerReference: reference },
      create: {
        vendorId: payment.order.vendorId,
        providerReference: reference,
        grossKobo: reportedAmountKobo,
        platformFeeKobo,
        netKobo: reportedAmountKobo - platformFeeKobo,
        status: isLocalMock ? "PAID" : "PROCESSING",
        settledAt: isLocalMock ? new Date() : null,
      },
      update: {},
    });
    for (const item of payment.order.items) await tx.windowProduct.update({ where: { id: item.windowProductId }, data: { reservedQty: { decrement: item.quantity }, soldQty: { increment: item.quantity } } });
    return tx.order.findUniqueOrThrow({ where: { id: payment.order.id } });
  });
}
