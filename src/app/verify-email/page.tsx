"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MailCheck, RefreshCw, CheckCircle2, ArrowLeft } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";

export default function VerifyEmail() {
  const search = useSearchParams();
  const dev = search.get("dev");
  const email = search.get("email");

  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [resendError, setResendError] = useState("");

  async function handleResend() {
    if (!email || resending) return;
    setResending(true);
    setResendStatus(null);
    setResendError("");

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to resend verification email.");
      setResendStatus("A fresh verification link has been sent to your inbox!");
    } catch (err) {
      setResendError(err instanceof Error ? err.message : "Failed to resend verification email.");
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthShell quote="One clean link replaced a hundred messages.">
      <div className="grid size-14 place-items-center rounded-2xl bg-indigo-50 text-indigo-700 shadow-2xs">
        <MailCheck size={32} />
      </div>

      <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900">
        Check your inbox.
      </h1>

      <p className="mt-3 leading-7 text-slate-600">
        We sent a verification link to <strong>{email || "your email address"}</strong>. Please click the link inside to verify your account and activate your store.
      </p>

      {/* Resend actions */}
      <div className="mt-7 space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-5">
        <p className="text-xs font-semibold text-slate-600">
          Didn&apos;t receive the email? Check your spam folder, or request a new link:
        </p>

        {resendStatus && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-xs font-medium text-emerald-800">
            <CheckCircle2 size={16} className="flex-shrink-0 text-emerald-600" />
            <span>{resendStatus}</span>
          </div>
        )}

        {resendError && (
          <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700">
            {resendError}
          </div>
        )}

        {email && (
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="flex items-center justify-center gap-2 w-full rounded-xl border border-slate-300 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={13} className={resending ? "animate-spin text-indigo-600" : ""} />
            <span>{resending ? "Sending fresh link…" : "Resend verification email"}</span>
          </button>
        )}
      </div>

      {/* Dev helper if offline or testing */}
      {dev && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
          <p className="font-bold">Development shortcut:</p>
          <a href={dev} className="mt-1 block underline font-mono text-[11px] break-all">
            {dev}
          </a>
        </div>
      )}

      <div className="mt-7 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft size={13} /> Back to log in
        </Link>
      </div>
    </AuthShell>
  );
}
