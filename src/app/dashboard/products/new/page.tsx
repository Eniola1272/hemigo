"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/form-field";

export default function NewProductPage() {
  const [busy,setBusy]=useState(false); const [error,setError]=useState(""); const router=useRouter();
  async function submit(event:React.FormEvent<HTMLFormElement>){event.preventDefault();setBusy(true);setError("");const f=new FormData(event.currentTarget);const response=await fetch("/api/dashboard/products",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:f.get("name"),description:f.get("description"),defaultPriceNaira:f.get("price"),imageUrl:f.get("imageUrl")})});const result=await response.json();if(!response.ok){setError(result.error??"Could not add product.");setBusy(false);return}router.push("/dashboard/products");router.refresh()}
  return <div className="mx-auto max-w-2xl"><Button href="/dashboard/products" tone="ghost" className="-ml-3"><ArrowLeft size={16}/>Products</Button><div className="card mt-5 p-6 sm:p-8"><p className="eyebrow text-indigo-700">New product</p><h1 className="mt-2 text-3xl font-bold tracking-tight">What are you selling?</h1><form onSubmit={submit} className="mt-7 grid gap-5"><Field label="Product name"><Input name="name" required placeholder="Smoky Jollof + Chicken"/></Field><Field label="Description"><Textarea name="description" required placeholder="Tell customers what they’re getting."/></Field><Field label="Default price (₦)"><Input name="price" type="number" min="1" required placeholder="5500"/></Field><Field label="Image URL" hint="Cloud image uploads will replace this field in production."><Input name="imageUrl" type="url" placeholder="https://…"/></Field>{error&&<p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<Button type="submit" disabled={busy}>{busy?"Adding product…":"Add product"}</Button></form></div></div>;
}
