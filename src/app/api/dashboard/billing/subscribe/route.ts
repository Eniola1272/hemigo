import { NextResponse } from "next/server";
import { requireVendor } from "@/lib/auth/session";
import { initializeVendorSubscription } from "@/lib/services/subscriptions";
export async function POST(){const{vendor}=await requireVendor();try{return NextResponse.json(await initializeVendorSubscription(vendor.id))}catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Could not start subscription."},{status:400})}}
