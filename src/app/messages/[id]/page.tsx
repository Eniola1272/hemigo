import { notFound } from "next/navigation";
import { Navbar } from "@/components/marketing/navbar";
import { ChatInbox, ActiveConversation, ConversationSummary } from "@/components/messages/chat-inbox";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  const [hasVendor, allConversations, conversation] = await Promise.all([
    db.vendorMember.findFirst({ where: { userId: user.id }, select: { id: true } }),
    db.conversation.findMany({
      where: {
        OR: [
          { participants: { some: { userId: user.id } } },
          { vendor: { members: { some: { userId: user.id } } } },
        ],
      },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            slug: true,
            phone: true,
            contactEmail: true,
            ownerId: true,
            members: { select: { userId: true } },
          },
        },
        participants: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            sender: { select: { id: true, name: true, email: true } },
          },
        },
        order: { select: { orderNumber: true, customerName: true, customerPhone: true } },
        window: { select: { name: true } },
      },
      orderBy: { updatedAt: "desc" },
    }),
    db.conversation.findFirst({
      where: {
        id,
        OR: [
          { participants: { some: { userId: user.id } } },
          { vendor: { members: { some: { userId: user.id } } } },
        ],
      },
      include: {
        vendor: {
          include: {
            owner: { select: { id: true, name: true, email: true } },
            members: { select: { userId: true } },
          },
        },
        order: {
          include: {
            items: true,
          },
        },
        window: true,
        product: true,
        participants: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        messages: {
          include: {
            sender: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    }),
  ]);

  if (!conversation) notFound();

  const isVendor =
    conversation.vendor.ownerId === user.id ||
    conversation.vendor.members.some((m) => m.userId === user.id);

  const customerParticipant =
    conversation.participants.find(
      (p) => p.userId !== user.id && p.userId !== conversation.vendor.ownerId
    ) || conversation.participants.find((p) => p.userId !== user.id);

  const activeData: ActiveConversation = {
    id: conversation.id,
    subject: conversation.subject,
    createdAt: conversation.createdAt.toISOString(),
    isVendor,
    contact: isVendor
      ? {
          name:
            conversation.order?.customerName ||
            customerParticipant?.user.name ||
            customerParticipant?.user.email ||
            "Customer",
          role: "Customer",
          phone: conversation.order?.customerPhone || null,
          email: conversation.order?.customerEmail || customerParticipant?.user.email || null,
          storeName: conversation.vendor.name,
          storeSlug: conversation.vendor.slug,
        }
      : {
          name: conversation.vendor.name,
          role: "Shop Owner",
          phone: conversation.vendor.phone,
          email:
            conversation.vendor.contactEmail ||
            conversation.vendor.owner?.email ||
            null,
          storeName: conversation.vendor.name,
          storeSlug: conversation.vendor.slug,
        },
    order: conversation.order
      ? {
          id: conversation.order.id,
          orderNumber: conversation.order.orderNumber,
          publicToken: conversation.order.publicToken,
          status: conversation.order.status,
          fulfillmentStatus: conversation.order.fulfillmentStatus,
          totalKobo: conversation.order.totalKobo,
          itemsCount: conversation.order.items.length,
        }
      : null,
    window: conversation.window
      ? {
          id: conversation.window.id,
          name: conversation.window.name,
          slug: conversation.window.slug,
        }
      : null,
    product: conversation.product
      ? {
          id: conversation.product.id,
          name: conversation.product.name,
          priceKobo: conversation.product.defaultPrice,
        }
      : null,
    messages: conversation.messages.map((m) => ({
      id: m.id,
      body: m.body,
      createdAt: m.createdAt.toISOString(),
      sender: {
        id: m.sender.id,
        name: m.sender.name,
        email: m.sender.email,
      },
    })),
  };

  const summaries: ConversationSummary[] = allConversations.map((c) => {
    const cIsVendor =
      c.vendor.ownerId === user.id ||
      c.vendor.members.some((m) => m.userId === user.id);

    const cCustomer =
      c.participants.find(
        (p) => p.userId !== user.id && p.userId !== c.vendor.ownerId
      ) || c.participants.find((p) => p.userId !== user.id);

    const last = c.messages[0];
    const myParticipant = c.participants.find((p) => p.userId === user.id);
    const unread = Boolean(
      last && (!myParticipant?.lastReadAt || last.createdAt > myParticipant.lastReadAt)
    );

    return {
      id: c.id,
      subject: c.subject,
      updatedAt: c.updatedAt.toISOString(),
      vendorName: c.vendor.name,
      vendorSlug: c.vendor.slug,
      contactName: cIsVendor
        ? c.order?.customerName || cCustomer?.user.name || cCustomer?.user.email || "Customer"
        : c.vendor.name,
      contactPhone: cIsVendor ? c.order?.customerPhone : c.vendor.phone,
      contactRole: cIsVendor ? "Customer" : "Shop Owner",
      lastMessage: last
        ? {
            body: last.body,
            createdAt: last.createdAt.toISOString(),
            isSenderMe: last.senderId === user.id,
          }
        : null,
      unread,
      orderNumber: c.order?.orderNumber || null,
    };
  });

  return (
    <main className="min-h-screen bg-slate-100/70">
      <Navbar user={{ name: user.name || user.email, hasVendor: Boolean(hasVendor) }} />
      <div className="mx-auto max-w-[1560px] p-2 sm:p-4 lg:p-6">
        <ChatInbox
          currentUserId={user.id}
          conversations={summaries}
          activeConversation={activeData}
        />
      </div>
    </main>
  );
}
