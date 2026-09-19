"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
export function SubscribeButton(){const[busy,setBusy]=useState(false);const[error,setError]=useState("");async function subscribe(){setBusy(true);const response=await fetch("/api/dashboard/billing/subscribe",{method:"POST"});const body=await response.json();if(!response.ok){setError(body.error??"Could not start subscription.");setBusy(false);return}window.location.href=body.authorization_url}return <div><Button onClick={subscribe} disabled={busy} size="lg">{busy?"Opening Paystack…":"Start ₦1,000/month"}</Button>{error&&<p className="mt-3 text-sm text-red-700">{error}</p>}</div>}
