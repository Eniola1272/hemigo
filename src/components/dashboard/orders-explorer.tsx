"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { OrdersTable, type OrderRow } from "@/components/dashboard/orders-table";

type Filter = "all" | "paid" | "pending" | "fulfilled";

export function OrdersExplorer({ orders }: { orders: OrderRow[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const visible = useMemo(
    () =>
      orders.filter((order) => {
        const matchesFilter =
          filter === "all" ||
          (filter === "paid" && order.status === "PAID") ||
          (filter === "pending" && order.status === "RESERVED") ||
          (filter === "fulfilled" && order.fulfillmentStatus === "FULFILLED");
        const matchesQuery =
          !normalizedQuery ||
          `${order.customerName} ${order.customerPhone ?? ""} ${order.orderNumber}`
            .toLowerCase()
            .includes(normalizedQuery);
        return matchesFilter && matchesQuery;
      }),
    [filter, normalizedQuery, orders],
  );
  const counts = {
    all: orders.length,
    paid: orders.filter((order) => order.status === "PAID").length,
    pending: orders.filter((order) => order.status === "RESERVED").length,
    fulfilled: orders.filter((order) => order.fulfillmentStatus === "FULFILLED").length,
  };

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="hide-scrollbar flex gap-1 overflow-x-auto">
          {(Object.keys(counts) as Filter[]).map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`shrink-0 rounded-[9px] px-4 py-2 text-sm font-semibold capitalize ${
                filter === item
                  ? "bg-indigo-700 text-white"
                  : "border border-slate-200 bg-white text-slate-600"
              }`}
            >
              {item} {counts[item]}
            </button>
          ))}
        </div>
        <label className="flex min-w-72 items-center gap-2 rounded-[10px] border border-slate-200 bg-white px-3">
          <Search size={17} className="text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-10 w-full bg-transparent text-sm outline-none"
            placeholder="Search customer, phone or order"
          />
        </label>
      </div>
      <section className="card overflow-hidden">
        {visible.length ? (
          <OrdersTable orders={visible} />
        ) : (
          <div className="p-12 text-center">
            <h2 className="text-xl font-bold">No matching orders.</h2>
            <p className="mt-2 text-slate-500">
              Try a different filter or search term.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
