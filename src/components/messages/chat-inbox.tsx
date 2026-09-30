"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Send,
  Star,
  Check,
  Phone,
  Mail,
  Store,
  Copy,
  ExternalLink,
  Paperclip,
  Smile,
  Zap,
  Play,
  Pause,
  Info,
  X,
  ChevronLeft,
  Plus,
  Package,
  Calendar,
  CheckCheck
} from "lucide-react";
import { cn, formatNaira, initials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type ConversationSummary = {
  id: string;
  subject: string;
  updatedAt: string;
  vendorName: string;
  vendorSlug: string;
  contactName: string;
  contactPhone?: string | null;
  contactRole: string;
  lastMessage?: {
    body: string;
    createdAt: string;
    isSenderMe: boolean;
  } | null;
  unread: boolean;
  orderNumber?: string | null;
};

export type ActiveConversation = {
  id: string;
  subject: string;
  createdAt: string;
  isVendor: boolean;
  contact: {
    name: string;
    role: string;
    phone?: string | null;
    email?: string | null;
    storeName: string;
    storeSlug: string;
  };
  order?: {
    id: string;
    orderNumber: string;
    publicToken: string;
    status: string;
    fulfillmentStatus: string;
    totalKobo: number;
    itemsCount: number;
  } | null;
  window?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  product?: {
    id: string;
    name: string;
    priceKobo: number;
  } | null;
  messages: Array<{
    id: string;
    body: string;
    createdAt: string;
    sender: {
      id: string;
      name: string | null;
      email: string;
    };
  }>;
};

interface ChatInboxProps {
  currentUserId: string;
  conversations: ConversationSummary[];
  activeConversation: ActiveConversation;
}

const QUICK_RESPONSES = [
  "See you soon!",
  "Bye Bye 👋",
  "Thanks for reaching out! 🙏",
  "Checking your order now 📦",
  "Yes, it is available!",
  "All items are ready for pickup ✨",
  "Let me know if you need anything else.",
];

const EMOJIS = ["👍", "👋", "❤️", "😊", "🙏", "🎉", "🔥", "📦", "👏", "💬", "✨", "🚀", "💯", "🍕", "🛍️"];

export function ChatInbox({
  currentUserId,
  conversations,
  activeConversation,
}: ChatInboxProps) {
  const router = useRouter();
  const [messages, setMessages] = useState(activeConversation.messages);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [activeTab, setActiveTab] = useState<"open" | "closed">("open");
  const [searchQuery, setSearchQuery] = useState("");
  const [isStarred, setIsStarred] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [mobileView, setMobileView] = useState<"list" | "chat" | "info">("chat");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showQuickPicker, setShowQuickPicker] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [note, setNote] = useState("");
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load saved note & star state from localStorage
  useEffect(() => {
    try {
      const savedNote = localStorage.getItem(`hemigo_note_${activeConversation.id}`);
      if (savedNote) setNote(savedNote);
      const starred = localStorage.getItem(`hemigo_star_${activeConversation.id}`);
      if (starred) setIsStarred(starred === "true");
      const closed = localStorage.getItem(`hemigo_closed_${activeConversation.id}`);
      if (closed) setIsClosed(closed === "true");
    } catch {
      // LocalStorage access may fail in private mode
    }
  }, [activeConversation.id]);

  // Mark conversation read on mount
  useEffect(() => {
    fetch(`/api/conversations/${activeConversation.id}/messages`, { method: "PATCH" });
  }, [activeConversation.id]);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Periodic poll for incoming messages every 6 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/conversations/${activeConversation.id}/messages`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.messages) && data.messages.length > messages.length) {
            setMessages(data.messages);
          }
        }
      } catch {
        // Polling failure is safe to ignore
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [activeConversation.id, messages.length]);

  const toggleStar = () => {
    const next = !isStarred;
    setIsStarred(next);
    try {
      localStorage.setItem(`hemigo_star_${activeConversation.id}`, String(next));
    } catch {}
  };

  const toggleClosed = () => {
    const next = !isClosed;
    setIsClosed(next);
    try {
      localStorage.setItem(`hemigo_closed_${activeConversation.id}`, String(next));
    } catch {}
  };

  const saveNote = (newNote: string) => {
    setNote(newNote);
    try {
      localStorage.setItem(`hemigo_note_${activeConversation.id}`, newNote);
    } catch {}
    setIsEditingNote(false);
  };

  const copyStoreUrl = () => {
    const url = `${window.location.origin}/store/${activeConversation.contact.storeSlug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  async function handleSend(textToSend?: string) {
    const messageContent = (textToSend ?? body).trim();
    if (!messageContent || busy) return;

    setBusy(true);
    try {
      const response = await fetch(`/api/conversations/${activeConversation.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: messageContent }),
      });
      const result = await response.json();
      if (response.ok) {
        setMessages((curr) => [
          ...curr,
          {
            ...result.message,
            createdAt: new Date(result.message.createdAt).toISOString(),
          },
        ]);
        setBody("");
        setShowEmojiPicker(false);
        setShowQuickPicker(false);
      }
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setBusy(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const insertEmoji = (emoji: string) => {
    setBody((prev) => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const handleQuickChipClick = (text: string) => {
    setBody(text);
    textareaRef.current?.focus();
  };

  // Filter conversations list
  const filteredConversations = conversations.filter((c) => {
    if (activeTab === "closed") {
      // If we mark closed in local storage
      const closed = typeof window !== "undefined" && localStorage.getItem(`hemigo_closed_${c.id}`) === "true";
      if (!closed) return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.contactName.toLowerCase().includes(q) ||
      c.vendorName.toLowerCase().includes(q) ||
      c.subject.toLowerCase().includes(q) ||
      (c.contactPhone && c.contactPhone.toLowerCase().includes(q)) ||
      (c.lastMessage && c.lastMessage.body.toLowerCase().includes(q))
    );
  });

  const formatMessageTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    } catch {
      return dateStr;
    }
  };

  const formatConversationDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      }
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  };

  return (
    <div className="relative flex h-[calc(100vh-92px)] min-h-[640px] w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
      {/* ========================================================
          PANEL 1: LEFT SIDEBAR - CONVERSATIONS LIST
          ======================================================== */}
      <aside
        className={cn(
          "flex h-full w-full flex-col border-r border-slate-200/80 bg-white transition-all duration-200 md:w-80 lg:w-84 xl:w-96 flex-shrink-0",
          mobileView !== "list" && "hidden md:flex"
        )}
      >
        {/* Header */}
        <div className="border-b border-slate-100 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">All Messages</h1>
            <Link
              href="/messages/new"
              className="grid size-9 place-items-center rounded-full bg-indigo-600 text-white shadow-sm transition hover:bg-indigo-700 active:scale-95"
              title="New message"
            >
              <Plus size={18} />
            </Link>
          </div>

          {/* Tabs: Open Chat / Closed */}
          <div className="mt-4 flex border-b border-slate-200 text-sm font-semibold">
            <button
              onClick={() => setActiveTab("open")}
              className={cn(
                "relative pb-2.5 text-center transition-colors mr-6",
                activeTab === "open"
                  ? "text-slate-900 font-bold after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-slate-900"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              Open Chat
            </button>
            <button
              onClick={() => setActiveTab("closed")}
              className={cn(
                "relative pb-2.5 text-center transition-colors",
                activeTab === "closed"
                  ? "text-slate-900 font-bold after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-slate-900"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              Closed
            </button>
          </div>

          {/* Search box */}
          <div className="mt-3 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by contact or order..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        {/* Category header */}
        <div className="flex items-center justify-between px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 border-b border-slate-100">
          <span>Active Conversations</span>
          <span>{filteredConversations.length}</span>
        </div>

        {/* Conversation list stream */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">
              No conversations found.
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = conv.id === activeConversation.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    if (!isSelected) {
                      router.push(`/messages/${conv.id}`);
                    }
                    setMobileView("chat");
                  }}
                  className={cn(
                    "flex items-start gap-3 p-4 cursor-pointer transition hover:bg-slate-50/80",
                    isSelected && "bg-slate-50 border-l-4 border-indigo-600 pl-3"
                  )}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <span className="grid size-11 place-items-center rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-sm font-bold text-white shadow-2xs">
                      {initials(conv.contactName)}
                    </span>
                    <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {conv.contactName}
                      </p>
                      <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                        {conv.lastMessage ? formatConversationDate(conv.lastMessage.createdAt) : ""}
                      </span>
                    </div>

                    <p className="truncate text-xs text-slate-500 font-medium mt-0.5">
                      {conv.contactPhone || conv.subject}
                    </p>

                    <div className="mt-1 flex items-center justify-between gap-2">
                      <p className="truncate text-xs text-slate-500">
                        {conv.lastMessage ? (
                          <>
                            {conv.lastMessage.isSenderMe && <span className="font-semibold text-slate-600">You: </span>}
                            {conv.lastMessage.body}
                          </>
                        ) : (
                          "No messages yet"
                        )}
                      </p>
                      {conv.unread && (
                        <span className="grid size-5 place-items-center rounded-full bg-indigo-600 text-[10px] font-bold text-white flex-shrink-0">
                          1
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* ========================================================
          PANEL 2: CENTER - ACTIVE CHAT THREAD & COMPOSER
          ======================================================== */}
      <main
        className={cn(
          "flex h-full flex-1 flex-col min-w-0 bg-white transition-all",
          mobileView !== "chat" && "hidden md:flex"
        )}
      >
        {/* Chat Header Bar */}
        <header className="flex h-18 items-center justify-between border-b border-slate-200/80 px-4 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            {/* Back button on mobile */}
            <button
              onClick={() => setMobileView("list")}
              className="mr-1 -ml-2 grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 md:hidden"
              aria-label="Back to messages"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="relative flex-shrink-0">
              <span className="grid size-10 place-items-center rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-sm font-bold text-white shadow-2xs">
                {initials(activeConversation.contact.name)}
              </span>
              <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-base font-bold text-slate-900">
                  {activeConversation.contact.name}
                </h2>
                <span className="hidden sm:inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                  {activeConversation.contact.role}
                </span>
              </div>
              <p className="truncate text-xs text-slate-500">
                {activeConversation.contact.phone || activeConversation.contact.email || activeConversation.contact.storeName}
              </p>
            </div>
          </div>

          {/* Action buttons on header */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Star toggle */}
            <button
              onClick={toggleStar}
              className={cn(
                "grid size-9 place-items-center rounded-lg transition hover:bg-slate-100",
                isStarred ? "text-amber-500" : "text-slate-400"
              )}
              title={isStarred ? "Starred" : "Star conversation"}
            >
              <Star size={18} fill={isStarred ? "currentColor" : "none"} />
            </button>

            {/* Status toggle pill */}
            <button
              onClick={toggleClosed}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition active:scale-95",
                isClosed
                  ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/60"
              )}
              title="Toggle status"
            >
              <Check size={13} strokeWidth={2.5} />
              {isClosed ? "Closed" : "Open"}
            </button>

            {/* Info toggle button */}
            <button
              onClick={() => {
                setShowRightPanel(!showRightPanel);
                if (window.innerWidth < 768) {
                  setMobileView("info");
                }
              }}
              className={cn(
                "grid size-9 place-items-center rounded-lg transition hover:bg-slate-100",
                showRightPanel ? "text-indigo-600 bg-indigo-50/50" : "text-slate-400"
              )}
              title="Contact & Order Info"
            >
              <Info size={19} />
            </button>
          </div>
        </header>

        {/* Context banner (Subject / Order) */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-6 py-2 text-xs">
          <div className="flex items-center gap-2 text-slate-600 truncate">
            <span className="font-semibold text-slate-800">Topic:</span>
            <span className="truncate">{activeConversation.subject}</span>
          </div>
          {activeConversation.order && (
            <Link
              href={`/order/${activeConversation.order.publicToken}`}
              className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:underline flex-shrink-0"
            >
              <Package size={13} />
              Order #{activeConversation.order.orderNumber}
            </Link>
          )}
        </div>

        {/* Message Stream Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/30">
          {/* Audio Note Demonstration Bubble (as in reference mockup) */}
          <div className="flex justify-end">
            <div className="max-w-[85%] sm:max-w-[70%]">
              <div className="rounded-2xl rounded-tr-sm bg-[#fef3c7] p-3.5 text-amber-950 border border-amber-200/60 shadow-2xs">
                <p className="text-xs font-semibold text-amber-900 mb-2">Voice Message</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="grid size-9 place-items-center rounded-full bg-amber-950 text-white shadow-sm transition hover:bg-amber-900 active:scale-95"
                  >
                    {isPlayingAudio ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
                  </button>
                  <div className="flex-1">
                    <div className="h-1.5 w-full rounded-full bg-amber-300/80 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full bg-amber-900 transition-all duration-300",
                          isPlayingAudio ? "w-2/3" : "w-1/4"
                        )}
                      />
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-amber-900/80">0:30</span>
                </div>
              </div>
              <p className="mt-1 text-right text-[11px] text-slate-400">Audio Preview</p>
            </div>
          </div>

          {messages.map((message) => {
            const isMe = message.sender.id === currentUserId;
            return (
              <div key={message.id} className={cn("flex gap-2.5", isMe ? "justify-end" : "justify-start")}>
                {!isMe && (
                  <div className="mt-1 flex-shrink-0">
                    <span className="grid size-7 place-items-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                      {initials(message.sender.name || message.sender.email)}
                    </span>
                  </div>
                )}

                <div className="max-w-[85%] sm:max-w-[72%]">
                  <div
                    className={cn(
                      "px-4 py-3 text-sm leading-relaxed shadow-2xs whitespace-pre-wrap",
                      isMe
                        ? "rounded-2xl rounded-tr-sm bg-[#fef3c7] text-[#78350f] border border-[#fde68a]/70 font-medium"
                        : "rounded-2xl rounded-tl-sm bg-slate-100 text-slate-800"
                    )}
                  >
                    {!isMe && (
                      <p className="text-[11px] font-bold text-slate-500 mb-1">
                        {message.sender.name || message.sender.email}
                      </p>
                    )}
                    <p>{message.body}</p>
                  </div>
                  <div className={cn("mt-1 flex items-center gap-1 text-[10px] text-slate-400", isMe ? "justify-end" : "justify-start")}>
                    <span>{formatMessageTime(message.createdAt)}</span>
                    {isMe && <CheckCheck size={13} className="text-indigo-600" />}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Response Chips (above composer) */}
        <div className="border-t border-slate-100 bg-white px-4 py-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {QUICK_RESPONSES.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickChipClick(chip)}
                className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-medium text-slate-700 shadow-2xs transition hover:border-slate-300 hover:bg-slate-50 active:scale-95"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Composer */}
        <div className="border-t border-slate-200/80 bg-white p-4">
          <div className="relative rounded-2xl border border-slate-200 bg-white p-3 shadow-2xs transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
            {/* Emoji popover */}
            {showEmojiPicker && (
              <div className="absolute bottom-16 left-3 z-30 flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-2 shadow-lg max-w-[240px]">
                {EMOJIS.map((e, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => insertEmoji(e)}
                    className="grid size-8 place-items-center rounded hover:bg-slate-100 text-lg transition"
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}

            {/* Quick response menu */}
            {showQuickPicker && (
              <div className="absolute bottom-16 left-12 z-30 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-lg divide-y divide-slate-100">
                <p className="px-2 py-1 text-xs font-bold text-slate-400 uppercase">Canned Responses</p>
                <div className="pt-1 max-h-48 overflow-y-auto space-y-1">
                  {QUICK_RESPONSES.map((qr, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        handleSend(qr);
                        setShowQuickPicker(false);
                      }}
                      className="w-full text-left rounded px-2.5 py-1.5 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition"
                    >
                      {qr}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type Something.... (Press Enter to send)"
              rows={2}
              className="w-full resize-none border-0 p-1 text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-0 min-h-[50px] max-h-[140px]"
            />

            {/* Composer Toolbar */}
            <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
              <div className="flex items-center gap-1 text-slate-400">
                {/* Emoji button */}
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="grid size-8 place-items-center rounded-lg hover:bg-slate-100 hover:text-slate-600 transition"
                  title="Insert emoji"
                >
                  <Smile size={18} />
                </button>

                {/* Quick response toggle button */}
                <button
                  type="button"
                  onClick={() => setShowQuickPicker(!showQuickPicker)}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold hover:bg-slate-100 hover:text-slate-700 transition"
                  title="Quick Responses"
                >
                  <Zap size={14} className="text-amber-500 fill-amber-500" />
                  <span className="hidden sm:inline">Quick Response</span>
                </button>

                {/* Attachment mock */}
                <label
                  className="grid size-8 cursor-pointer place-items-center rounded-lg hover:bg-slate-100 hover:text-slate-600 transition"
                  title="Attach file"
                >
                  <Paperclip size={17} />
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setBody((prev) => prev + ` [Attached: ${e.target.files![0].name}]`);
                      }
                    }}
                  />
                </label>
              </div>

              {/* Send Button */}
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={busy || !body.trim()}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                <span>{busy ? "Sending…" : "Send Now"}</span>
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================
          PANEL 3: RIGHT SIDEBAR - CONTACT & CONTEXT DETAILS
          ======================================================== */}
      {showRightPanel && (
        <aside
          className={cn(
            "flex h-full w-full flex-col border-l border-slate-200/80 bg-white transition-all duration-200 md:w-80 lg:w-84 xl:w-96 flex-shrink-0 overflow-y-auto",
            mobileView !== "info" && "hidden lg:flex"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 p-4">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <span>Contact Info</span>
              <Info size={15} className="text-slate-400" />
            </div>
            <button
              onClick={() => {
                setShowRightPanel(false);
                setMobileView("chat");
              }}
              className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={17} />
            </button>
          </div>

          <div className="p-5 space-y-6">
            {/* About Profile */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {activeConversation.isVendor ? "About Customer" : "About Store"}
              </p>

              <div className="mt-4 flex items-center gap-3">
                <span className="grid size-14 place-items-center rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 text-lg font-bold text-white shadow-xs">
                  {initials(activeConversation.contact.name)}
                </span>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {activeConversation.contact.name}
                  </h3>
                  <p className="text-xs font-medium text-slate-500">
                    {activeConversation.contact.role}
                  </p>
                </div>
              </div>

              {/* Profile Details List */}
              <div className="mt-5 space-y-3">
                {/* Store Name */}
                <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                  <div className="grid size-9 place-items-center rounded-lg bg-indigo-50 text-indigo-700">
                    <Store size={17} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-slate-400">Store Name</p>
                    <p className="truncate text-xs font-bold text-slate-800">
                      {activeConversation.contact.storeName}
                    </p>
                  </div>
                </div>

                {/* Store URL */}
                <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                  <div className="grid size-9 place-items-center rounded-lg bg-indigo-50 text-indigo-700">
                    <ExternalLink size={17} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-slate-400">Store URL</p>
                    <p className="truncate text-xs font-bold text-slate-800">
                      hemigo.ng/store/{activeConversation.contact.storeSlug}
                    </p>
                  </div>
                  <button
                    onClick={copyStoreUrl}
                    className="grid size-7 place-items-center rounded text-slate-400 hover:bg-white hover:text-indigo-600 transition shadow-2xs"
                    title="Copy Store URL"
                  >
                    {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  </button>
                </div>

                {/* Phone */}
                {activeConversation.contact.phone && (
                  <a
                    href={`tel:${activeConversation.contact.phone}`}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 hover:bg-slate-100/60 transition"
                  >
                    <div className="grid size-9 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
                      <Phone size={17} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold text-slate-400">Phone</p>
                      <p className="truncate text-xs font-bold text-slate-800">
                        {activeConversation.contact.phone}
                      </p>
                    </div>
                  </a>
                )}

                {/* Email */}
                {activeConversation.contact.email && (
                  <a
                    href={`mailto:${activeConversation.contact.email}`}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 hover:bg-slate-100/60 transition"
                  >
                    <div className="grid size-9 place-items-center rounded-lg bg-violet-50 text-violet-700">
                      <Mail size={17} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold text-slate-400">Email</p>
                      <p className="truncate text-xs font-bold text-slate-800">
                        {activeConversation.contact.email}
                      </p>
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* Related Order Card */}
            {activeConversation.order && (
              <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package size={16} className="text-indigo-600" />
                    <span className="font-bold text-xs text-slate-900">
                      Order #{activeConversation.order.orderNumber}
                    </span>
                  </div>
                  <Badge
                    tone={activeConversation.order.status === "PAID" ? "success" : "warning"}
                  >
                    {activeConversation.order.status}
                  </Badge>
                </div>

                <div className="mt-3 flex items-baseline justify-between border-t border-slate-100 pt-3">
                  <span className="text-xs text-slate-500">Order Amount</span>
                  <span className="text-sm font-bold text-slate-900">
                    {formatNaira(activeConversation.order.totalKobo)}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>Fulfillment</span>
                  <span className="font-semibold text-slate-700">
                    {activeConversation.order.fulfillmentStatus}
                  </span>
                </div>

                <Link
                  href={`/order/${activeConversation.order.publicToken}`}
                  className="mt-4 block w-full rounded-lg bg-slate-100 py-2 text-center text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
                >
                  View Order Details
                </Link>
              </div>
            )}

            {/* Related Selling Window */}
            {activeConversation.window && (
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/40 p-4">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Selling Window</p>
                <p className="mt-1 font-bold text-xs text-slate-900">
                  {activeConversation.window.name}
                </p>
              </div>
            )}

            {/* Related Product */}
            {activeConversation.product && (
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/40 p-4">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Product</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">
                    {activeConversation.product.name}
                  </span>
                  <span className="font-bold text-xs text-indigo-700">
                    {formatNaira(activeConversation.product.priceKobo)}
                  </span>
                </div>
              </div>
            )}

            {/* Notes Section (matches mockup) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Notes
                </span>
                {!isEditingNote && (
                  <button
                    onClick={() => setIsEditingNote(true)}
                    className="text-xs font-semibold text-indigo-600 hover:underline"
                  >
                    {note ? "Edit Note" : "+ Add Note"}
                  </button>
                )}
              </div>

              {isEditingNote ? (
                <div className="space-y-2">
                  <textarea
                    defaultValue={note}
                    id="note-input"
                    rows={3}
                    placeholder="Add a private note about this customer or enquiry..."
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-800 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsEditingNote(false)}
                      className="rounded px-2.5 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        const el = document.getElementById("note-input") as HTMLTextAreaElement;
                        saveNote(el?.value || "");
                      }}
                      className="rounded bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 text-xs text-slate-600 leading-relaxed shadow-2xs">
                  <p>{note || "No private notes yet. Click Add Note to leave remarks."}</p>
                  <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400">
                    <Calendar size={12} />
                    <span>Saved locally for reference</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
