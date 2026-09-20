import type { Metadata } from "next";
import { Clock3, Mail, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/marketing/contact-form";
import { MarketingFooter } from "@/components/marketing/footer";
import { Navbar } from "@/components/marketing/navbar";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Contact Hemigo for seller support, buyer support, billing questions, partnerships, privacy or general enquiries.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Hemigo",
    description: "Questions about selling, buying, payments or partnering with Hemigo? Talk to our team.",
    url: "/contact",
    type: "website",
    locale: "en_NG",
    siteName: "Hemigo",
    images: [{ url: siteConfig.logo, width: 2172, height: 724, alt: "Contact Hemigo" }],
  },
  twitter: { card: "summary_large_image", title: "Contact Hemigo", description: "Questions about selling, buying, payments or partnering with Hemigo? Talk to our team.", images: [siteConfig.logo] },
};

export default async function ContactPage() {
  const user = await getCurrentUser();
  const hasVendor = user ? Boolean(await db.vendorMember.findFirst({ where: { userId: user.id }, select: { id: true } })) : false;
  return <main className="min-h-screen bg-slate-50"><Navbar user={user?{name:user.name||user.email,hasVendor}:null}/><section className="border-b bg-white py-20"><div className="container-shell"><p className="eyebrow text-indigo-700">Contact us</p><h1 className="balance mt-4 max-w-4xl text-5xl font-bold tracking-[-.055em] sm:text-6xl">Tell us what you need help with.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Whether you are selling, buying, planning an event or exploring a partnership, send us the details and we will point you in the right direction.</p></div></section><section className="container-shell grid gap-8 py-14 lg:grid-cols-[.68fr_1.32fr]"><aside className="space-y-4"><div className="card p-6"><Mail className="text-indigo-700"/><h2 className="mt-5 font-bold">Email</h2><a href="mailto:hello@hemigo.ng" className="mt-1 block text-sm text-indigo-700">hello@hemigo.ng</a></div><div className="card p-6"><Clock3 className="text-indigo-700"/><h2 className="mt-5 font-bold">Response time</h2><p className="mt-1 text-sm leading-6 text-slate-500">We aim to respond within two business days.</p></div><div className="card p-6"><MessageCircle className="text-indigo-700"/><h2 className="mt-5 font-bold">Existing order?</h2><p className="mt-1 text-sm leading-6 text-slate-500">Use the message seller button on your order for the fastest order-specific help.</p></div></aside><ContactForm/></section><MarketingFooter/></main>;
}
