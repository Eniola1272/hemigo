import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashToken } from "@/lib/auth/session";
export async function POST(request:Request){const{token,password}=await request.json();if(typeof password!=="string"||password.length<8)return NextResponse.json({error:"Use at least 8 characters."},{status:400});const record=await db.passwordResetToken.findUnique({where:{tokenHash:hashToken(String(token))}});if(!record||record.expiresAt<=new Date())return NextResponse.json({error:"This reset link has expired."},{status:400});await db.$transaction([db.user.update({where:{id:record.userId},data:{passwordHash:await hash(password,12)}}),db.passwordResetToken.deleteMany({where:{userId:record.userId}}),db.session.deleteMany({where:{userId:record.userId}})]);return NextResponse.json({success:true})}
