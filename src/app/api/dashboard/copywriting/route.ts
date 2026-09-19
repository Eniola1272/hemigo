import { NextResponse } from "next/server";
import { z } from "zod";
import { requireVendor } from "@/lib/auth/session";
import { db } from "@/lib/db";
const schema=z.object({windowId:z.string().optional(),audience:z.string().trim().min(2).max(500),tone:z.string().trim().min(2).max(80),notes:z.string().trim().max(2000).optional()});
export async function POST(request:Request){const{vendor}=await requireVendor();const parsed=schema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:parsed.error.issues[0]?.message??"Complete the request brief."},{status:400});if(parsed.data.windowId&&!await db.sellingWindow.findFirst({where:{id:parsed.data.windowId,vendorId:vendor.id},select:{id:true}}))return NextResponse.json({error:"Hemigo not found."},{status:404});const previous=await db.copywritingRequest.count({where:{vendorId:vendor.id}});const requestRecord=await db.copywritingRequest.create({data:{vendorId:vendor.id,...parsed.data,notes:parsed.data.notes||null,isFree:previous===0}});return NextResponse.json({request:requestRecord},{status:201})}
