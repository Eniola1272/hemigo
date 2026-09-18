import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashToken } from "@/lib/auth/session";
import { sendEmail } from "@/lib/email";
import { enforceAuthRateLimit } from "@/lib/auth/rate-limit";
export async function POST(request:Request){const{email}=await request.json();try{await enforceAuthRateLimit("password-reset",String(email),5,60*60_000)}catch{return NextResponse.json({success:true})}const user=await db.user.findUnique({where:{email:String(email).toLowerCase()}});let devUrl:string|undefined;if(user){const token=randomBytes(32).toString("base64url");await db.passwordResetToken.deleteMany({where:{userId:user.id}});await db.passwordResetToken.create({data:{userId:user.id,tokenHash:hashToken(token),expiresAt:new Date(Date.now()+30*60_000)}});const url=`${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;devUrl=process.env.NODE_ENV!=="production"?url:undefined;await sendEmail({to:user.email,subject:"Reset your Hemigo password",html:`<p>Reset your password within 30 minutes:</p><p><a href="${url}">Reset password</a></p>`})}return NextResponse.json({success:true,devUrl})}
