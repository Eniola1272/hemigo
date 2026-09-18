"use client";
import { useSearchParams } from "next/navigation";
import { MailCheck } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
export default function VerifyEmail(){const search=useSearchParams();const dev=search.get("dev");return <AuthShell quote="One clean link replaced a hundred messages."><MailCheck className="text-indigo-700" size={38}/><h1 className="mt-5 text-4xl font-bold tracking-tight">Check your inbox.</h1><p className="mt-3 leading-7 text-slate-500">We sent a verification link to <strong>{search.get("email")}</strong>. It expires in 24 hours.</p>{dev&&<div className="mt-7 rounded-xl border border-amber-200 bg-amber-50 p-4"><p className="text-xs font-bold text-amber-800">LOCAL DEVELOPMENT</p><p className="mt-2 text-sm text-amber-900">Email delivery is not configured, so use the development link below.</p><Button href={dev} className="mt-4 w-full">Verify local account</Button></div>}</AuthShell>}
