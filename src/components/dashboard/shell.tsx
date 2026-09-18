"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ChevronDown, CircleHelp, LayoutGrid, Menu, Package2, PanelLeftClose, ReceiptText, Settings, Store, Users, WalletCards, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { navItems } from "@/lib/demo-data";
import { cn, initials } from "@/lib/utils";

const icons = [LayoutGrid, BarChart3, Package2, ReceiptText, Users, WalletCards];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const pageName = navItems.find(([,href]) => href === pathname)?.[0] ?? (pathname.includes("fulfillment") ? "Fulfillment" : pathname.includes("/new") ? "New selling window" : "Hemigo");
  return (
    <div className="min-h-screen bg-slate-50">
      <aside className={cn("fixed inset-y-0 left-0 z-50 flex w-[252px] flex-col border-r border-slate-200 bg-white transition-transform lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-18 items-center justify-between px-5"><Logo/><button onClick={()=>setOpen(false)} className="rounded-lg p-2 text-slate-500 lg:hidden" aria-label="Close navigation"><X size={20}/></button></div>
        <button className="mx-3 mt-3 flex items-center gap-3 rounded-[10px] border border-slate-200 p-3 text-left transition hover:bg-slate-50"><span className="grid size-9 place-items-center rounded-lg bg-amber-100 text-sm font-bold text-amber-800">AK</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">Amaka&apos;s Kitchen</span><span className="block text-xs text-slate-500">Food & catering</span></span><ChevronDown size={15} className="text-slate-400"/></button>
        <nav className="mt-6 flex-1 space-y-1 px-3" aria-label="Dashboard navigation">{navItems.map(([label,href],index)=>{const Icon=icons[index]; const active=pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`)); return <Link key={href} href={href} onClick={()=>setOpen(false)} className={cn("focus-ring flex items-center gap-3 rounded-[9px] px-3 py-2.5 text-sm font-semibold transition",active ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950")}><Icon size={18}/>{label}{label === "Orders" && <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-800">8</span>}</Link>})}</nav>
        <div className="border-t border-slate-100 p-3"><Link href="/dashboard/settings" className="flex items-center gap-3 rounded-[9px] px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"><Settings size={18}/>Settings</Link><a href="mailto:help@hemigo.ng" className="flex items-center gap-3 rounded-[9px] px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"><CircleHelp size={18}/>Help</a><div className="mt-2 flex items-center gap-3 rounded-[10px] bg-slate-50 p-3"><span className="grid size-8 place-items-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">{initials("Amaka Okafor")}</span><span className="flex-1"><span className="block text-xs font-bold">Amaka Okafor</span><span className="block text-[11px] text-slate-500">Vendor</span></span><PanelLeftClose size={16} className="text-slate-400"/></div></div>
      </aside>
      {open && <button className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden" onClick={()=>setOpen(false)} aria-label="Close navigation overlay"/>}
      <div className="lg:pl-[252px]">
        <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-lg sm:px-7 lg:px-10"><div className="flex items-center gap-3"><button onClick={()=>setOpen(true)} className="rounded-lg p-2 text-slate-600 lg:hidden" aria-label="Open navigation"><Menu size={21}/></button><p className="text-sm font-bold text-slate-800">{pageName}</p></div><div className="flex items-center gap-2"><Link href="/amaka-kitchen/sunday-lunch" className="focus-ring hidden items-center gap-2 rounded-[9px] px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 sm:flex"><Store size={17}/>View store</Link><button className="relative grid size-9 place-items-center rounded-full bg-indigo-100 text-xs font-extrabold text-indigo-700" aria-label="Profile menu">AO<span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-emerald-500"/></button></div></header>
        <main className="mx-auto max-w-[1440px] p-4 sm:p-7 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
