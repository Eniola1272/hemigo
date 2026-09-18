import { NextResponse } from "next/server";
import { z } from "zod";
import { requireVendor } from "@/lib/auth/session";
import { db } from "@/lib/db";
const schema=z.object({name:z.string().min(2),category:z.string().min(2),phone:z.string().min(10),whatsapp:z.string().optional(),location:z.string().optional(),deliveryEnabled:z.boolean(),pickupEnabled:z.boolean(),deliveryFeeNaira:z.coerce.number().min(0)});
export async function PATCH(request:Request){const{vendor}=await requireVendor();const parsed=schema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:parsed.error.issues[0]?.message},{status:400});const{deliveryFeeNaira,...data}=parsed.data;const updated=await db.vendorProfile.update({where:{id:vendor.id},data:{...data,whatsapp:data.whatsapp||null,location:data.location||null,deliveryFeeKobo:Math.round(deliveryFeeNaira*100)}});return NextResponse.json({vendor:updated})}
