import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { orders } from "@/lib/demo-data";
import { formatNaira, initials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function OrdersTable({ limit }: { limit?: number }) {
  const rows = limit ? orders.slice(0, limit) : orders;
  return <div className="overflow-x-auto"><table className="w-full min-w-[820px] text-left"><thead><tr className="border-y border-slate-200 bg-slate-50/80">{["Customer","Order","Items","Amount","Payment","Fulfillment","Date",""] .map((h,i)=><th key={i} className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">{h}</th>)}</tr></thead><tbody>{rows.map((order)=><tr key={order.id} className="border-b border-slate-100 transition hover:bg-slate-50/70"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-full bg-indigo-50 text-[10px] font-bold text-indigo-700">{initials(order.customer)}</span><span className="text-sm font-semibold">{order.customer}</span></div></td><td className="px-5 py-4 text-sm font-semibold text-indigo-700">#{order.id}</td><td className="px-5 py-4 text-sm text-slate-600">{order.itemCount} items</td><td className="px-5 py-4 text-sm font-bold">{formatNaira(order.amountKobo)}</td><td className="px-5 py-4"><Badge tone={order.payment === "Paid" ? "success" : "warning"}>{order.payment}</Badge></td><td className="px-5 py-4"><Badge tone={order.fulfillment === "Fulfilled" ? "success" : "neutral"}>{order.fulfillment}</Badge></td><td className="px-5 py-4 text-sm text-slate-500">{order.date}</td><td className="px-5 py-4"><Link href={`/dashboard/orders/${order.id}`} aria-label={`View ${order.id}`} className="text-slate-400 hover:text-indigo-700"><ChevronRight size={18}/></Link></td></tr>)}</tbody></table></div>;
}
