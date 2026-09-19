import { MoreHorizontal, Plus, Search } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatNaira } from "@/lib/utils";
import { requireVendor } from "@/lib/auth/session";
import { db } from "@/lib/db";

export default async function ProductsPage() {
  const { vendor } = await requireVendor();
  const products = await db.product.findMany({ where: { vendorId: vendor.id }, include: { _count: { select: { windowItems: true } } }, orderBy: { createdAt: "desc" } });
  return <div className="space-y-7"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h1 className="text-3xl font-bold tracking-[-.04em]">Products</h1><p className="mt-2 text-slate-500">Your reusable catalogue for every selling window.</p></div><Button href="/dashboard/products/new"><Plus size={18}/>Add product</Button></div><div className="card flex items-center gap-3 p-3"><Search size={18} className="ml-1 text-slate-400"/><input className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" placeholder="Search products" aria-label="Search products"/></div>
    {products.length===0?<div className="card p-12 text-center"><h2 className="text-xl font-bold">Nothing here yet.</h2><p className="mt-2 text-slate-500">Add your first product and make your next selling window easier.</p><Button href="/dashboard/products/new" className="mt-5"><Plus size={17}/>Add product</Button></div>:<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{products.map((product)=><article key={product.id} className="card overflow-hidden"><div className="relative h-52 overflow-hidden"><Image src={product.imageUrl || "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80"} alt={product.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover transition duration-500 hover:scale-105"/><Badge tone={product.active?"success":"neutral"} className="absolute left-4 top-4 bg-white/95">{product.active?"ACTIVE":"ARCHIVED"}</Badge><Badge tone="indigo" className="absolute bottom-4 left-4 bg-white/95">{product.type.replace("_"," ")}</Badge><button className="absolute right-4 top-4 rounded-lg bg-white/95 p-2"><MoreHorizontal size={18}/></button></div><div className="p-5"><h2 className="text-lg font-bold">{product.name}</h2><p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{product.description}</p><div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4"><strong className="text-xl">{formatNaira(product.defaultPrice)}</strong><span className="text-xs text-slate-500">Used in {product._count.windowItems} windows</span></div></div></article>)}</div>}
  </div>;
}
