import { NextResponse } from "next/server";
import { z } from "zod";
import { requireVendor } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { createVendorSubaccount } from "@/lib/services/paystack-vendors";

const schema = z.object({
  bankName: z.string().trim().min(2).max(100),
  accountNumber: z.string().trim().regex(/^\d{10}$/, "Enter a 10-digit account number."),
});

export async function POST(request: Request) {
  const { vendor } = await requireVendor();
  if (!process.env.PAYSTACK_SECRET_KEY) {
    return NextResponse.json(
      { error: "Paystack is not configured for this environment." },
      { status: 503 },
    );
  }
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Check the account details." },
      { status: 400 },
    );
  }

  try {
    const detailsChanged =
      vendor.bankName !== parsed.data.bankName ||
      vendor.accountNumber !== parsed.data.accountNumber;
    if (detailsChanged) {
      await db.vendorProfile.update({
        where: { id: vendor.id },
        data: {
          ...parsed.data,
          bankCode: null,
          accountName: null,
          paystackSubaccountCode: null,
        },
      });
    }
    const updated =
      !detailsChanged && vendor.paystackSubaccountCode
        ? vendor
        : await createVendorSubaccount(vendor.id);
    return NextResponse.json({
      connected: true,
      subaccountCode: updated.paystackSubaccountCode,
      accountName: updated.accountName,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not connect payouts." },
      { status: 400 },
    );
  }
}
