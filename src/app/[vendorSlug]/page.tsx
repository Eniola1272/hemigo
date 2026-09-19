import { notFound } from "next/navigation";
import { Storefront } from "@/components/storefront/storefront";
import { db } from "@/lib/db";
import { isWindowAcceptingOrders, publicLocation } from "@/lib/commerce";

export default async function VendorShopPage({params}:{params:Promise<{vendorSlug:string}>}){
  const {vendorSlug}=await params;
  const window=await db.sellingWindow.findFirst({
    where:{vendor:{slug:vendorSlug},mode:"SHOP",status:{not:"DRAFT"}},
    include:{vendor:true,windowProducts:{include:{product:true},orderBy:{product:{createdAt:"asc"}}}},
    orderBy:{createdAt:"desc"},
  });
  if(!window)notFound();
  const data={windowId:window.id,vendorName:window.vendor.name,vendorSlug:window.vendor.slug,windowName:window.name,windowSlug:window.slug,headline:window.headline||window.name,description:window.description||"Shop the latest from this business.",location:publicLocation({visibility:window.vendor.locationVisibility,location:window.vendor.location,publicLocation:window.vendor.publicLocation}),opensAt:null,closesAt:null,mode:window.mode,theme:window.theme,isOpen:isWindowAcceptingOrders(window),products:window.windowProducts.filter(item=>item.product.active).map(item=>({id:item.id,name:item.product.name,description:item.product.description,type:item.product.type,priceKobo:item.priceKobo,image:item.product.imageUrl||"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1000&q=80",inventory:item.inventoryLimit,sold:item.soldQty,reserved:item.reservedQty,maxPerCustomer:item.maxPerCustomer}))};
  return <Storefront data={data}/>;
}
