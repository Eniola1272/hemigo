import { NextResponse } from "next/server";
import { z } from "zod";
import { initializePaystackPayment } from "@/lib/services/payments";

export async function POST(request: Request) {
  const parsed = z.object({ orderId: z.string().min(1) }).safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Order ID is required." }, { status: 400 });
  try { return NextResponse.json(await initializePaystackPayment(parsed.data.orderId)); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Could not start payment." }, { status: 400 }); }
}
