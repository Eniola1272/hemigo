import { notFound } from "next/navigation";
import { requireVendor } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { EditWindowForm } from "./edit-form";

export default async function EditWindowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { vendor } = await requireVendor();
  const { id } = await params;

  const [window, products] = await Promise.all([
    db.sellingWindow.findFirst({
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
    }),
    db.product.findMany({
      where: { vendorId: vendor.id, active: true },
      select: { id: true, name: true, defaultPrice: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!window) notFound();

  return (
    <EditWindowForm
      window={window}
      products={products}
      vendorSlug={vendor.slug}
    />
  );
}
