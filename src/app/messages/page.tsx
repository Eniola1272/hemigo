import { redirect } from "next/navigation";
import { MessageCircle, Plus } from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";

export default async function MessagesPage() {
  const user = await requireUser();
  const [hasVendor, conversations] = await Promise.all([
    db.vendorMember.findFirst({ where: { userId: user.id }, select: { id: true } }),
    db.conversation.findMany({
      where: {
        OR: [
          { participants: { some: { userId: user.id } } },
          { vendor: { members: { some: { userId: user.id } } } },
        ],
      },
      select: { id: true },
      orderBy: { updatedAt: "desc" },
      take: 1,
    }),
  ]);

  if (conversations.length > 0) {
    redirect(`/messages/${conversations[0].id}`);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar user={{ name: user.name || user.email, hasVendor: Boolean(hasVendor) }} />
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="card p-12 text-center shadow-sm">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
            <MessageCircle size={32} />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-slate-900">No conversations yet</h1>
          <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
            You don&apos;t have any active message threads. Message a seller from any storefront or order.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button href="/messages/new">
              <Plus size={16} />
              Start a message
            </Button>
            <Button href="/explore" tone="secondary">
              Explore stores
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
