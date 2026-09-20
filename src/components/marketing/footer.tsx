import Link from "next/link";
import { Logo } from "@/components/brand/logo";

const links = [
  ["Explore", "/explore"],
  ["About us", "/about"],
  ["Contact us", "/contact"],
  ["Start selling", "/signup"],
] as const;

export function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12">
      <div className="container-shell grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <Logo />
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-500">
            Commerce for launches, always-open shops, events and everything you
            are ready to sell.
          </p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="text-sm font-semibold text-slate-600 hover:text-indigo-700">
              {label}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-slate-400 md:col-span-2">
          © {new Date().getFullYear()} Hemigo. Built for independent commerce.
        </p>
      </div>
    </footer>
  );
}
