"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form-field";

type PayoutVendor = {
  bankName: string | null;
  accountNumber: string | null;
  accountName: string | null;
  paystackSubaccountCode: string | null;
};

export function PayoutSetupForm({ vendor }: { vendor: PayoutVendor }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/dashboard/payouts/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bankName: form.get("bankName"),
        accountNumber: form.get("accountNumber"),
      }),
    });
    const result = await response.json();
    if (response.ok) {
      setMessage(`Connected as ${result.accountName}.`);
    } else {
      setError(result.error ?? "Could not connect this account.");
    }
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="card p-6">
      <div>
        <h2 className="font-bold">Payout account</h2>
        <p className="mt-1 text-sm text-slate-500">
          Paystack verifies the account before Hemigo saves it.
        </p>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Bank name">
          <Input
            name="bankName"
            defaultValue={vendor.bankName ?? ""}
            placeholder="Guaranty Trust Bank"
            required
          />
        </Field>
        <Field label="10-digit account number">
          <Input
            name="accountNumber"
            defaultValue={vendor.accountNumber ?? ""}
            inputMode="numeric"
            pattern="[0-9]{10}"
            maxLength={10}
            required
          />
        </Field>
      </div>
      {(message || error) && (
        <p
          role="status"
          className={`mt-4 rounded-[9px] p-3 text-sm font-semibold ${
            error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {error || message}
        </p>
      )}
      {vendor.paystackSubaccountCode && !message && (
        <p className="mt-4 text-sm font-semibold text-emerald-700">
          Connected{vendor.accountName ? ` as ${vendor.accountName}` : ""}.
        </p>
      )}
      <Button type="submit" disabled={busy} className="mt-5">
        {busy ? "Verifying…" : vendor.paystackSubaccountCode ? "Update account" : "Connect Paystack"}
      </Button>
    </form>
  );
}
