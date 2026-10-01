"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  PackageCheck,
  Sparkles,
  Trash2,
  AlertCircle,
  Save,
  Clock,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field, Input, Select, Textarea } from "@/components/ui/form-field";
import { formatNaira } from "@/lib/utils";
import { serializeWindowSchedule } from "@/lib/window-schedule";

type DbProduct = { id: string; name: string; defaultPrice: number };

type WindowProductData = {
  id: string;
  productId: string;
  priceKobo: number;
  inventoryLimit: number | null;
  maxPerCustomer: number | null;
  product: DbProduct;
};

type WindowData = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  headline: string | null;
  mode: "LAUNCH" | "SHOP";
  opensAt: Date | string | null;
  closesAt: Date | string | null;
  fulfillmentAt: Date | string | null;
  allowPayLater: boolean;
  invoiceHoldMinutes: number;
  invoiceReservesInventory: boolean;
  theme: "CLASSIC" | "HYPE";
  status: "DRAFT" | "UPCOMING" | "LIVE" | "CLOSED";
  windowProducts: WindowProductData[];
  _count: {
    orders: number;
  };
};

type Selection = {
  productId: string;
  selected: boolean;
  priceNaira: number;
  inventoryLimit: number;
  maxPerCustomer: number;
};

export function EditWindowForm({
  window: initialWindow,
  products,
  vendorSlug,
}: {
  window: WindowData;
  products: DbProduct[];
  vendorSlug: string;
}) {
  const router = useRouter();

  const toLocalIso = (val: Date | string | null | undefined) => {
    if (!val) return "";
    const d = new Date(val);
    if (!Number.isFinite(d.getTime())) return "";
    return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
  };

  const [details, setDetails] = useState({
    name: initialWindow.name,
    description: initialWindow.description || "",
    headline: initialWindow.headline || "",
    mode: initialWindow.mode,
    opensAt: toLocalIso(initialWindow.opensAt),
    closesAt: toLocalIso(initialWindow.closesAt),
    fulfillmentAt: toLocalIso(initialWindow.fulfillmentAt),
    theme: initialWindow.theme,
    allowPayLater: initialWindow.allowPayLater,
    invoiceHoldMinutes: initialWindow.invoiceHoldMinutes,
    invoiceReservesInventory: initialWindow.invoiceReservesInventory,
    status: initialWindow.status,
  });

  const existingMap = new Map(initialWindow.windowProducts.map((wp) => [wp.productId, wp]));

  const [selections, setSelections] = useState<Record<string, Selection>>(() => {
    const map: Record<string, Selection> = {};
    for (const p of products) {
      const existing = existingMap.get(p.id);
      if (existing) {
        map[p.id] = {
          productId: p.id,
          selected: true,
          priceNaira: existing.priceKobo / 100,
          inventoryLimit: existing.inventoryLimit ?? 20,
          maxPerCustomer: existing.maxPerCustomer ?? 5,
        };
      } else {
        map[p.id] = {
          productId: p.id,
          selected: false,
          priceNaira: p.defaultPrice / 100,
          inventoryLimit: 20,
          maxPerCustomer: 5,
        };
      }
    }
    return map;
  });

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const selected = Object.values(selections).filter((s) => s.selected);

  const updateSelection = (id: string, patch: Partial<Selection>) =>
    setSelections((current) => ({
      ...current,
      [id]: { ...current[id], ...patch },
    }));

  async function handleSave(statusOverride?: "DRAFT" | "UPCOMING" | "LIVE" | "CLOSED") {
    setBusy(true);
    setError("");
    setSuccessMsg("");

    try {
      if (!selected.length) {
        throw new Error("Select at least one product for this window.");
      }

      const schedule = serializeWindowSchedule(details);

      const payload = {
        ...details,
        ...schedule,
        publish: true,
        status: statusOverride ?? details.status,
        products: selected.map(({ productId, priceNaira, inventoryLimit, maxPerCustomer }) => ({
          productId,
          priceNaira,
          inventoryLimit,
          maxPerCustomer,
        })),
      };

      const res = await fetch(`/api/dashboard/windows/${initialWindow.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save window.");

      setSuccessMsg("Selling window updated successfully!");
      if (statusOverride) {
        setDetails((prev) => ({ ...prev, status: statusOverride }));
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update window.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    setDeleteBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/dashboard/windows/${initialWindow.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to delete window.");
      router.push("/dashboard/windows");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete window.");
      setDeleteBusy(false);
    }
  }

  const storefrontUrl =
    details.mode === "SHOP"
      ? `/${vendorSlug}`
      : `/${vendorSlug}/${initialWindow.slug}`;

  return (
    <div className="mx-auto max-w-5xl space-y-7 pb-16">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link
            href="/dashboard/windows"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft size={16} /> Back to Selling Windows
          </Link>
          <div className="mt-2 flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Edit {details.mode === "SHOP" ? "Shop" : "Selling Window"}
            </h1>
            <Badge
              tone={
                details.status === "LIVE"
                  ? "success"
                  : details.status === "UPCOMING"
                  ? "indigo"
                  : "neutral"
              }
            >
              {details.status}
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button href={storefrontUrl} tone="ghost" size="sm">
            <Store size={15} /> Storefront <ExternalLink size={13} />
          </Button>
          <Button
            href={`/dashboard/windows/${initialWindow.id}/fulfillment`}
            tone="secondary"
            size="sm"
          >
            <PackageCheck size={15} /> Fulfillment
          </Button>
          <Button onClick={() => handleSave()} disabled={busy} size="sm">
            <Save size={15} /> {busy ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
          <CheckCircle2 size={18} className="flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Quick Status Control Banner */}
      <div className="card flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center bg-slate-50/70 border-slate-200">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Window Lifecycle
          </p>
          <p className="text-sm font-semibold text-slate-800 mt-1">
            Status: <span className="font-bold text-indigo-700">{details.status}</span> · {initialWindow._count.orders} paid orders placed
          </p>
        </div>
        <div className="flex gap-2">
          {details.status !== "CLOSED" ? (
            <Button
              tone="secondary"
              size="sm"
              disabled={busy}
              onClick={() => handleSave("CLOSED")}
            >
              <Clock size={15} /> Close window early
            </Button>
          ) : (
            <Button
              tone="secondary"
              size="sm"
              disabled={busy}
              onClick={() => handleSave(details.mode === "SHOP" ? "LIVE" : "UPCOMING")}
            >
              <CheckCircle2 size={15} /> Re-open window
            </Button>
          )}
        </div>
      </div>

      {/* Section 1: Window Details */}
      <section className="card p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Window details & schedule</h2>
          <p className="mt-1 text-sm text-slate-500">
            Update your batch name, storefront headline, and operating hours.
          </p>
        </div>

        <div className="grid gap-5">
          <Field label="Selling mode">
            <Select
              value={details.mode}
              onChange={(e) =>
                setDetails({ ...details, mode: e.target.value as "LAUNCH" | "SHOP" })
              }
            >
              <option value="LAUNCH">Hemigo Launch — timed drop / preorder rush</option>
              <option value="SHOP">Hemigo Shop — always open</option>
            </Select>
          </Field>

          <Field label={details.mode === "SHOP" ? "Shop name" : "Window name"}>
            <Input
              value={details.name}
              onChange={(e) => setDetails({ ...details, name: e.target.value })}
              placeholder={details.mode === "SHOP" ? "Eniola's Store" : "Weekend Special Batch"}
              required
            />
          </Field>

          <Field label="Storefront headline">
            <Input
              value={details.headline}
              onChange={(e) => setDetails({ ...details, headline: e.target.value })}
              placeholder="Fresh drops, limited quantities."
            />
          </Field>

          <Field label="Description">
            <Textarea
              value={details.description}
              onChange={(e) => setDetails({ ...details, description: e.target.value })}
              rows={3}
            />
          </Field>

          {details.mode === "LAUNCH" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Orders open">
                  <Input
                    type="datetime-local"
                    value={details.opensAt}
                    onChange={(e) => setDetails({ ...details, opensAt: e.target.value })}
                    required
                  />
                </Field>
                <Field label="Orders close">
                  <Input
                    type="datetime-local"
                    value={details.closesAt}
                    onChange={(e) => setDetails({ ...details, closesAt: e.target.value })}
                    required
                  />
                </Field>
              </div>

              <Field label="Fulfillment time (optional)">
                <Input
                  type="datetime-local"
                  value={details.fulfillmentAt}
                  onChange={(e) =>
                    setDetails({ ...details, fulfillmentAt: e.target.value })
                  }
                />
              </Field>
              <p className="text-xs text-slate-500">
                Opening, closing, and fulfillment times follow your device’s local timezone.
              </p>
            </>
          )}

          <div>
            <label className="text-sm font-semibold text-slate-900 block mb-2">Storefront Theme</label>
            <div className="grid grid-cols-2 gap-3">
              {(["CLASSIC", "HYPE"] as const).map((th) => (
                <button
                  type="button"
                  key={th}
                  onClick={() => setDetails({ ...details, theme: th })}
                  className={`rounded-[12px] border p-4 text-left transition ${
                    details.theme === th
                      ? "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <Sparkles size={18} className="text-indigo-600" />
                  <strong className="mt-3 block text-sm">
                    {th[0] + th.slice(1).toLowerCase()} Theme
                  </strong>
                  <span className="text-xs text-slate-500">
                    {th === "HYPE" ? "Dark, high-energy drop mode" : "Clean, bright and welcoming"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Products in this Window */}
      <section className="card overflow-hidden">
        <div className="border-b border-slate-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Included products</h2>
              <p className="mt-1 text-sm text-slate-500">
                Select products available in this window, customize their prices and inventory caps.
              </p>
            </div>
            <span className="text-sm font-semibold text-indigo-700">
              {selected.length} products selected
            </span>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No active products found.{" "}
            <Link href="/dashboard/products/new" className="font-bold text-indigo-600 underline">
              Create a product first.
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {products.map((product) => {
              const s = selections[product.id];
              if (!s) return null;
              return (
                <div
                  key={product.id}
                  className={`grid items-center gap-4 p-5 transition sm:grid-cols-[auto_1.2fr_1fr_1fr] ${
                    s.selected ? "bg-white" : "bg-slate-50/50 opacity-60"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={s.selected}
                    onChange={(e) => updateSelection(product.id, { selected: e.target.checked })}
                    className="size-5 rounded border-slate-300 accent-indigo-600 cursor-pointer"
                  />
                  <div>
                    <strong className="block text-sm font-bold text-slate-900">{product.name}</strong>
                    <p className="text-xs text-slate-500">
                      Default: {formatNaira(product.defaultPrice)}
                    </p>
                  </div>
                  <Field label="Price (₦)">
                    <Input
                      type="number"
                      value={s.priceNaira}
                      disabled={!s.selected}
                      onChange={(e) =>
                        updateSelection(product.id, { priceNaira: Number(e.target.value) })
                      }
                    />
                  </Field>
                  <Field label="Available Limit">
                    <Input
                      type="number"
                      value={s.inventoryLimit}
                      disabled={!s.selected}
                      onChange={(e) =>
                        updateSelection(product.id, { inventoryLimit: Number(e.target.value) })
                      }
                    />
                  </Field>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Section 3: Payment & Reservation Options */}
      <section className="card p-6 sm:p-8 space-y-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Payment & Invoicing settings</h2>
          <p className="mt-1 text-sm text-slate-500">
            Configure Pay Later requests and reservation windows.
          </p>
        </div>

        <label className="flex items-start gap-3 rounded-[12px] border border-slate-200 p-4 cursor-pointer hover:bg-slate-50 transition">
          <input
            type="checkbox"
            checked={details.allowPayLater}
            onChange={(e) => setDetails({ ...details, allowPayLater: e.target.checked })}
            className="mt-1 size-4 accent-indigo-600"
          />
          <div>
            <strong className="block text-sm font-semibold text-slate-800">
              Allow invoice / pay later option
            </strong>
            <span className="text-xs text-slate-500">
              Customers can generate an invoice and complete payment before the hold expires.
            </span>
          </div>
        </label>

        {details.allowPayLater && (
          <div className="grid gap-4 sm:grid-cols-2 pt-2">
            <Field label="Invoice stock hold duration">
              <Select
                value={details.invoiceHoldMinutes}
                onChange={(e) =>
                  setDetails({ ...details, invoiceHoldMinutes: Number(e.target.value) })
                }
              >
                <option value={30}>30 minutes</option>
                <option value={120}>2 hours</option>
                <option value={1440}>24 hours</option>
                <option value={43200}>30 days</option>
              </Select>
            </Field>

            <div className="flex items-center">
              <label className="flex items-start gap-3 rounded-[12px] border border-slate-200 p-4 w-full cursor-pointer hover:bg-slate-50 transition">
                <input
                  type="checkbox"
                  checked={details.invoiceReservesInventory}
                  onChange={(e) =>
                    setDetails({ ...details, invoiceReservesInventory: e.target.checked })
                  }
                  className="mt-1 size-4 accent-indigo-600"
                />
                <div>
                  <strong className="block text-xs font-semibold text-slate-800">
                    Reserve inventory while awaiting payment
                  </strong>
                  <span className="text-[11px] text-slate-500">
                    If unchecked, stock is confirmed only upon successful checkout.
                  </span>
                </div>
              </label>
            </div>
          </div>
        )}
      </section>

      {/* Save Button */}
      <div className="flex justify-end gap-3 pt-2">
        <Button href="/dashboard/windows" tone="secondary">
          Cancel
        </Button>
        <Button onClick={() => handleSave()} disabled={busy || !selected.length}>
          <Save size={16} /> {busy ? "Saving changes…" : "Save window changes"}
        </Button>
      </div>

      {/* Section 4: Danger Zone */}
      <section className="rounded-2xl border border-red-200 bg-red-50/40 p-6 sm:p-8">
        <h3 className="font-bold text-base text-red-900">Danger Zone</h3>
        <p className="mt-1 text-xs text-red-700">
          Once deleted, this window cannot be recovered. Windows with paid customer orders cannot be deleted.
        </p>

        <div className="mt-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800">Delete this selling window</p>
            <p className="text-xs text-slate-500">
              {initialWindow._count.orders > 0
                ? "This window has paid orders and cannot be deleted."
                : "Permanently remove this window and its configuration."}
            </p>
          </div>

          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteBusy}
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700 active:scale-95 disabled:opacity-50"
              >
                {deleteBusy ? "Deleting…" : "Confirm Delete"}
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={initialWindow._count.orders > 0}
              onClick={() => setConfirmDelete(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-white px-3.5 py-2 text-xs font-bold text-red-700 shadow-2xs hover:bg-red-50 active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
            >
              <Trash2 size={14} />
              Delete window
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
