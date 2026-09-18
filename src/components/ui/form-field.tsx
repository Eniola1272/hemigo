import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return <label className="grid gap-2 text-sm font-semibold text-slate-700"><span>{label}</span>{children}{hint && <span className="text-xs font-normal text-slate-500">{hint}</span>}</label>;
}
export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("focus-ring h-12 w-full rounded-[10px] border border-slate-200 bg-white px-3.5 text-sm text-slate-950 placeholder:text-slate-400", props.className)} />;
}
export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn("focus-ring min-h-28 w-full rounded-[10px] border border-slate-200 bg-white p-3.5 text-sm text-slate-950 placeholder:text-slate-400", props.className)} />;
}
export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn("focus-ring h-12 w-full rounded-[10px] border border-slate-200 bg-white px-3.5 text-sm text-slate-950", props.className)} />;
}
