"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

type NavbarUser={name:string;hasVendor:boolean}|null;

export function Navbar({user=null}:{user?:NavbarUser}) {
  const [open, setOpen] = useState(false);
  const links=user
    ? [["Explore","/explore"],["Docs","/docs"],[user.hasVendor?"My Hemigos":"My purchases",user.hasVendor?"/dashboard/windows":"/purchases"]]
    : [["Explore","/explore"],["How it works","/#how"],["Docs","/docs"],["Pricing","/#pricing"],["About","/about"]];
  const mobileLinks=user?[...links,["Messages","/messages"]]:links;
  const actions=user
    ? <><Button href={user.hasVendor?"/dashboard":"/onboarding"}>{user.hasVendor?"Dashboard":"Start selling"}</Button><span className="grid size-9 place-items-center rounded-full bg-indigo-100 text-xs font-extrabold text-indigo-700">{user.name.split(/\s+/).map(part=>part[0]).join("").slice(0,2).toUpperCase()}</span></>
    : <><Button href="/login" tone="ghost">Log in</Button><Button href="/signup">Start selling</Button></>;
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="container-shell flex h-18 items-center justify-between">
        {/* Left Navigation on Desktop */}
        <nav className="hidden flex-1 items-center gap-7 lg:flex" aria-label="Main navigation">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="focus-ring rounded text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Center Logo on Desktop / Left on Mobile */}
        <div className="flex items-center justify-start lg:justify-center">
          <Logo />
        </div>

        {/* Right Actions on Desktop */}
        <div className="hidden flex-1 items-center justify-end gap-5 lg:flex">
          {user ? (
            <>
              <Link
                href="/messages"
                aria-label="Messages"
                title="Messages"
                className="focus-ring grid size-9 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-indigo-700"
              >
                <Bell size={18} />
              </Link>
              <Button
                href={user.hasVendor ? "/dashboard" : "/onboarding"}
                className="rounded-full bg-slate-950 px-5 py-2 text-sm font-bold text-white hover:bg-slate-800"
              >
                {user.hasVendor ? "Dashboard" : "Start selling"}
              </Button>
              <span className="grid size-9 place-items-center rounded-full bg-indigo-100 text-xs font-extrabold text-indigo-700">
                {user.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
              </span>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-700 transition hover:text-slate-950"
              >
                Log in
              </Link>
              <Button
                href="/signup"
                className="rounded-full bg-slate-950 px-5 py-2 text-sm font-bold text-white hover:bg-slate-800"
              >
                Try for free
              </Button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="focus-ring rounded-lg p-2 text-slate-700 lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="border-t border-slate-200 bg-white px-5 py-5 lg:hidden">
          <nav className="grid gap-1">
            {mobileLinks.map(([label, href]) => (
              <Link
                onClick={() => setOpen(false)}
                key={href}
                href={href}
                className="rounded-lg px-3 py-3 font-medium text-slate-700 hover:bg-slate-50"
              >
                {label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2 pt-2 border-t border-slate-100">
              {actions}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
