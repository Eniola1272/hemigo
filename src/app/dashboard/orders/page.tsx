import { Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrdersTable } from "@/components/dashboard/orders-table";
import { requireVendor } from "@/lib/auth/session";
import { db } from "@/lib/db";

export default async function OrdersPage() {
  const { vendor } = await requireVendor();
  const orders = await db.order.findMany({ where: { vendorId: vendor.id }, include: { _count: { select: { items: true } } }, orderBy: { createdAt: "desc" } });
  const rows=orders.map(order=>({id:order.id,orderNumber:order.orderNumber,customerName:order.customerName,itemCount:order._count.items,amountKobo:order.totalKobo,status:order.status,fulfillmentStatus:order.fulfillmentStatus,createdAt:order.createdAt.toISOString()}));
  const paid=orders.filter(o=>o.status==="PAID").length;const pending=orders.filter(o=>o.status==="RESERVED").length;const fulfilled=orders.filter(o=>o.fulfillmentStatus==="FULFILLED").length;
  return <div className="space-y-7"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h1 className="text-3xl font-bold tracking-[-.04em]">Orders</h1><p className="mt-2 text-slate-500">Every customer and fulfillment status, in one view.</p></div><Button tone="secondary"><Download size={17}/>Export orders</Button></div><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="hide-scrollbar flex gap-1 overflow-x-auto">{[`All ${orders.length}`,`Paid ${paid}`,`Pending ${pending}`,`Fulfilled ${fulfilled}`].map((filter,i)=><button key={filter} className={`shrink-0 rounded-[9px] px-4 py-2 text-sm font-semibold ${i===0?"bg-indigo-700 text-white":"border border-slate-200 bg-white text-slate-600"}`}>{filter}</button>)}</div><label className="flex min-w-72 items-center gap-2 rounded-[10px] border border-slate-200 bg-white px-3"><Search size={17} className="text-slate-400"/><input className="h-10 w-full bg-transparent text-sm outline-none" placeholder="Search customer, phone or order"/></label></div><section className="card overflow-hidden">{rows.length?<OrdersTable orders={rows}/>:<div className="p-12 text-center"><h2 className="text-xl font-bold">Waiting for your first order.</h2><p className="mt-2 text-slate-500">Share your storefront link and orders will appear here.</p></div>}</section></div>;
}
