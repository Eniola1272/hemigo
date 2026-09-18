import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireVendor } from "@/lib/auth/session";

export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){
  const{vendor}=await requireVendor();const{id}=await params;const body=await request.json();
  const order=await db.order.findFirst({where:{id,vendorId:vendor.id},select:{id:true,status:true}});
  if(!order)return NextResponse.json({error:"Order not found."},{status:404});
  if(body.action!=="fulfill")return NextResponse.json({error:"Unsupported action."},{status:400});
  if(order.status!=="PAID")return NextResponse.json({error:"Only paid orders can be fulfilled."},{status:409});
  const updated=await db.order.update({where:{id},data:{fulfillmentStatus:"FULFILLED",fulfilledAt:new Date()}});
  return NextResponse.json({order:updated});
}
