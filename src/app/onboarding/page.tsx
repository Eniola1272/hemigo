"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Landmark, Link2, MessageCircle, Store } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/form-field";

const steps = [
  { icon: Store, eyebrow: "Step 1 of 4", title: "What should customers call your business?", copy: "This will appear at the top of every storefront." },
  { icon: Link2, eyebrow: "Step 2 of 4", title: "Claim your Hemigo link", copy: "Keep it short, memorable, and easy to share." },
  { icon: MessageCircle, eyebrow: "Step 3 of 4", title: "How should customers reach you?", copy: "We’ll show the right contact details after an order." },
  { icon: Landmark, eyebrow: "Step 4 of 4", title: "Where should we send your money?", copy: "This will be used to create your Paystack subaccount." },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({ name: "", category: "Food & catering", slug: "", phone: "", whatsapp: "", contactEmail: "", bankName: "", accountNumber: "", accountName: "" });
  const router = useRouter();
  const item = steps[step];
  const Icon = item.icon;
  const set = (key: keyof typeof data, value: string) => setData((current) => ({ ...current, [key]: value }));
  const next = async () => {
    setError("");
    if (step < 3) return setStep(step + 1);
    setBusy(true);
    const response = await fetch("/api/onboarding", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const result = await response.json();
    if (!response.ok) { setError(result.error ?? "Could not finish setup."); setBusy(false); return; }
    router.push("/dashboard"); router.refresh();
  };
  return <main className="min-h-screen bg-slate-50"><header className="border-b border-slate-200 bg-white"><div className="container-shell flex h-18 items-center justify-between"><Logo/><button className="text-sm font-semibold text-slate-500">Save & exit</button></div></header><div className="container-shell grid gap-12 py-12 lg:grid-cols-[.7fr_1.3fr]"><aside><div className="sticky top-28"><span className="grid size-12 place-items-center rounded-[12px] bg-indigo-100 text-indigo-700"><Icon/></span><p className="eyebrow mt-7 text-indigo-700">{item.eyebrow}</p><h1 className="mt-3 text-4xl font-bold leading-tight tracking-[-.05em]">{item.title}</h1><p className="mt-4 leading-7 text-slate-500">{item.copy}</p></div></aside><section className="card p-6 sm:p-10"><div className="grid min-h-[320px] content-start gap-6">
    {step===0&&<><Field label="Business name"><Input value={data.name} onChange={(e)=>{set("name",e.target.value);if(!data.slug)set("slug",e.target.value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""))}} placeholder="Amaka's Kitchen"/></Field><Field label="Business category"><Select value={data.category} onChange={(e)=>set("category",e.target.value)}><option>Food & catering</option><option>Fashion & thrift</option><option>Farm produce</option><option>Beauty & cosmetics</option><option>Other</option></Select></Field></>}
    {step===1&&<Field label="Store link"><div className="flex overflow-hidden rounded-[10px] border border-slate-200"><span className="flex items-center bg-slate-50 px-3 text-sm text-slate-500">hemigo.ng/</span><Input value={data.slug} onChange={(e)=>set("slug",e.target.value.toLowerCase())} className="rounded-none border-0"/></div></Field>}
    {step===2&&<><Field label="Phone number"><Input value={data.phone} onChange={(e)=>set("phone",e.target.value)} placeholder="080 0000 0000"/></Field><Field label="WhatsApp number"><Input value={data.whatsapp} onChange={(e)=>set("whatsapp",e.target.value)} placeholder="080 0000 0000"/></Field><Field label="Contact email (optional)"><Input value={data.contactEmail} onChange={(e)=>set("contactEmail",e.target.value)} type="email"/></Field></>}
    {step===3&&<><Field label="Bank"><Input value={data.bankName} onChange={(e)=>set("bankName",e.target.value)} placeholder="Guaranty Trust Bank"/></Field><Field label="Account number"><Input value={data.accountNumber} onChange={(e)=>set("accountNumber",e.target.value)} inputMode="numeric" maxLength={10}/></Field><Field label="Account name"><Input value={data.accountName} onChange={(e)=>set("accountName",e.target.value)} placeholder="AMAKA OKAFOR"/></Field>{data.accountName&&<div className="rounded-[10px] bg-emerald-50 p-4 text-sm text-emerald-800"><Check className="mr-2 inline" size={17}/>{data.accountName}</div>}</>}
    {error&&<p role="alert" className="rounded-[9px] bg-red-50 p-3 text-sm text-red-700">{error}</p>}
  </div><div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6"><div className="flex gap-1.5">{steps.map((_,i)=><span key={i} className={`h-1.5 rounded-full ${i<=step?"w-8 bg-indigo-600":"w-4 bg-slate-200"}`}/>)}</div><Button onClick={next} disabled={busy}>{step===3?(busy?"Creating your store…":"Open my dashboard"):"Continue"}<ArrowRight size={17}/></Button></div></section></div></main>;
}
