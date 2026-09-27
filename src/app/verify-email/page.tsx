"use client";
import { useSearchParams } from "next/navigation";
import { MailCheck } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
export default function VerifyEmail(){const search=useSearchParams();const dev=search.get("dev");const email=search.get("email");return <AuthShell quote="One clean link replaced a hundred messages."><MailCheck className="text-indigo-700" size={38}/><h1 className="mt-5 text-4xl font-bold tracking-tight">Check your inbox.</h1><p className="mt-3 leading-7 text-slate-500">We sent a verification link to <strong>{email||"your email"}</strong>. It expires in 24 hours.</p><div className="mt-7 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4"><p className="text-xs font-bold text-indigo-900">VERIFICATION BYPASS (PENDING DOMAIN)</p><p className="mt-1 text-sm text-indigo-800">Email delivery is currently pending custom domain connection. You can verify and continue right now:</p><Button href={dev||"/onboarding"} className="mt-3 w-full">Verify Account Immediately</Button></div></AuthShell>}
