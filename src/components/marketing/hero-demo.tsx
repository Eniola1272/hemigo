import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { Countdown } from "@/components/countdown";

export function HeroDemo() {
  return (
    <div className="relative mx-auto mt-16 max-w-6xl pb-8 lg:mt-20">
      <div className="absolute -inset-x-4 top-8 bottom-0 -z-10 rounded-[28px] bg-indigo-50" />
      <div className="grid items-end gap-4 lg:grid-cols-[1fr_.72fr_1fr]">
        <div className="card overflow-hidden rounded-[18px] shadow-[0_22px_60px_rgba(15,23,42,.12)] lg:translate-y-3 lg:-rotate-2">
          <div className="relative h-52 bg-[url('https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=85')] bg-cover bg-center"><div className="absolute inset-0 bg-slate-950/18"/><span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-extrabold tracking-wide text-slate-900">AMAKA’S KITCHEN</span></div>
          <div className="p-5"><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-600">Sunday lunch batch</p><h3 className="mt-2 text-2xl font-bold tracking-tight">Smoky Jollof + Chicken</h3><div className="mt-5 flex items-center justify-between"><strong className="text-lg">₦5,500</strong><span className="grid size-10 place-items-center rounded-[10px] bg-emerald-500 text-white"><ShoppingBag size={18}/></span></div></div>
        </div>
        <div className="z-10 rounded-[18px] border border-amber-200 bg-[#fffbeb] p-6 text-center shadow-[0_18px_50px_rgba(245,158,11,.16)] lg:translate-y-[-36px]">
          <p className="eyebrow mb-4 text-amber-700">Orders close in</p><div className="flex justify-center"><Countdown /></div><p className="mt-4 text-xs text-amber-800">Sunday · 8:00 AM</p>
        </div>
        <div className="card overflow-hidden rounded-[18px] p-5 shadow-[0_22px_60px_rgba(15,23,42,.12)] lg:translate-y-5 lg:rotate-2">
          <div className="flex items-center justify-between"><div><p className="eyebrow text-indigo-700">Prepare</p><h3 className="mt-1 text-xl font-bold">Sunday Lunch Batch</h3></div><ArrowUpRight className="text-slate-400"/></div>
          <div className="mt-5 grid gap-2">{[["Jollof Rice",45,"bg-amber-100"],["Chicken",37,"bg-emerald-100"],["Plantain",26,"bg-indigo-100"]].map(([name,qty,bg]) => <div key={String(name)} className="flex items-center gap-3 rounded-[10px] bg-slate-50 p-3"><span className={`size-9 rounded-lg ${bg}`}/><span className="flex-1 text-sm font-semibold">{name}</span><strong className="text-xl">{qty}</strong></div>)}</div>
        </div>
      </div>
    </div>
  );
}
