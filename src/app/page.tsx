import { ArrowRight, CalendarClock, Check, Clock3, PackageCheck, ShoppingBag, Sparkles, Store, WalletCards } from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { HeroDemo } from "@/components/marketing/hero-demo";
import { Button } from "@/components/ui/button";
import { CommerceFlow } from "@/components/illustrations/commerce-flow";
import { Logo } from "@/components/brand/logo";

const steps = [
  ["01", "Create your selling window", "Choose when orders open, when they close, and what you’re selling.", CalendarClock],
  ["02", "Add what you’re selling", "Set your prices, available quantity, and customer limits.", ShoppingBag],
  ["03", "Share your Hemigo link", "One clean link for WhatsApp, Instagram, or anywhere your customers are.", Store],
  ["04", "Prepare exactly what was ordered", "See every item totalled up for you. No chat-counting required.", PackageCheck],
] as const;
const uses = [
  ["Weekend food", "Saturday Food Box", "Closes Friday · 6PM", "bg-amber-50 text-amber-800"],
  ["Thrift", "Vintage September Release", "24 pieces available", "bg-zinc-900 text-white"],
  ["Farm produce", "September Tomato Batch", "Orders close Wednesday", "bg-emerald-50 text-emerald-800"],
  ["Cakes", "Friday Cake Batch", "12 slots remaining", "bg-indigo-50 text-indigo-800"],
] as const;

