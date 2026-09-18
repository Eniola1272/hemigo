"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form-field";
export default function ResetPassword(){const search=useSearchParams();const router=useRouter();const[error,setError]=useState("");async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();const f=new FormData(e.currentTarget);const response=await fetch("/api/auth/reset-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:search.get("token"),password:f.get("password")})});const body=await response.json();if(!response.ok)return setError(body.error);router.push("/login")}return <AuthShell quote="A calmer operation makes room for better work."><h1 className="text-4xl font-bold tracking-tight">Choose a new password.</h1><form onSubmit={submit} className="mt-8 grid gap-5"><Field label="New password"><Input name="password" type="password" minLength={8} required/></Field>{error&&<p className="text-sm text-red-700">{error}</p>}<Button type="submit">Save new password</Button></form></AuthShell>}
