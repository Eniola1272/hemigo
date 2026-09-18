"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export function Countdown({ target, compact = false, dark = false }: { target?: string; compact?: boolean; dark?: boolean }) {
  const fallback = useMemo(() => Date.now() + 4 * 60 * 60 * 1000 + 23 * 60 * 1000 + 16 * 1000, []);
  const targetTime = target ? new Date(target).getTime() : fallback;
  const [remaining, setRemaining] = useState(Math.max(0, targetTime - Date.now()));

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(Math.max(0, targetTime - Date.now())), 1000);
    return () => window.clearInterval(timer);
  }, [targetTime]);

  const hours = Math.floor(remaining / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1000);
  const parts = [hours, minutes, seconds].map((n) => String(n).padStart(2, "0"));

  if (!remaining) return <p className="font-semibold text-slate-600">Orders are closed.</p>;
  return (
    <div className={cn("flex items-center", compact ? "gap-1" : "gap-2.5")} aria-label={`${hours} hours, ${minutes} minutes and ${seconds} seconds remaining`}>
      {parts.map((part, i) => <span key={i} className="contents"><span className={cn("tabular-nums font-bold tracking-tight", compact ? "text-xl" : "text-3xl sm:text-4xl", dark ? "text-lime-300" : "text-amber-500")}>{part}</span>{i < 2 && <span className={cn("font-bold", dark ? "text-zinc-500" : "text-amber-300")}>:</span>}</span>)}
    </div>
  );
}
