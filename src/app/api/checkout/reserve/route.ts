import { NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/validation/checkout";
import { createInventoryReservation } from "@/lib/services/inventory";
import { getCurrentUser } from "@/lib/auth/session";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  const parsed = checkoutSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Check your checkout details.", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
  try {
    const user=await getCurrentUser();
    const order = await createInventoryReservation(parsed.data,user?.id);
    if(order.invoice&&order.customerEmail){const url=`${process.env.NEXT_PUBLIC_APP_URL}/invoice/${order.invoice.publicToken}`;try{await sendEmail({to:order.customerEmail,subject:`Invoice ${order.invoice.invoiceNumber}`,html:`<p>Your invoice from ${order.vendor.name} is ready.</p><p><a href="${url}">View and pay invoice</a></p>`})}catch(error){console.error("Invoice email failed",error)}}
    return NextResponse.json({ orderId: order.id, publicToken: order.publicToken, orderNumber: order.orderNumber, totalKobo: order.totalKobo, expiresAt: order.reservationExpiresAt, invoiceUrl:order.invoice?`/invoice/${order.invoice.publicToken}`:null }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not reserve these items." }, { status: 409 });
  }
}
