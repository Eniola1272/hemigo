import type { Metadata } from "next";
import { Storefront } from "@/components/storefront/storefront";

export const metadata: Metadata = { title: "Storefront" };
export default async function StorefrontPage({ params }: { params: Promise<{ vendorSlug: string; windowSlug: string }> }) {
  const { vendorSlug } = await params;
  return <Storefront hype={vendorSlug === "noir-lagos"}/>;
}
