import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/shell";
import { requireVendor } from "@/lib/auth/session";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false, follow: false } };
export default async function Layout({ children }: { children: React.ReactNode }) { const { user, vendor } = await requireVendor(); const [openOrders,participations]=await Promise.all([db.order.count({where:{vendorId:vendor.id,status:"PAID",fulfillmentStatus:"PENDING"}}),db.conversationParticipant.findMany({where:{userId:user.id,conversation:{vendorId:vendor.id}},include:{conversation:{include:{messages:{orderBy:{createdAt:"desc"},take:1}}}}})]);const unreadMessages=participations.filter(item=>{const latest=item.conversation.messages[0]?.createdAt;return latest&&(!item.lastReadAt||latest>item.lastReadAt)}).length; return <DashboardShell workspace={vendor.name} category={vendor.category} userName={user.name ?? user.email} openOrders={openOrders} unreadMessages={unreadMessages}>{children}</DashboardShell>; }
