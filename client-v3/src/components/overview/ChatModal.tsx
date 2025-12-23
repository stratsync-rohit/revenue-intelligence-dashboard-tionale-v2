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

const uid = (p = "") => `${p}${Math.random().toString(36).slice(2, 9)}`;

const formatTime = (ts?: number) =>
  ts
    ? new Date(ts).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

const ChatModal: React.FC<ChatModalProps> = ({ open, signalName, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const portalTarget = typeof document !== "undefined" ? document.body : null;

  /* ---------- AUTO SCROLL ---------- */
  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  /* ---------- INIT MESSAGE ---------- */
  useEffect(() => {
    if (!open) return;
    setMessages([
      {
        id: uid("ai_"),
        role: "ai",
        text: `I can help you analyze this opportunity: ${
          signalName ?? "—"
        }. What would you like to know?`,
        ts: Date.now(),
      },
    ]);
  }, [open, signalName]);

  /* ---------- SEND ---------- */
  const sendMessage = async () => {
    if (!input.trim()) return;

    const text = input.trim();
    setInput("");

    setMessages((p) => [
      ...p,
      { id: uid("u_"), role: "user", text, ts: Date.now() },
    ]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      setMessages((p) => [
        ...p,
        {
          id: uid("ai_"),
          role: "ai",
          text: data.reply ?? "Network error. Try again.",
          ts: Date.now(),
        },
      ]);
    } catch {
      setMessages((p) => [
        ...p,
        {
          id: uid("ai_"),
          role: "ai",
          text: "Network error. Try again.",
          ts: Date.now(),
        },
      ]);
    }
  };

  if (!portalTarget) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4">
          <motion.div className="w-full max-w-[760px] bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* HEADER */}
            <div className="px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    Deal Intelligence Chat
                  </h3>
                  <p className="text-sm text-gray-500">
                    Opportunity:{" "}
                    <span className="font-medium">{signalName ?? "—"}</span>
                  </p>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="ml-4 p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* CHAT */}
            <div
              ref={containerRef}
              className="h-[60vh] p-6 overflow-y-auto space-y-6 bg-gray-50"
            >
              {messages.map((m) =>
                m.role === "ai" ? (
                  /* AI MESSAGE */
                  <div key={m.id} className="flex items-start gap-3">
                    <img
                      src="/image/site-icon.png"
                      className="h-8 w-8 rounded-full"
                    />

                    <div className="flex flex-col items-start max-w-[85%]">
                      <div className="bg-slate-200 px-4 py-3 rounded-2xl text-gray-800">
                        {m.text}
                      </div>
                      <span className="text-xs text-gray-400 mt-1">
                        {formatTime(m.ts)}
                      </span>
                    </div>
                  </div>
                ) : (
                  /* USER MESSAGE */
                  <div key={m.id} className="flex justify-end">
                    <div className="flex flex-col items-end max-w-[85%]">
                      <div className="bg-ai-bubble text-secondary px-4 py-3 rounded-2xl">
                        {m.text}
                      </div>
                      <span className="text-xs text-quaternary mt-1">
                        {formatTime(m.ts)}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* INPUT */}
            <div className="px-6 py-4 border-t bg-white flex gap-3">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                rows={1}
                placeholder="Type a message…"
                className="flex-1 resize-none rounded-full px-4 py-2 border focus:outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={isSending || !input.trim()}
                className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center"
              >
                →
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    portalTarget
  );
};

export default ChatModal;
