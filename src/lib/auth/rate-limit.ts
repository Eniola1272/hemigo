import { headers } from "next/headers";
import { db } from "@/lib/db";

export async function enforceAuthRateLimit(scope:string,identity:string,limit=8,windowMs=15*60_000){const requestHeaders=await headers();const ip=requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim()||"local";const key=`${scope}:${ip}:${identity.toLowerCase()}`;const now=new Date();const existing=await db.authRateLimit.findUnique({where:{key}});if(!existing||now.getTime()-existing.windowStart.getTime()>windowMs){await db.authRateLimit.upsert({where:{key},create:{key,count:1,windowStart:now},update:{count:1,windowStart:now}});return}if(existing.count>=limit)throw new Error("Too many attempts. Wait a few minutes and try again.");await db.authRateLimit.update({where:{key},data:{count:{increment:1}}})}
