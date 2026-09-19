"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

type NavbarUser={name:string;hasVendor:boolean}|null;

export function Navbar({user=null}:{user?:NavbarUser}) {
  const [open, setOpen] = useState(false);
  const links=user
    ? [["Explore","/explore"],[user.hasVendor?"My Hemigos":"My purchases",user.hasVendor?"/dashboard/windows":"/purchases"],["Messages","/messages"]]
    : [["Explore","/explore"],["How it works","/#how"],["Pricing","/#pricing"]];
  const actions=user
    ? <><Button href={user.hasVendor?"/dashboard":"/onboarding"}>{user.hasVendor?"Dashboard":"Start selling"}</Button><span className="grid size-9 place-items-center rounded-full bg-indigo-100 text-xs font-extrabold text-indigo-700">{user.name.split(/\s+/).map(part=>part[0]).join("").slice(0,2).toUpperCase()}</span></>
    : <><Button href="/login" tone="ghost">Log in</Button><Button href="/signup">Start selling</Button></>;
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="container-shell flex h-18 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">{links.map(([label, href]) => <a key={href} href={href} className="focus-ring rounded text-sm font-medium text-slate-600 transition hover:text-slate-950">{label}</a>)}</nav>
        <div className="hidden items-center gap-3 md:flex">{actions}</div>
        <button className="focus-ring rounded-lg p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && <div className="border-t border-slate-200 bg-white px-5 py-5 md:hidden"><nav className="grid gap-1">{links.map(([label, href]) => <a onClick={() => setOpen(false)} key={href} href={href} className="rounded-lg px-3 py-3 font-medium text-slate-700 hover:bg-slate-50">{label}</a>)}<div className="mt-3 flex gap-2">{actions}</div></nav></div>}
    </header>
  );
}
