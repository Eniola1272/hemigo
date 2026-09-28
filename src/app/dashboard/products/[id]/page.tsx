import { notFound } from "next/navigation";
import { requireVendor } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { EditProductForm } from "./edit-form";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { vendor } = await requireVendor();
  const { id } = await params;
  const product = await db.product.findFirst({
    where: { id, vendorId: vendor.id },
    include: { event: { select: { id: true, name: true, startsAt: true } } },
  });
  if (!product) notFound();
  const events = await db.event.findMany({
    where: { vendorId: vendor.id },
    select: { id: true, name: true, startsAt: true },
    orderBy: { startsAt: "desc" },
  });
  return (
    <EditProductForm
      product={{
        id: product.id,
        name: product.name,
        description: product.description,
        type: product.type,
        defaultPriceNaira: product.defaultPrice / 100,
        imageUrl: product.imageUrl || "",
        fulfillmentUrl: product.fulfillmentUrl || "",
        serviceDurationMinutes: product.serviceDurationMinutes ?? "",
        eventId: product.eventId || "",
        active: product.active,
      }}
      events={events.map((e) => ({ id: e.id, name: e.name, startsAt: e.startsAt.toISOString() }))}
    />
  );
}
