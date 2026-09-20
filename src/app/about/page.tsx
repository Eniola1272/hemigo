import type { Metadata } from "next";
import { ArrowRight, CalendarClock, PackageCheck, Store, WalletCards } from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { MarketingFooter } from "@/components/marketing/footer";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About us",
  description: "Learn why Hemigo is building a calmer commerce platform for independent sellers, launches, shops and events.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Hemigo",
    description: "Commerce should feel organised before, during and after the sale.",
    url: "/about",
    type: "website",
    locale: "en_NG",
    siteName: "Hemigo",
    images: [{ url: siteConfig.logo, width: 2172, height: 724, alt: "About Hemigo" }],
  },
  twitter: { card: "summary_large_image", title: "About Hemigo", description: "Commerce should feel organised before, during and after the sale.", images: [siteConfig.logo] },
};

const pillars = [
  [CalendarClock, "Launch with intention", "Set the offer, timing and rules before orders begin."],
  [Store, "Sell your way", "Run a limited launch, an always-open shop, a service or an event."],
  [PackageCheck, "Operate calmly", "Keep payments, customers, messages and fulfillment connected."],
  [WalletCards, "Know your money", "Give every payment, invoice, receipt and settlement a clear record."],
] as const;

export default async function AboutPage() {
  const user = await getCurrentUser();
  const hasVendor = user ? Boolean(await db.vendorMember.findFirst({ where: { userId: user.id }, select: { id: true } })) : false;
  return <main className="min-h-screen bg-white"><Navbar user={user?{name:user.name||user.email,hasVendor}:null}/><section className="relative overflow-hidden border-b bg-slate-950 py-24 text-white sm:py-32"><div className="absolute -right-28 -top-28 size-96 rounded-full bg-indigo-600/30 blur-3xl"/><div className="container-shell relative"><p className="eyebrow text-amber-400">About Hemigo</p><h1 className="balance mt-5 max-w-4xl text-5xl font-bold tracking-[-.055em] sm:text-7xl">Commerce should feel calm, even when demand is not.</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">Hemigo helps independent businesses move from announcing an offer to getting paid and fulfilling every order—without running the operation from scattered chats and spreadsheets.</p></div></section><section className="py-24"><div className="container-shell grid gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow text-indigo-700">Why we exist</p><h2 className="section-title mt-4">Built around how people actually sell.</h2></div><div className="space-y-6 text-lg leading-8 text-slate-600"><p>Many businesses do not sell from a permanent catalogue. They launch a weekend food batch, release a small fashion collection, open ticket sales, take preorders or sell a limited number of service slots.</p><p>The sale may begin on social media, but the work quickly spreads across messages, transfers, notes and manual customer updates. Hemigo brings that workflow into one place while keeping the seller&apos;s brand and customer relationship at the centre.</p><p>Our goal is simple: make independent commerce more organised, trustworthy and sustainable.</p></div></div></section><section className="bg-slate-50 py-24"><div className="container-shell"><p className="eyebrow text-indigo-700">The Hemigo model</p><h2 className="section-title mt-4 max-w-3xl">One platform from launch to fulfillment.</h2><div className="mt-12 grid gap-4 md:grid-cols-2">{pillars.map(([Icon,title,copy])=><article key={title} className="card p-7"><span className="grid size-12 place-items-center rounded-[12px] bg-indigo-50 text-indigo-700"><Icon/></span><h3 className="mt-7 text-xl font-bold">{title}</h3><p className="mt-3 leading-7 text-slate-600">{copy}</p></article>)}</div></div></section><section className="py-24"><div className="container-shell rounded-[24px] bg-indigo-700 px-7 py-14 text-center text-white sm:px-14"><p className="eyebrow text-indigo-200">Build your next thing</p><h2 className="balance mx-auto mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">If you are ready to sell it, Hemigo should help you launch it well.</h2><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Button href="/signup" tone="secondary" size="lg">Start selling <ArrowRight size={18}/></Button><Button href="/contact" tone="ghost" size="lg" className="text-white hover:bg-white/10">Talk to us</Button></div></div></section><MarketingFooter/></main>;
}
