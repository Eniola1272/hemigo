import { ArrowRight, CalendarDays, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatNaira } from "@/lib/utils";

const windows = [
  { name: "Sunday Lunch Batch", status: "LIVE", when: "Closes today · 6:00 PM", orders: 42, revenue: 28650000 },
  { name: "Friday Cake Batch", status: "UPCOMING", when: "Opens tomorrow · 9:00 AM", orders: 0, revenue: 0 },
  { name: "August Food Box", status: "CLOSED", when: "Closed 29 Aug · 8:00 AM", orders: 68, revenue: 41200000 },
  { name: "Corporate Lunch Run", status: "DRAFT", when: "Dates not set", orders: 0, revenue: 0 },
];

export default function WindowsPage() {
  return <div className="space-y-7"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h1 className="text-3xl font-bold tracking-[-.04em]">Selling windows</h1><p className="mt-2 text-slate-500">Open, close, and track every batch from one place.</p></div><Button href="/dashboard/windows/new"><Plus size={18}/>Create window</Button></div>
    <div className="hide-scrollbar flex gap-2 overflow-x-auto border-b border-slate-200">{["All","Live","Upcoming","Closed","Drafts"].map((filter,i)=><button key={filter} className={`shrink-0 border-b-2 px-3 py-3 text-sm font-semibold ${i===0?"border-indigo-700 text-indigo-700":"border-transparent text-slate-500 hover:text-slate-900"}`}>{filter}</button>)}</div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{windows.map((item,index)=><article key={item.name} className="card group overflow-hidden transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(15,23,42,.07)]"><div className={`h-1.5 ${item.status === "LIVE" ? "bg-emerald-500" : item.status === "UPCOMING" ? "bg-indigo-600" : "bg-slate-200"}`}/><div className="p-5"><div className="flex items-start justify-between gap-4"><Badge tone={item.status === "LIVE"?"success":item.status === "UPCOMING"?"indigo":"neutral"}>{item.status}</Badge><button className="rounded-md p-1 text-slate-400 hover:bg-slate-100" aria-label="Window options"><MoreHorizontal size={18}/></button></div><h2 className="mt-5 text-xl font-bold tracking-tight">{item.name}</h2><p className="mt-2 flex items-center gap-2 text-sm text-slate-500"><CalendarDays size={15}/>{item.when}</p><div className="mt-7 grid grid-cols-2 gap-3 rounded-[10px] bg-slate-50 p-4"><div><span className="text-xs text-slate-500">Orders</span><strong className="mt-1 block">{item.orders}</strong></div><div><span className="text-xs text-slate-500">Revenue</span><strong className="mt-1 block">{formatNaira(item.revenue)}</strong></div></div><Button href={index===0?"/dashboard/windows/sunday-lunch/fulfillment":"/dashboard/windows/new"} tone="ghost" className="mt-4 w-full justify-between">{index===0?"View fulfillment":"View window"}<ArrowRight size={16}/></Button></div></article>)}</div>
  </div>;
}
