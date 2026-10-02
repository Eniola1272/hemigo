import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  Check,
  Clock3,
  PackageCheck,
  Search,
  ShoppingBag,
  Store,
} from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { HeroFerrisCarousel } from "@/components/marketing/hero-ferris-carousel";
import { FeatureBanner } from "@/components/marketing/feature-banner";
import { Button } from "@/components/ui/button";
import { CommerceFlow } from "@/components/illustrations/commerce-flow";
import { MarketingFooter } from "@/components/marketing/footer";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Sell in batches. Fulfill without chaos. | Hemigo",
  description:
    "Create a storefront, set when orders close, collect Paystack payments, and know exactly what you need to prepare.",
  alternates: { canonical: "/" },
};

const steps = [
  [
    "01",
    "Create your selling window",
    "Choose when orders open, when they close, and what you’re selling.",
    CalendarClock,
  ],
  [
    "02",
    "Add what you’re selling",
    "Set your prices, available quantity, customer limits, and cloud photos.",
    ShoppingBag,
  ],
  [
    "03",
    "Share your Hemigo link",
    "One clean link for WhatsApp, Instagram, or anywhere your customers are.",
    Store,
  ],
  [
    "04",
    "Prepare exactly what was ordered",
    "See every item totalled up for you. No chat-counting required.",
    PackageCheck,
  ],
] as const;

const uses = [
  ["Weekend food", "Sunday Food Box", "Closes Friday · 6PM", "bg-amber-50 text-amber-900 border-amber-200"],
  ["Thrift drops", "Vintage 90s Release", "24 pieces available", "bg-zinc-900 text-white border-zinc-800"],
  ["Farm harvest", "Fresh Tomato & Herb Batch", "Orders close Wednesday", "bg-emerald-50 text-emerald-950 border-emerald-200"],
  ["Artisan bakery", "Saturday Sourdough Run", "12 slots remaining", "bg-indigo-50 text-indigo-950 border-indigo-200"],
] as const;

