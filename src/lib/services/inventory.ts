import { Prisma } from "@prisma/client";
import { randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import type { CheckoutInput } from "@/lib/validation/checkout";
import { isWindowAcceptingOrders } from "@/lib/commerce";

const RESERVATION_MINUTES = 8;

export async function createInventoryReservation(input: CheckoutInput, customerUserId?: string) {
  return db.$transaction(async (tx) => {
    const now = new Date();
    const window = await tx.sellingWindow.findUnique({ where: { id: input.windowId }, include: { vendor: true } });
    if (!window || !isWindowAcceptingOrders(window,now)) throw new Error("This selling window is not accepting orders.");
    if(input.paymentMethod==="PAY_LATER"&&!window.allowPayLater)throw new Error("This seller does not accept pay-later orders.");

    const requestedIds = input.items.map((item) => item.windowProductId);
    if (new Set(requestedIds).size !== requestedIds.length) throw new Error("Duplicate cart items are not allowed.");
    const products = await tx.windowProduct.findMany({ where: { id: { in: requestedIds }, windowId: window.id }, include: { product: true } });
    if (products.length !== input.items.length) throw new Error("One or more products are unavailable.");

    const ticketQuantities=new Map<string,number>();
    for(const requested of input.items){const product=products.find(item=>item.id===requested.windowProductId)!;if(product.product.type==="TICKET"&&product.product.eventId)ticketQuantities.set(product.product.eventId,(ticketQuantities.get(product.product.eventId)||0)+requested.quantity)}
    for(const[eventId,quantity]of ticketQuantities){const locked=await tx.$queryRaw<Array<{capacity:number}>>(Prisma.sql`SELECT capacity FROM "Event" WHERE id = ${eventId} FOR UPDATE`);if(!locked[0])throw new Error("This event is unavailable.");const usage=await tx.windowProduct.aggregate({where:{product:{eventId}},_sum:{reservedQty:true,soldQty:true}});if((usage._sum.reservedQty||0)+(usage._sum.soldQty||0)+quantity>locked[0].capacity)throw new Error("This event has reached capacity.")}

    const shouldReserveInventory =
      input.paymentMethod === "PAY_NOW" || window.invoiceReservesInventory;

    for (const requested of input.items) {
      const product = products.find((item) => item.id === requested.windowProductId)!;
      if (product.maxPerCustomer && requested.quantity > product.maxPerCustomer) throw new Error(`You can claim up to ${product.maxPerCustomer} of ${product.product.name}.`);
      if (!shouldReserveInventory) continue;
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
    if (input.fulfillmentType === "Delivery" && !window.vendor.deliveryEnabled) throw new Error("Delivery is not available for this window.");
    if (input.fulfillmentType === "Pickup" && !window.vendor.pickupEnabled) throw new Error("Pickup is not available for this window.");
    const deliveryFeeKobo = input.fulfillmentType === "Delivery" ? window.vendor.deliveryFeeKobo : 0;
    const reference = `HMG-${Date.now().toString().slice(-8)}${randomBytes(2).toString("hex").toUpperCase()}`;
    const holdMinutes=input.paymentMethod==="PAY_LATER"?window.invoiceHoldMinutes:RESERVATION_MINUTES;
    const expiresAt = new Date(now.getTime() + holdMinutes * 60_000);

    const order=await tx.order.create({
      data: {
        orderNumber: reference,
        publicToken: randomBytes(18).toString("base64url"),
        vendorId: window.vendorId,
        windowId: window.id,
        customerUserId,
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        customerEmail: input.customerEmail || null,
        fulfillmentType: input.fulfillmentType,
        deliveryAddress: input.deliveryAddress,
        subtotalKobo,
        deliveryFeeKobo,
        totalKobo: subtotalKobo + deliveryFeeKobo,
        inventoryReserved: shouldReserveInventory,
        reservationExpiresAt: expiresAt,
        items: { create: input.items.map((requested) => {
          const product = products.find((item) => item.id === requested.windowProductId)!;
          return { windowProductId: product.id, productName: product.product.name, unitPriceKobo: product.priceKobo, quantity: requested.quantity, lineTotalKobo: product.priceKobo * requested.quantity };
        }) },
      },
      include: { vendor: true },
    });
    const invoice=input.paymentMethod==="PAY_LATER"?await tx.invoice.create({data:{invoiceNumber:`INV-${reference}`,publicToken:randomBytes(18).toString("base64url"),orderId:order.id,vendorId:window.vendorId,customerUserId,amountKobo:order.totalKobo,dueAt:expiresAt}}):null;
    return {...order,invoice};
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}

export async function reserveInventoryBeforePayment(orderId: string) {
  return db.$transaction(async (tx) => {
    await tx.$queryRaw(
      Prisma.sql`SELECT id FROM "Order" WHERE id = ${orderId} FOR UPDATE`,
    );
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { windowProduct: { include: { product: true } } },
        },
      },
    });
    if (!order || order.status !== "RESERVED") {
      throw new Error("This order can no longer be paid.");
    }
    if (order.reservationExpiresAt && order.reservationExpiresAt <= new Date()) {
      throw new Error("This order can no longer be paid.");
    }
    if (order.inventoryReserved) return order;

    const ticketQuantities = new Map<string, number>();
    for (const item of order.items) {
      const eventId = item.windowProduct.product.eventId;
      if (item.windowProduct.product.type === "TICKET" && eventId) {
        ticketQuantities.set(
          eventId,
          (ticketQuantities.get(eventId) || 0) + item.quantity,
        );
      }
    }
    for (const [eventId, quantity] of ticketQuantities) {
      const locked = await tx.$queryRaw<Array<{ capacity: number }>>(
        Prisma.sql`SELECT capacity FROM "Event" WHERE id = ${eventId} FOR UPDATE`,
      );
      if (!locked[0]) throw new Error("This event is unavailable.");
      const usage = await tx.windowProduct.aggregate({
        where: { product: { eventId } },
        _sum: { reservedQty: true, soldQty: true },
      });
      if (
        (usage._sum.reservedQty || 0) +
          (usage._sum.soldQty || 0) +
          quantity >
        locked[0].capacity
      ) {
        throw new Error("This event has reached capacity.");
      }
    }

    for (const item of order.items) {
      const changed = await tx.$executeRaw(Prisma.sql`
        UPDATE "WindowProduct"
        SET "reservedQty" = "reservedQty" + ${item.quantity}
        WHERE id = ${item.windowProductId}
          AND ("inventoryLimit" IS NULL OR "reservedQty" + "soldQty" + ${item.quantity} <= "inventoryLimit")
      `);
      if (changed !== 1) {
        throw new Error(`The available ${item.productName} stock has changed. Please place a new order.`);
      }
    }

    return tx.order.update({
      where: { id: order.id },
      data: { inventoryReserved: true },
    });
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}

export async function releaseExpiredReservations() {
  const expired = await db.order.findMany({ where: { status: "RESERVED", reservationExpiresAt: { lte: new Date() } }, include: { items: true } });
  for (const order of expired) await db.$transaction(async (tx) => {
    const changed = await tx.order.updateMany({ where: { id: order.id, status: "RESERVED" }, data: { status: "EXPIRED" } });
    if (!changed.count) return;
    await tx.invoice.updateMany({where:{orderId:order.id,status:"UNPAID"},data:{status:"EXPIRED"}});
    if (order.inventoryReserved) {
      for (const item of order.items) await tx.windowProduct.update({ where: { id: item.windowProductId }, data: { reservedQty: { decrement: item.quantity } } });
    }
  });
  return expired.length;
}
