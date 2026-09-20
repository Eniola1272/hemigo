import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Hemigo home"
      className={cn("focus-ring inline-flex shrink-0 items-center rounded-md", className)}
    >
      <Image
        src="/brand/hemigo-logo.png"
        alt="Hemigo"
        width={2172}
        height={724}
        className={cn("h-auto w-[138px]", light && "brightness-0 invert")}
      />
    </Link>
  );
}