export default async function Home() {
  const currentUser = await getCurrentUser();
  const hasVendor = currentUser
    ? Boolean(
        await db.vendorMember.findFirst({
          where: { userId: currentUser.id },
          select: { id: true },
        }),
      )
    : false;

  return (
    <main className="overflow-hidden bg-white text-slate-900">
      <Navbar
        user={
          currentUser
            ? { name: currentUser.name || currentUser.email, hasVendor }
            : null
        }
      />

      {/* ================= HERO SECTION ================= */}
      <section className="relative px-0 pb-16 pt-12 sm:pt-20 lg:pt-24">
        {/* Soft background ambient blurs */}
        <div className="pointer-events-none absolute left-1/2 top-10 -z-10 h-[480px] w-full max-w-5xl -translate-x-1/2 rounded-full bg-gradient-to-b from-indigo-50/60 via-amber-50/40 to-transparent blur-3xl" />

        <div className="container-shell relative z-10 text-center">
          {/* Main Hero Headline matching reference */}
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-[72px] lg:leading-[1.05]">
            Rediscover the joy<br />
            of the <span className="text-indigo-600">batch drop</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-5 max-w-xl text-base sm:text-lg text-slate-600 leading-relaxed">
            One calm destination to launch your store, set your order deadline, and fulfill without chaos.
          </p>

          {/* Search / Explore Pill Bar (styled like reference) */}
          <form
            action="/explore"
            method="GET"
            className="mx-auto mt-8 flex w-full max-w-md items-center rounded-full border border-slate-200 bg-white p-1.5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100"
          >
            <input
              type="text"
              name="category"
              placeholder="Find food drops, vintage thrift, or stores..."
              className="w-full bg-transparent px-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
            >
              <Search size={13} />
              <span>Search</span>
            </button>
          </form>

          {/* The Horizontal Ferris Wheel Hero Carousel */}
          <HeroFerrisCarousel />
        </div>
      </section>

      {/* ================= SECOND HEADLINE SECTION ================= */}
      {/* Matches the clean centered section in the reference screenshot */}
      <section className="py-20 text-center sm:py-28">
        <div className="container-shell max-w-4xl">
          <h2 className="mx-auto max-w-3xl text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl sm:leading-tight">
            The only commerce platform your social business will ever need
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed">
            Explore batch selling, automate your inventory limits, and eliminate WhatsApp screenshot chasing for good.
          </p>
          <div className="mt-8 flex justify-center">
            <Button
              href="/signup"
              className="rounded-full bg-slate-950 px-8 py-3.5 text-sm font-bold text-white shadow-md hover:bg-slate-800 transition"
            >
              Start planning now →
            </Button>
          </div>
        </div>
      </section>

      {/* ================= FEATURE SHOWCASE BANNER ================= */}
      {/* Matches the plum/maroon card showcase from the reference screenshot */}
      <FeatureBanner />

      {/* ================= THE PROBLEM SECTION (WHATSAPP CHAOS) ================= */}
      <section className="bg-slate-950 py-24 text-white">
        <div className="container-shell grid items-center gap-14 lg:grid-cols-[.88fr_1.12fr]">
          <div>
            <p className="eyebrow text-amber-400">Less chasing. More selling.</p>
            <h2 className="section-title balance mt-4">
              WhatsApp was never meant to run your business.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              No more matching transfers to chats, recounting orders, or telling the fifth person that the last item just sold out.
            </p>
            <div className="mt-8 grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
              {[
                "Have you seen my payment?",
                "Can I still order?",
                "Add two chicken please",
                "Please confirm my order",
              ].map((text, i) => (
                <div
                  key={text}
                  className={`rounded-[14px] p-4 font-medium ${
                    i % 2 ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-200"
                  }`}
                >
                  {text}
                </div>
              ))}
            </div>
            <p className="mt-8 flex items-center gap-3 font-semibold text-slate-200">
              <span className="grid size-8 place-items-center rounded-full bg-emerald-500 text-white">
                <Check size={16} />
              </span>
              Hemigo turns all of that into one calm selling link.
            </p>
          </div>
          <div className="rounded-[24px] bg-white p-4 sm:p-8 shadow-2xl">
            <CommerceFlow />
          </div>
        </div>
      </section>

      {/* ================= FOUR CALM STEPS ================= */}
      <section id="how" className="py-28">
        <div className="container-shell">
          <div className="max-w-2xl">
            <p className="eyebrow text-indigo-700">Four calm steps</p>
            <h2 className="section-title mt-4">From “I’m selling” to completely sorted.</h2>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden rounded-[22px] border border-slate-200 bg-slate-200 md:grid-cols-2 lg:grid-cols-4">
            {steps.map(([number, title, copy, Icon]) => (
              <article
                key={number}
                className="group bg-white p-7 transition hover:bg-indigo-50/50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">{number}</span>
                  <Icon className="text-indigo-700" size={23} />
                </div>
                <h3 className="mt-14 text-xl font-bold tracking-tight">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TYPES OF SELLING ================= */}
      <section id="uses" className="py-24 bg-slate-50">
        <div className="container-shell">
          <p className="eyebrow text-indigo-700">Made for many kinds of selling</p>
          <h2 className="section-title balance mt-4 max-w-3xl">
            Food today. Fashion tomorrow. Hemigo fits the way you sell.
          </h2>
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {uses.map(([type, title, meta, theme]) => (
              <article
                key={type}
                className={`flex min-h-72 flex-col justify-between rounded-[22px] border p-6 shadow-xs ${theme}`}
              >
                <p className="eyebrow opacity-75">{type}</p>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
                  <p className="mt-3 text-sm opacity-80">{meta}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PRICING ================= */}
      <section id="pricing" className="py-24">
        <div className="container-shell">
          <div className="relative overflow-hidden rounded-[28px] bg-indigo-700 px-7 py-16 text-center text-white sm:px-16 sm:py-20 shadow-xl">
            <div className="absolute -left-14 -top-20 size-60 rounded-full border-[36px] border-white/10" />
            <p className="eyebrow text-indigo-200">Simple transparent pricing</p>
            <h2 className="section-title balance mx-auto mt-4 max-w-3xl text-white">
              Start selling free. Grow for ₦1,000/month.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-indigo-100">
              Your first month is free. Then Hemigo Vendor is ₦1,000 monthly, plus a 4% commerce processing fee that includes Paystack payments, automated receipts, cloud media, and order management.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                href="/signup"
                className="rounded-full bg-white px-7 py-3 text-sm font-bold text-slate-950 hover:bg-slate-100"
              >
                Create your first Hemigo
              </Button>
              <Button
                href="/login"
                tone="ghost"
                className="rounded-full text-white hover:bg-white/10"
              >
                Log in
              </Button>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
