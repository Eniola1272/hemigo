import type { LucideIcon } from "lucide-react";
export function StatCard({ label, value, note, icon: Icon }: { label: string; value: string; note: string; icon: LucideIcon }) {
  return <article className="card p-5"><div className="flex items-start justify-between"><p className="text-sm font-medium text-slate-500">{label}</p><span className="grid size-9 place-items-center rounded-[9px] bg-slate-50 text-indigo-700"><Icon size={18}/></span></div><p className="mt-5 text-2xl font-bold tracking-tight text-slate-950">{value}</p><p className="mt-2 text-xs text-slate-500">{note}</p></article>;
}
