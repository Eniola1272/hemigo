"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form-field";

export function ContactForm() {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    const body = await response.json();
    if (!response.ok) {
      setError(body.error || "We could not send your message. Please try again.");
      setBusy(false);
      return;
    }
    setSent(true);
    setBusy(false);
  }

  if (sent) {
    return (
      <div className="card p-8 text-center sm:p-10" role="status">
        <CheckCircle2 className="mx-auto text-emerald-500" size={48} />
        <h2 className="mt-5 text-2xl font-bold">Your message is with us.</h2>
        <p className="mx-auto mt-2 max-w-md leading-7 text-slate-500">
          Thank you for reaching out. The Hemigo team will reply by email as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card grid gap-5 p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name"><Input name="name" autoComplete="name" required /></Field>
        <Field label="Email address"><Input name="email" type="email" autoComplete="email" required /></Field>
      </div>
      <Field label="What can we help with?">
        <Select name="topic" defaultValue="General enquiry">
          <option>General enquiry</option>
          <option>Seller support</option>
          <option>Buyer support</option>
          <option>Payments and billing</option>
          <option>Partnerships</option>
          <option>Privacy and safety</option>
        </Select>
      </Field>
      <Field label="Subject"><Input name="subject" required maxLength={160} /></Field>
      <Field label="Message" hint="Please do not include passwords, card details or other sensitive information.">
        <Textarea name="message" required minLength={20} maxLength={4000} rows={7} />
      </Field>
      <div className="hidden" aria-hidden="true">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      {error && <p role="alert" className="rounded-[10px] bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
      <Button type="submit" size="lg" disabled={busy} className="sm:justify-self-start">
        {busy ? "Sending…" : <><Send size={17} />Send message</>}
      </Button>
    </form>
  );
}
