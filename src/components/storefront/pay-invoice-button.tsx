"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function PayInvoiceButton({orderId}:{orderId:string}){
  const[busy,setBusy]=useState(false);const[error,setError]=useState("");
  async function pay(){setBusy(true);setError("");const response=await fetch("/api/payments/initialize",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderId})});const body=await response.json();if(!response.ok){setError(body.error??"Could not start payment.");setBusy(false);return}window.location.href=body.authorization_url}
  return <div><Button onClick={pay} disabled={busy} tone="purchase" size="lg" className="w-full">{busy?"Opening secure payment…":"Pay invoice"}</Button>{error&&<p className="mt-3 text-sm text-red-700">{error}</p>}</div>
}
