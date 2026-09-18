import { NextResponse } from "next/server";
import { runMaintenance } from "@/lib/services/maintenance";
export async function POST(request:Request){const secret=process.env.CRON_SECRET;if(!secret||request.headers.get("authorization")!==`Bearer ${secret}`)return NextResponse.json({error:"Unauthorized"},{status:401});return NextResponse.json(await runMaintenance())}
