"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

const links = [["Product", "#product"], ["How it works", "#how"], ["Who it’s for", "#uses"], ["Pricing", "#pricing"]];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="container-shell flex h-18 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">{links.map(([label, href]) => <a key={href} href={href} className="focus-ring rounded text-sm font-medium text-slate-600 transition hover:text-slate-950">{label}</a>)}</nav>
        <div className="hidden items-center gap-3 md:flex"><Button href="/login" tone="ghost">Log in</Button><Button href="/signup">Start selling</Button></div>
        <button className="focus-ring rounded-lg p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && <div className="border-t border-slate-200 bg-white px-5 py-5 md:hidden"><nav className="grid gap-1">{links.map(([label, href]) => <a onClick={() => setOpen(false)} key={href} href={href} className="rounded-lg px-3 py-3 font-medium text-slate-700 hover:bg-slate-50">{label}</a>)}<div className="mt-3 grid grid-cols-2 gap-2"><Button href="/login" tone="secondary">Log in</Button><Button href="/signup">Start selling</Button></div></nav></div>}
    </header>
  );
}
