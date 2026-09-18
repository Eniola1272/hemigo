import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import type { CheckoutInput } from "@/lib/validation/checkout";

const RESERVATION_MINUTES = 8;

export async function createInventoryReservation(input: CheckoutInput) {
  return db.$transaction(async (tx) => {
    const now = new Date();
    const window = await tx.sellingWindow.findUnique({ where: { id: input.windowId }, include: { vendor: true } });
    if (!window || window.opensAt > now || window.closesAt <= now || window.status !== "LIVE") throw new Error("This selling window is not accepting orders.");

    const requestedIds = input.items.map((item) => item.windowProductId);
    if (new Set(requestedIds).size !== requestedIds.length) throw new Error("Duplicate cart items are not allowed.");
    const products = await tx.windowProduct.findMany({ where: { id: { in: requestedIds }, windowId: window.id }, include: { product: true } });
    if (products.length !== input.items.length) throw new Error("One or more products are unavailable.");

    for (const requested of input.items) {
      const product = products.find((item) => item.id === requested.windowProductId)!;
      if (product.maxPerCustomer && requested.quantity > product.maxPerCustomer) throw new Error(`You can claim up to ${product.maxPerCustomer} of ${product.product.name}.`);
      const changed = await tx.$executeRaw(Prisma.sql`
        UPDATE "WindowProduct"
        SET "reservedQty" = "reservedQty" + ${requested.quantity}
        WHERE id = ${requested.windowProductId}
          AND "windowId" = ${window.id}
          AND ("inventoryLimit" IS NULL OR "reservedQty" + "soldQty" + ${requested.quantity} <= "inventoryLimit")
      `);
      if (changed !== 1) throw new Error(`Someone just claimed the last ${product.product.name}.`);
    }

    const subtotalKobo = input.items.reduce((total, requested) => {
      const product = products.find((item) => item.id === requested.windowProductId)!;
      return total + product.priceKobo * requested.quantity;
    }, 0);
    const deliveryFeeKobo = input.fulfillmentType === "Delivery" ? 50000 : 0;
    const reference = `HMG-${Date.now().toString().slice(-8)}`;
    const expiresAt = new Date(now.getTime() + RESERVATION_MINUTES * 60_000);

    return tx.order.create({
      data: {
        orderNumber: reference,
        vendorId: window.vendorId,
        windowId: window.id,
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        customerEmail: input.customerEmail || null,
        fulfillmentType: input.fulfillmentType,
        deliveryAddress: input.deliveryAddress,
        subtotalKobo,
        deliveryFeeKobo,
        totalKobo: subtotalKobo + deliveryFeeKobo,
        reservationExpiresAt: expiresAt,
        items: { create: input.items.map((requested) => {
          const product = products.find((item) => item.id === requested.windowProductId)!;
          return { windowProductId: product.id, productName: product.product.name, unitPriceKobo: product.priceKobo, quantity: requested.quantity, lineTotalKobo: product.priceKobo * requested.quantity };
        }) },
      },
      include: { vendor: true },
    });
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}

export async function releaseExpiredReservations() {
  const expired = await db.order.findMany({ where: { status: "RESERVED", reservationExpiresAt: { lte: new Date() } }, include: { items: true } });
  for (const order of expired) await db.$transaction(async (tx) => {
    const changed = await tx.order.updateMany({ where: { id: order.id, status: "RESERVED" }, data: { status: "EXPIRED" } });
    if (!changed.count) return;
    for (const item of order.items) await tx.windowProduct.update({ where: { id: item.windowProductId }, data: { reservedQty: { decrement: item.quantity } } });
  });
  return expired.length;
}
