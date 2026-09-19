import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/shell";
import { requireVendor } from "@/lib/auth/session";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Dashboard" };
export default async function Layout({ children }: { children: React.ReactNode }) { const { user, vendor } = await requireVendor(); const openOrders=await db.order.count({where:{vendorId:vendor.id,status:"PAID",fulfillmentStatus:"PENDING"}}); return <DashboardShell workspace={vendor.name} category={vendor.category} userName={user.name ?? user.email} openOrders={openOrders}>{children}</DashboardShell>; }
