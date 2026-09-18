import { NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/validation/checkout";
import { createInventoryReservation } from "@/lib/services/inventory";

export async function POST(request: Request) {
  const parsed = checkoutSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Check your checkout details.", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
  try {
    const order = await createInventoryReservation(parsed.data);
    return NextResponse.json({ orderId: order.id, publicToken: order.publicToken, orderNumber: order.orderNumber, totalKobo: order.totalKobo, expiresAt: order.reservationExpiresAt }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not reserve these items." }, { status: 409 });
  }
}
