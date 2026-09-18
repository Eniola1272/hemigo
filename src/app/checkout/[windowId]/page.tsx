import { notFound } from "next/navigation";
import { Checkout } from "@/components/storefront/checkout";
import { db } from "@/lib/db";

export default async function CheckoutPage({params}:{params:Promise<{windowId:string}>}){
  const {windowId}=await params;
  const window=await db.sellingWindow.findUnique({where:{id:windowId},include:{vendor:true,windowProducts:{include:{product:true}}}});
  if(!window||window.status==="DRAFT")notFound();
  const now=new Date();if(window.opensAt>now||window.closesAt<=now)notFound();
  return <Checkout data={{windowId:window.id,windowName:window.name,vendorName:window.vendor.name,deliveryEnabled:window.vendor.deliveryEnabled,pickupEnabled:window.vendor.pickupEnabled,deliveryFeeKobo:window.vendor.deliveryFeeKobo,products:window.windowProducts.filter(item=>item.product.active).map(item=>({id:item.id,name:item.product.name,priceKobo:item.priceKobo}))}}/>;
}
