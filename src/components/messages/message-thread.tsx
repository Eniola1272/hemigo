"use client";

import { useEffect, useState, useRef } from "react";
import { Send, Smile, Paperclip, CheckCheck } from "lucide-react";
import { cn, initials } from "@/lib/utils";

type Item = {
  id: string;
  body: string;
  createdAt: string;
  sender: { id: string; name: string | null; email: string };
};

export function MessageThread({
  conversationId,
  currentUserId,
  initial,
}: {
  conversationId: string;
  currentUserId: string;
  initial: Item[];
}) {
  const [messages, setMessages] = useState(initial);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/conversations/${conversationId}/messages`, { method: "PATCH" });
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    if (!body.trim() || busy) return;
    setBusy(true);
    const response = await fetch(`/api/conversations/${conversationId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    const result = await response.json();
    if (response.ok) {
      setMessages((current) => [
        ...current,
        { ...result.message, createdAt: new Date(result.message.createdAt).toISOString() },
      ]);
      setBody("");
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Messages Feed */}
      <div className="flex-1 space-y-4 p-5 overflow-y-auto bg-slate-50/40">
        {messages.map((message) => {
          const isMe = message.sender.id === currentUserId;
          return (
            <div
              key={message.id}
              className={cn("flex gap-2.5", isMe ? "justify-end" : "justify-start")}
            >
              {!isMe && (
                <span className="grid size-7 place-items-center rounded-full bg-slate-200 text-xs font-bold text-slate-700 mt-1 flex-shrink-0">
                  {initials(message.sender.name || message.sender.email)}
                </span>
              )}
              <div className="max-w-[80%] sm:max-w-[70%]">
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
                <div
                  className={cn(
                    "mt-1 flex items-center gap-1 text-[10px] text-slate-400",
                    isMe ? "justify-end" : "justify-start"
                  )}
                >
                  <span>
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                  {isMe && <CheckCheck size={12} className="text-indigo-600" />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <form onSubmit={send} className="border-t border-slate-200/80 p-4 bg-white">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-2xs focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(e);
              }
            }}
            className="w-full resize-none border-0 p-1 text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-0 min-h-[48px] max-h-[120px]"
            placeholder="Type Something.... (Press Enter to send)"
            rows={2}
          />
          <div className="flex items-center justify-between border-t border-slate-100 pt-2 mt-2">
            <div className="flex items-center gap-1 text-slate-400">
              <span className="p-1 hover:text-slate-600 cursor-pointer">
                <Smile size={18} />
              </span>
              <span className="p-1 hover:text-slate-600 cursor-pointer">
                <Paperclip size={17} />
              </span>
            </div>
            <button
              type="submit"
              disabled={busy || !body.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 disabled:opacity-50"
            >
              <span>{busy ? "Sending…" : "Send Now"}</span>
              <Send size={14} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
