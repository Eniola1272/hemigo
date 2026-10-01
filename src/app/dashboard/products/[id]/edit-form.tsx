"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form-field";
import { ImageUpload } from "@/components/dashboard/image-upload";

interface ProductData {
  id: string;
  name: string;
  description: string;
  type: string;
  defaultPriceNaira: number;
  imageUrl: string;
  fulfillmentUrl: string;
  serviceDurationMinutes: number | string;
  eventId: string;
  active: boolean;
}

interface EventOption {
  id: string;
  name: string;
  startsAt: string;
}

export function EditProductForm({ product, events }: { product: ProductData; events: EventOption[] }) {
  const [busy, setBusy] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [type, setType] = useState(product.type);
  const router = useRouter();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setSuccess("");
    const f = new FormData(event.currentTarget);
    const response = await fetch(`/api/dashboard/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: f.get("name"),
        description: f.get("description"),
        type,
        defaultPriceNaira: f.get("price"),
        imageUrl: f.get("imageUrl") || "",
        fulfillmentUrl: f.get("fulfillmentUrl") || "",
        serviceDurationMinutes: f.get("serviceDurationMinutes") || "",
        eventId: f.get("eventId") || "",
      }),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error ?? "Could not update product.");
      setBusy(false);
      return;
    }
    setSuccess("Product updated.");
    setBusy(false);
    router.refresh();
  }

  async function archive() {
    if (!confirm("Archive this product? It will no longer appear in new selling windows.")) return;
    setArchiving(true);
    const response = await fetch(`/api/dashboard/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "archive" }),
    });
    if (!response.ok) {
      setError("Could not archive product.");
      setArchiving(false);
      return;
    }
    router.push("/dashboard/products");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Button href="/dashboard/products" tone="ghost" className="-ml-3">
        <ArrowLeft size={16} />Products
      </Button>
      <div className="card mt-5 p-6 sm:p-8">
        <p className="eyebrow text-indigo-700">Edit product</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Update your product.</h1>
        <form onSubmit={submit} className="mt-7 grid gap-5">
          <Field label="Product type">
            <Select value={type} onChange={(event) => setType(event.target.value)}>
              <option value="PHYSICAL">Physical product</option>
              <option value="FOOD">Food / preorder</option>
              <option value="DIGITAL">Digital product</option>
              <option value="TICKET">Ticket</option>
              <option value="SERVICE">Service</option>
            </Select>
          </Field>
          {type === "TICKET" && (
            events.length ? (
              <Field label="Event">
                <Select name="eventId" defaultValue={product.eventId} required>
                  <option value="">Choose an event</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name} · {new Date(event.startsAt).toLocaleDateString()}
                    </option>
                  ))}
                </Select>
              </Field>
            ) : (
              <div className="rounded-[10px] bg-amber-50 p-4 text-sm text-amber-900">
                Create the event before adding ticket types.
                <Button href="/dashboard/events/new" tone="ghost" className="mt-2">Create event</Button>
              </div>
            )
          )}
          <Field label={type === "TICKET" ? "Ticket type" : "Product name"}>
            <Input name="name" required defaultValue={product.name} placeholder={type === "TICKET" ? "VIP admission" : "Smoky Jollof + Chicken"} />
          </Field>
          <Field label="Description">
            <Textarea name="description" required defaultValue={product.description} placeholder="Tell customers what they're getting." />
          </Field>
          <Field label="Default price (₦)">
            <Input name="price" type="number" min="1" required defaultValue={product.defaultPriceNaira} placeholder="5500" />
          </Field>
          {type === "DIGITAL" && (
            <Field label="Secure delivery URL" hint="Only paid customers will see this link.">
              <Input name="fulfillmentUrl" type="url" defaultValue={product.fulfillmentUrl} placeholder="https://…" />
            </Field>
          )}
          {type === "SERVICE" && (
            <Field label="Service duration (minutes)">
              <Input name="serviceDurationMinutes" type="number" min="1" defaultValue={product.serviceDurationMinutes} placeholder="60" />
            </Field>
          )}
          <Field label="Product image">
            <ImageUpload defaultValue={product.imageUrl} name="imageUrl" />
          </Field>
          {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {success && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{success}</p>}
          <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save changes"}</Button>
        </form>
      </div>
      {product.active && (
        <div className="card mt-5 border-red-100 p-6">
          <h2 className="font-bold text-red-700">Danger zone</h2>
          <p className="mt-1 text-sm text-slate-500">Archived products can no longer be added to selling windows.</p>
          <Button tone="ghost" className="mt-4 text-red-700 hover:bg-red-50" disabled={archiving} onClick={archive}>
            <Trash2 size={16} />{archiving ? "Archiving…" : "Archive product"}
          </Button>
        </div>
      )}
    </div>
  );
}
