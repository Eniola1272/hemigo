import { notFound } from "next/navigation";
import { Checkout } from "@/components/storefront/checkout";
import { db } from "@/lib/db";
import { isWindowAcceptingOrders, needsPhysicalFulfillment } from "@/lib/commerce";

export default async function CheckoutPage({params}:{params:Promise<{windowId:string}>}){
  const {windowId}=await params;
  const window=await db.sellingWindow.findUnique({where:{id:windowId},include:{vendor:true,windowProducts:{include:{product:true}}}});
  if(!window||window.status==="DRAFT")notFound();
  if(!isWindowAcceptingOrders(window))notFound();
  const products=window.windowProducts.filter(item=>item.product.active);
  return <Checkout data={{windowId:window.id,windowName:window.name,vendorName:window.vendor.name,deliveryEnabled:window.vendor.deliveryEnabled,pickupEnabled:window.vendor.pickupEnabled,deliveryFeeKobo:window.vendor.deliveryFeeKobo,allowPayLater:window.allowPayLater,invoiceHoldMinutes:window.invoiceHoldMinutes,requiresPhysicalFulfillment:needsPhysicalFulfillment(products.map(item=>item.product.type)),products:products.map(item=>({id:item.id,name:item.product.name,priceKobo:item.priceKobo}))}}/>;
}
