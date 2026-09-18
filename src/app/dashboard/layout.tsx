import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/shell";
import { requireVendor } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Dashboard" };
export default async function Layout({ children }: { children: React.ReactNode }) { const { user, vendor } = await requireVendor(); return <DashboardShell workspace={vendor.name} category={vendor.category} userName={user.name ?? user.email}>{children}</DashboardShell>; }
