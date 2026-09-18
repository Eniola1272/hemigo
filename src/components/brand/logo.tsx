import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return <Link href="/" className={cn("focus-ring inline-flex items-center gap-2 rounded-md text-xl font-extrabold tracking-[-.04em]", light ? "text-white" : "text-indigo-700", className)}><span className={cn("grid size-8 place-items-center rounded-[9px] text-[15px]", light ? "bg-white text-indigo-700" : "bg-indigo-700 text-white")}>H</span>Hemigo</Link>;
}
