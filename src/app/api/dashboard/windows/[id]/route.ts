import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireVendor } from "@/lib/auth/session";
import { windowSchema } from "@/lib/validation/vendor";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { vendor } = await requireVendor();
  const { id } = await params;

  const window = await db.sellingWindow.findFirst({
    where: { id, vendorId: vendor.id },
    include: {
      windowProducts: {
        include: {
          product: true,
        },
      },
      _count: {
        select: { orders: true },
      },
    },
  });

  if (!window) {
    return NextResponse.json({ error: "Selling window not found." }, { status: 404 });
  }

  return NextResponse.json({ window });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { vendor } = await requireVendor();
  const { id } = await params;

  const existing = await db.sellingWindow.findFirst({
    where: { id, vendorId: vendor.id },
    include: {
      windowProducts: true,
      _count: { select: { orders: true } },
    },
  });

  if (!existing) {
    return NextResponse.json({ error: "Selling window not found." }, { status: 404 });
  }

  const parsed = windowSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Check the selling-window details." },
      { status: 400 }
    );
  }

  const productIds = parsed.data.products.map((item) => item.productId);
  const ownedProducts = await db.product.count({
    where: { id: { in: productIds }, vendorId: vendor.id, active: true },
  });
  if (ownedProducts !== new Set(productIds).size) {
    return NextResponse.json(
      { error: "One or more selected products are unavailable." },
      { status: 400 }
    );
  }

  const now = new Date();
  const status =
    parsed.data.status ??
    (!parsed.data.publish
      ? "DRAFT"
      : parsed.data.mode === "SHOP"
      ? "LIVE"
      : parsed.data.opensAt! > now
      ? "UPCOMING"
      : parsed.data.closesAt! <= now
      ? "CLOSED"
      : "LIVE");

  const updatedWindow = await db.$transaction(async (tx) => {
    const win = await tx.sellingWindow.update({
      where: { id },
      data: {
        name: parsed.data.name,
        description: parsed.data.description,
        headline: parsed.data.headline,
        mode: parsed.data.mode,
        opensAt: parsed.data.opensAt,
        closesAt: parsed.data.closesAt,
        fulfillmentAt: parsed.data.fulfillmentAt,
        allowPayLater: parsed.data.allowPayLater,
        invoiceHoldMinutes: parsed.data.invoiceHoldMinutes,
        invoiceReservesInventory: parsed.data.invoiceReservesInventory,
        theme: parsed.data.theme,
        status,
      },
    });

    const existingMap = new Map(existing.windowProducts.map((wp) => [wp.productId, wp]));
    const incomingProductIds = new Set(productIds);

    for (const item of parsed.data.products) {
      const match = existingMap.get(item.productId);
      if (match) {
        await tx.windowProduct.update({
          where: { id: match.id },
          data: {
            priceKobo: Math.round(item.priceNaira * 100),
            inventoryLimit: item.inventoryLimit,
            maxPerCustomer: item.maxPerCustomer,
          },
        });
      } else {
        await tx.windowProduct.create({
          data: {
            windowId: id,
            productId: item.productId,
            priceKobo: Math.round(item.priceNaira * 100),
            inventoryLimit: item.inventoryLimit,
            maxPerCustomer: item.maxPerCustomer,
          },
        });
      }
    }

    for (const wp of existing.windowProducts) {
      if (!incomingProductIds.has(wp.productId)) {
        const orderCount = await tx.orderItem.count({
          where: { windowProductId: wp.id },
        });
        if (orderCount === 0) {
          await tx.windowProduct.delete({ where: { id: wp.id } });
        } else {
          await tx.windowProduct.update({
            where: { id: wp.id },
            data: { inventoryLimit: wp.soldQty },
          });
        }
      }
    }

    return win;
  });

  return NextResponse.json({
    window: updatedWindow,
    shareUrl:
      updatedWindow.mode === "SHOP"
        ? `/${vendor.slug}`
        : `/${vendor.slug}/${updatedWindow.slug}`,
  });
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { vendor } = await requireVendor();
  const { id } = await params;

  const existing = await db.sellingWindow.findFirst({
    where: { id, vendorId: vendor.id },
    include: {
      orders: { where: { status: "PAID" }, select: { id: true } },
    },
  });

  if (!existing) {
    return NextResponse.json({ error: "Selling window not found." }, { status: 404 });
  }

  if (existing.orders.length > 0) {
    return NextResponse.json(
      { error: "Cannot delete a window with paid orders. You can close it instead." },
      { status: 400 }
    );
  }

  await db.sellingWindow.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
