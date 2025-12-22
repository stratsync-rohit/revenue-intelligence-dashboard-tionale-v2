// ChatModal.tsx
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

type ChatModalProps = {
  open: boolean;
  signalName?: string | null;
  onClose: () => void;
};

type Role = "ai" | "user";

type Message = {
  id: string;
  role: Role;
  text: string;
  ts?: number;
};

const uid = (prefix = "") => `${prefix}${Math.random().toString(36).slice(2, 9)}`;

const formatTime = (ts?: number) =>
  ts ? new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

const ChatModal: React.FC<ChatModalProps> = ({ open, signalName, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Portal target
  const portalTarget = typeof document !== "undefined" ? document.body : null;

  // Robust body lock to avoid white strip / scroll jump
  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY || window.pageYOffset;
    const prev = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      overflow: document.body.style.overflow,
      width: document.body.style.width,
    };

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";
    document.body.style.width = "100%";

    return () => {
      document.body.style.position = prev.position;
      document.body.style.top = prev.top;
      document.body.style.left = prev.left;
      document.body.style.right = prev.right;
      document.body.style.overflow = prev.overflow;
      document.body.style.width = prev.width;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  // Initialize welcome message when modal opens or signalName changes
  useEffect(() => {
    if (!open) return;
    const welcome: Message = {
      id: uid("ai_"),
      role: "ai",
      text: `I can help you analyze this opportunity: ${signalName ?? "—"}. What would you like to know?`,
      ts: Date.now(),
    };
    setMessages([welcome]);
    // focus input after a tick so DOM exists
    requestAnimationFrame(() => textareaRef.current?.focus());
  }, [open, signalName]);

  // autosize textarea
  const autosize = (ta?: HTMLTextAreaElement | null) => {
    if (!ta) return;
    ta.style.height = "0px";
    // cap height to avoid huge textbox
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  };
  useEffect(() => autosize(textareaRef.current), [input]);

  // auto-scroll to bottom on new messages or typing
  useEffect(() => {
    if (!containerRef.current) return;
    // small delay to let DOM update
    const t = setTimeout(() => {
      containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
    }, 40);
    return () => clearTimeout(t);
  }, [messages, isTyping]);

  // close on Escape (also keeps dependency stable)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // simple focus trap: keep focus inside the panel while open
  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  const sendMessage = async () => {
    const trimmed = input.replace(/\n+$/, "").trim();
    if (!trimmed || isSending) return;

    const userMsg: Message = { id: uid("u_"), role: "user", text: trimmed, ts: Date.now() };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    autosize(textareaRef.current);

    // optimistic placeholder for AI
    const placeholderId = uid("ai_tmp_");
    setMessages((p) => [...p, { id: placeholderId, role: "ai", text: "Working on your query…", ts: Date.now() }]);
    setIsSending(true);
    setIsTyping(true);

    try {
      // Replace with your backend endpoint
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signal: signalName ?? null, message: trimmed }),
      });

      if (!res.ok) throw new Error(`Server ${res.status}`);

      const data = await res.json();
      const reply = typeof data.reply === "string" ? data.reply : data?.choices?.[0]?.message?.content || JSON.stringify(data);

      setMessages((prev) => prev.map((m) => (m.id === placeholderId ? { ...m, text: reply, ts: Date.now() } : m)));
    } catch (err: any) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === placeholderId ? { ...m, text: err?.message ?? "Network error — try again.", ts: Date.now() } : m
        )
      );
    } finally {
      setIsTyping(false);
      setIsSending(false);
      // refocus input after reply
      requestAnimationFrame(() => textareaRef.current?.focus());
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends (unless Shift is held) — Shift+Enter adds newline
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!portalTarget) return null;

  const modal = (
    <AnimatePresence>
      {open && (
        <motion.div
          key="chat-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999] w-full h-screen top-0 left-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          aria-hidden={false}
          onMouseDown={(e) => {
            // close when clicking outside the panel
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="deal-intel-title"
            className="w-full max-w-[95vw] sm:max-w-[600px] md:max-w-[760px] lg:w-[860px] mx-3 sm:mx-4 bg-white rounded-xl sm:rounded-2xl shadow-[0_18px_50px_-18px_rgba(0,0,0,0.4)] overflow-hidden"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b"
              style={{ borderColor: "rgb(var(--color-border-light))", backgroundColor: "rgb(var(--color-bg-primary))" }}
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="min-w-0 flex-1">
                  <h3
                    id="deal-intel-title"
                    className="text-base sm:text-lg md:text-xl font-semibold truncate"
                    style={{ color: "rgb(var(--color-text-primary))" }}
                  >
                    Deal Intelligence Chat
                  </h3>
                  <p className="text-xs sm:text-sm mt-0.5 truncate" style={{ color: "rgb(var(--color-text-tertiary))" }}>
                    Opportunity:{" "}
                    <span className="font-medium" style={{ color: "rgb(var(--color-text-secondary))" }}>
                      {signalName ?? "—"}
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                aria-label="Close chat"
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center transition flex-shrink-0 hover:bg-[rgb(var(--color-bg-secondary))] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
                title="Close"
              >
                <span aria-hidden>✕</span>
              </button>
            </div>

            {/* Chat area */}
            <div
              className="h-[50vh] sm:h-[60vh] p-4 sm:p-6 overflow-y-auto"
              style={{ backgroundColor: "rgb(var(--color-bg-secondary))" }}
              ref={containerRef}
              role="log"
              aria-live="polite"
              aria-relevant="additions"
            >
              {/* show messages */}
              <div className="space-y-4 sm:space-y-6">
                {messages.map((m) =>
                  m.role === "ai" ? (
                    <article
                      key={m.id}
                      aria-label={`Assistant message at ${formatTime(m.ts)}`}
                      className="flex items-start gap-2 sm:gap-4"
                    >
                      <div className="flex-shrink-0">
                        <img
                          src="/image/site-icon.png"
                          alt="Assistant"
                          className="h-7 w-7 sm:h-9 sm:w-9 rounded-full border border-slate-200 shadow-sm"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className="inline-block max-w-full sm:max-w-[85%] rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base"
                          style={{
                            backgroundColor: "rgb(var(--color-bg-tertiary))",
                            color: "rgb(var(--color-text-secondary))",
                            boxShadow: "var(--shadow-sm)",
                          }}
                        >
                          <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{m.text}</div>
                        </div>
                        <time className="mt-1 text-xs sm:text-sm block" style={{ color: "rgb(var(--color-text-quaternary))" }}>
                          {formatTime(m.ts)}
                        </time>
                      </div>
                    </article>
                  ) : (
                    <article key={m.id} aria-label={`You: ${formatTime(m.ts)}`} className="flex justify-end">
                      <div className="max-w-[85%] sm:max-w-[70%] text-right">
                        <div
                          className="inline-block rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base"
                          style={{ backgroundColor: "rgb(var(--color-primary))", color: "white", boxShadow: "var(--shadow-md)" }}
                        >
                          <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{m.text}</div>
                        </div>
                        <time className="mt-1 text-xs sm:text-sm block" style={{ color: "rgb(var(--color-text-quaternary))" }}>
                          {formatTime(m.ts)}
                        </time>
                      </div>
                    </article>
                  )
                )}

                {isTyping && (
                  <div className="flex items-start gap-2 sm:gap-4" aria-hidden>
                    <img
                      src="/image/site-icon.png"
                      alt="Assistant"
                      className="h-7 w-7 sm:h-9 sm:w-9 rounded-full border border-slate-200 shadow-sm"
                    />
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white/90 shadow-sm border border-slate-200">
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse bg-slate-400" />
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse bg-slate-400 delay-75" />
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse bg-slate-400 delay-150" />
                      </div>
                      <span className="text-xs sm:text-sm text-slate-500">typing…</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t" style={{ borderColor: "rgb(var(--color-border-light))" }} />

            {/* Input bar */}
            <div className="px-3 sm:px-6 py-3 sm:py-4" style={{ backgroundColor: "rgb(var(--color-bg-primary))" }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="flex items-center gap-2 sm:gap-3"
                aria-label="Send a message"
              >
                {/* Inner rounded input field to match screenshot */}
                <div className="flex-1">
                  <div className="rounded-full border border-indigo-200 px-3 sm:px-4 py-2 flex items-center bg-white/80">
                    <label htmlFor="deal-chat-input" className="sr-only">
                      Ask about opportunity
                    </label>
                    <textarea
                      id="deal-chat-input"
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => {
                        setInput(e.target.value);
                        autosize(textareaRef.current);
                      }}
                      onKeyDown={onKeyDown}
                      placeholder="Ask about query..."
                      className="chat-input-textarea"
                      rows={1}
                      disabled={isSending}
                      aria-label="Ask a question"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSending || !input.trim()}
                  aria-label="Send message"
                  className={`h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center transition flex-shrink-0 touch-manipulation focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isSending || !input.trim()
                      ? "bg-emerald-600 cursor-not-allowed text-white"
                      : "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white"
                  }`}
                  title={input.trim() ? "Send message" : "Type a message to enable send"}
                >
                  {isSending ? (
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                      <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M15 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modal, portalTarget);
};

export default ChatModal;
