import { NextResponse } from "next/server";
import { z } from "zod";
import { requireVendor } from "@/lib/auth/session";
import { db } from "@/lib/db";
const schema=z.object({name:z.string().trim().min(2).max(140),startsAt:z.coerce.date(),venue:z.string().trim().min(2).max(300),capacity:z.coerce.number().int().positive().max(1_000_000)});
export async function GET(){const{vendor}=await requireVendor();const events=await db.event.findMany({where:{vendorId:vendor.id},include:{products:true},orderBy:{startsAt:"asc"}});return NextResponse.json({events})}
export async function POST(request:Request){const{vendor}=await requireVendor();const parsed=schema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:parsed.error.issues[0]?.message??"Check the event details."},{status:400});const base=parsed.data.name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");let slug=base;let suffix=1;while(await db.event.findUnique({where:{vendorId_slug:{vendorId:vendor.id,slug}},select:{id:true}}))slug=`${base}-${++suffix}`;const event=await db.event.create({data:{vendorId:vendor.id,slug,...parsed.data}});return NextResponse.json({event},{status:201})}
