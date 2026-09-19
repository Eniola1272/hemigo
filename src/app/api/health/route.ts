import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { productionConfigIssues } from "@/lib/env";
export async function GET(){const issues=productionConfigIssues();try{await db.$queryRaw`SELECT 1`;if(issues.length)return NextResponse.json({status:"degraded",database:"connected",configuration:"invalid",issues,time:new Date().toISOString()},{status:503});return NextResponse.json({status:"ok",database:"connected",configuration:"valid",time:new Date().toISOString()})}catch{return NextResponse.json({status:"degraded",database:"unavailable",configuration:issues.length?"invalid":"valid",issues},{status:503})}}