export default function Home() {
  return (
    <main className="overflow-hidden bg-white">
      <Navbar />
      <section className="relative px-0 pb-24 pt-20 sm:pt-28">
        <div className="absolute right-[-120px] top-24 -z-0 size-[360px] rounded-full bg-amber-100/70 blur-3xl" />
        <div className="container-shell relative z-10 text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-xs font-bold text-indigo-700"><span className="live-dot size-2 rounded-full bg-emerald-500"/>Built for modern African sellers</div>
          <h1 className="display balance mx-auto max-w-5xl text-slate-950">Sell in batches.<br/><span className="text-indigo-700">Fulfill without chaos.</span></h1>
          <p className="balance mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-600">Create a storefront, set when orders close, collect payments and know exactly what you need to prepare.</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><Button href="/signup" size="lg">Start selling <ArrowRight size={18}/></Button><Button href="#how" tone="secondary" size="lg">See how it works</Button></div>
          <HeroDemo />
        </div>
      </section>

      <section className="bg-slate-950 py-24 text-white">
        <div className="container-shell grid items-center gap-14 lg:grid-cols-[.88fr_1.12fr]">
          <div><p className="eyebrow text-amber-400">Less chasing. More selling.</p><h2 className="section-title balance mt-4">WhatsApp was never meant to run your business.</h2><p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">No more matching transfers to chats, recounting orders, or telling the fifth person that the last item just sold.</p>
            <div className="mt-8 grid gap-3 text-sm text-slate-200 sm:grid-cols-2">{["Have you seen my payment?","Can I still order?","Add two chicken please","Please confirm my order"].map((text,i)=><div key={text} className={`rounded-[14px] p-4 ${i%2 ? "bg-indigo-600" : "bg-slate-800"}`}>{text}</div>)}</div>
            <p className="mt-8 flex items-center gap-3 font-semibold"><span className="grid size-8 place-items-center rounded-full bg-emerald-500"><Check size={16}/></span>Hemigo turns all of that into one selling link.</p>
          </div><div className="rounded-[24px] bg-white p-4 sm:p-8"><CommerceFlow /></div>
        </div>
      </section>

      <section id="how" className="py-28">
        <div className="container-shell"><div className="max-w-2xl"><p className="eyebrow text-indigo-700">Four calm steps</p><h2 className="section-title mt-4">From “I’m selling” to completely sorted.</h2></div>
          <div className="mt-14 grid gap-px overflow-hidden rounded-[18px] border border-slate-200 bg-slate-200 md:grid-cols-2 lg:grid-cols-4">{steps.map(([number,title,copy,Icon])=><article key={number} className="group bg-white p-7 transition hover:bg-indigo-50/50"><div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-400">{number}</span><Icon className="text-indigo-700" size={23}/></div><h3 className="mt-14 text-xl font-bold tracking-tight">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p></article>)}</div>
        </div>
      </section>

      <section id="product" className="bg-slate-50 py-28">
        <div className="container-shell"><div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]"><div className="lg:sticky lg:top-28 lg:self-start"><p className="eyebrow text-indigo-700">Built for the drop</p><h2 className="section-title mt-4">Everything your selling window needs.</h2><p className="mt-6 max-w-md text-lg leading-8 text-slate-600">The deadline is clear, inventory stays honest, and every paid order rolls into a plan you can actually fulfill.</p><Button href="/amaka-kitchen/sunday-lunch" tone="secondary" className="mt-8">View live storefront <ArrowRight size={17}/></Button></div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[[Clock3,"Live countdown","Ordering closes itself at the exact time you choose.","Closes in 05:42:18","text-amber-600"],[PackageCheck,"Fulfillment totals","Know exactly what to buy, cook, pack, or source.","45 Jollof · 37 Chicken","text-indigo-700"],[WalletCards,"Automatic payments","Collect online and receive your share through Paystack.","Paid · Split complete","text-emerald-600"],[Sparkles,"Inventory that behaves","Limit stock and stop overselling—even during a rush.","Only 7 left","text-amber-600"]].map(([Icon,title,copy,sample,color])=><article key={String(title)} className="card p-7"><span className={`grid size-12 place-items-center rounded-[12px] bg-slate-100 ${color}`}><Icon size={23}/></span><h3 className="mt-8 text-xl font-bold">{String(title)}</h3><p className="mt-3 leading-7 text-slate-600">{String(copy)}</p><div className={`mt-8 border-t border-slate-100 pt-5 text-sm font-bold ${color}`}>{String(sample)}</div></article>)}
            </div></div></div>
      </section>

      <section id="uses" className="py-28"><div className="container-shell"><p className="eyebrow text-indigo-700">Made for many kinds of selling</p><h2 className="section-title balance mt-4 max-w-3xl">Food today. Fashion tomorrow. Hemigo fits the way you sell.</h2><div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{uses.map(([type,title,meta,theme])=><article key={type} className={`flex min-h-72 flex-col justify-between rounded-[18px] p-6 ${theme}`}><p className="eyebrow opacity-70">{type}</p><div><h3 className="text-2xl font-bold tracking-tight">{title}</h3><p className="mt-3 text-sm opacity-75">{meta}</p></div></article>)}</div></div></section>

      <section id="pricing" className="pb-28"><div className="container-shell"><div className="relative overflow-hidden rounded-[24px] bg-indigo-700 px-7 py-16 text-center text-white sm:px-16 sm:py-20"><div className="absolute -left-14 -top-20 size-60 rounded-full border-[36px] border-white/10"/><p className="eyebrow text-indigo-200">Your next batch should be easier</p><h2 className="section-title balance mx-auto mt-4 max-w-3xl">Start with one window. Leave the order chaos behind.</h2><p className="mx-auto mt-5 max-w-xl text-indigo-100">Free to create your storefront. A simple fee applies only when you make a sale.</p><div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><Button href="/signup" tone="secondary" size="lg">Create your first Hemigo</Button><Button href="/login" tone="ghost" size="lg" className="text-white hover:bg-white/10">Log in</Button></div></div></div></section>
      <footer className="border-t border-slate-200 py-10"><div className="container-shell flex flex-col items-center justify-between gap-5 sm:flex-row"><Logo/><p className="text-sm text-slate-500">Scheduled commerce for modern African sellers.</p><p className="text-sm text-slate-400">© 2026 Hemigo</p></div></footer>
    </main>
  );
}
