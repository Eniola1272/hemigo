import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPin,
  PackageCheck,
  Search,
  Sparkles,
  Store,
  WalletCards,
  Wifi,
  Battery,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeatureBanner() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container-shell">
        {/* Main Plum/Maroon Showcase Card */}
        <div className="relative overflow-hidden rounded-[32px] bg-[#1a0c24] text-white shadow-2xl sm:rounded-[44px] lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {/* Background Ambient Glow & Curves (just like the reference image) */}
          <div className="pointer-events-none absolute -right-20 -top-20 size-[500px] rounded-full bg-gradient-to-br from-orange-500/25 via-amber-500/20 to-indigo-600/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-1/4 size-[400px] rounded-full bg-indigo-700/25 blur-3xl" />

          {/* Left Text Content */}
          <div className="relative z-10 p-8 sm:p-14 lg:py-20 lg:pl-16 lg:pr-8">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-orange-500/20 p-3 text-orange-400">
              <PackageCheck size={28} />
            </div>

            <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-[1.08]">
              Automated fulfillment prep &amp; order lists
            </h2>

            <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-300">
              Side-step the chaos of counting manual WhatsApp messages. We calculate the exact quantities of each dish, item, or ticket sold so prep day feels like a breeze.
            </p>

            {/* Bullet Highlights */}
            <div className="mt-8 space-y-3.5 text-sm sm:text-base text-slate-200">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-5 shrink-0 text-emerald-400" />
                <span>Exact item counts totalled automatically — zero scrap paper math</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-5 shrink-0 text-emerald-400" />
                <span>Instant Paystack payment confirmation before stock is held</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-5 shrink-0 text-emerald-400" />
                <span>Customer delivery addresses, notes, and rider packing slips in 1 click</span>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button
                href="/signup"
                className="rounded-full bg-white px-7 py-3 text-sm font-bold text-slate-950 hover:bg-slate-100"
              >
                Create your first Hemigo <ArrowRight size={16} />
              </Button>
              <Link
                href="/docs?topic=fulfillment-and-orders"
                className="text-sm font-semibold text-slate-300 hover:text-white underline underline-offset-4"
              >
                See how fulfillment works
              </Link>
            </div>
          </div>

          {/* Right Phone Mockup with Live Orders and Floating Badge */}
          <div className="relative z-10 flex items-center justify-center p-6 sm:p-10 lg:pr-14">
            <div className="relative w-full max-w-[340px]">
              {/* Phone Device Frame */}
              <div className="relative h-[560px] w-full rounded-[42px] border-[6px] border-slate-900 bg-slate-900 p-2 shadow-[0_30px_90px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
                <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[34px] bg-slate-50 text-slate-900">
                  {/* Status Bar */}
                  <div className="flex h-8 items-center justify-between px-6 pt-1 text-[11px] font-bold text-slate-900">
                    <span>9:41</span>
                    <div className="h-4.5 w-18 rounded-full bg-slate-950" />
                    <div className="flex items-center gap-1.5">
                      <Wifi size={11} />
                      <Battery size={13} />
                    </div>
                  </div>

                  {/* App Dashboard Header */}
                  <div className="border-b border-slate-200 bg-white px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                          Sunday Food Box
                        </p>
                        <h4 className="text-sm font-black text-slate-900">Fulfillment Batch</h4>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        48 Orders Paid
                      </span>
                    </div>

                    {/* Search bar inside mockup */}
                    <div className="mt-2.5 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-400">
                      <Search size={12} />
                      <span>Search customer, address, or dish...</span>
                    </div>
                  </div>

                  {/* Prep Totals Summary */}
                  <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 hide-scrollbar">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Kitchen Aggregates
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                        <span className="text-[10px] text-slate-500">Party Jollof Bowls</span>
                        <p className="text-lg font-black text-slate-900">45</p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                        <span className="text-[10px] text-slate-500">Grilled Chicken</span>
                        <p className="text-lg font-black text-slate-900">37</p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                        <span className="text-[10px] text-slate-500">Fried Plantain</span>
                        <p className="text-lg font-black text-slate-900">26</p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                        <span className="text-[10px] text-slate-500">Zobo Juice (500ml)</span>
                        <p className="text-lg font-black text-slate-900">42</p>
                      </div>
                    </div>

                    <p className="pt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Recent Paid Orders
                    </p>
                    <div className="rounded-xl border border-slate-200 bg-white p-2.5 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span>#1042 · Tolu A.</span>
                        <span className="text-emerald-600 font-extrabold">₦11,000</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        2x Jollof + Chicken, 1x Plantain
                      </p>
                      <span className="flex items-center gap-1 text-[10px] text-slate-400">
                        <MapPin size={9} /> Lekki Phase 1 (Door Delivery)
                      </span>
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div className="border-t border-slate-200 bg-white p-3">
                    <div className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2 text-xs font-bold text-white shadow-xs">
                      <PackageCheck size={14} /> Export Dispatch Manifest
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Verified Highlight Card (like in reference image) */}
              <div className="absolute -bottom-6 -left-8 z-20 w-64 rounded-2xl border border-slate-200/80 bg-white/95 p-3.5 text-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.25)] backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    <Image
                      src="https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=200&q=80"
                      alt="Order Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className="truncate text-xs font-extrabold text-slate-900">
                        Amaka&apos;s Kitchen
                      </h5>
                    </div>
                    <p className="text-[10px] text-slate-500">Order #1042 · 2 Items</p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-xs font-black text-indigo-700">₦11,000</span>
                      <span className="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800">
                        ✓ Paid
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
