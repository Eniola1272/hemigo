import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  tone?: "primary" | "purchase" | "secondary" | "dark" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
};

const tones = {
  primary: "bg-indigo-700 text-white hover:bg-indigo-800 border-indigo-700",
  purchase: "bg-emerald-500 text-white hover:bg-emerald-600 border-emerald-500",
  secondary: "bg-white text-slate-900 hover:bg-slate-50 border-slate-200",
  dark: "bg-slate-950 text-white hover:bg-slate-800 border-slate-950",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100 border-transparent",
};

export function Button({ href, tone = "primary", size = "md", className, children, ...props }: Props) {
  const classes = cn(
    "focus-ring inline-flex items-center justify-center gap-2 rounded-[10px] border font-semibold transition-all active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50",
    tones[tone],
    size === "sm" ? "h-9 px-3.5 text-sm" : size === "lg" ? "h-13 px-6 text-base" : "h-11 px-4 text-sm",
    className,
  );
  if (href) return <Link href={href} className={classes}>{children}</Link>;
  return <button className={classes} {...props}>{children}</button>;
}
