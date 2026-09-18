import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({ children, tone = "neutral", className }: { children: ReactNode; tone?: "success" | "warning" | "neutral" | "indigo" | "dark"; className?: string }) {
  const tones = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    neutral: "bg-slate-100 text-slate-600 border-slate-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dark: "bg-zinc-800 text-lime-300 border-zinc-700",
  };
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold tracking-wide", tones[tone], className)}>{children}</span>;
}
