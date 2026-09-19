import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrdersExplorer } from "@/components/dashboard/orders-explorer";
import { requireVendor } from "@/lib/auth/session";
import { db } from "@/lib/db";

export default async function OrdersPage() {
  const { vendor } = await requireVendor();
  const orders = await db.order.findMany({ where: { vendorId: vendor.id }, include: { _count: { select: { items: true } } }, orderBy: { createdAt: "desc" } });
  const rows=orders.map(order=>({id:order.id,orderNumber:order.orderNumber,customerName:order.customerName,customerPhone:order.customerPhone,itemCount:order._count.items,amountKobo:order.totalKobo,status:order.status,fulfillmentStatus:order.fulfillmentStatus,createdAt:order.createdAt.toISOString()}));
  return <div className="space-y-7"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h1 className="text-3xl font-bold tracking-[-.04em]">Orders</h1><p className="mt-2 text-slate-500">Every customer and fulfillment status, in one view.</p></div><Button href="/api/dashboard/orders/export" tone="secondary"><Download size={17}/>Export orders</Button></div><OrdersExplorer orders={rows}/></div>;
}
