// Notification dropdown component for header
import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import notificationsData from "../data/notifications.json";

/* =========================
   TYPES
========================= */

type NotificationType = "success" | "warning" | "info" | "primary" | "default";

type Notification = {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  icon: string;
  isRead: boolean;
};

/* =========================
   ICON STYLE (SEMANTIC)
========================= */

const getIconStyle = (type: NotificationType) => {
  switch (type) {
    case "success":
      return {
        backgroundColor: "rgb(var(--color-success))",
        color: "rgb(var(--color-text-white))",
      };
    case "warning":
      return {
        backgroundColor: "rgb(var(--color-warning))",
        color: "rgb(var(--color-text-primary))",
      };
    case "info":
      return {
        backgroundColor: "rgb(var(--color-info))",
        color: "rgb(var(--color-text-white))",
      };
    case "primary":
      return {
        backgroundColor: "rgb(var(--color-primary))",
        color: "rgb(var(--color-text-white))",
      };
    default:
      return {
        backgroundColor: "rgb(var(--color-border-medium))",
        color: "rgb(var(--color-text-primary))",
      };
  }
};

/* =========================
   COMPONENT
========================= */

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications] = useState<Notification[]>(
    notificationsData as Notification[]
  );

  const ref = useRef<HTMLDivElement>(null);
  const hasUnread = notifications.some(n => !n.isRead);

  /* Close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(v => !v)}
        aria-label="Notifications"
        className="relative p-2 rounded-full transition-colors"
      >
        <Bell
          className="w-6 h-6"
          style={{ color: "rgb(var(--color-text-secondary))" }}
        />

        {hasUnread && (
          <span
            className="absolute top-2 right-2 block w-2 h-2 rounded-full"
            style={{ backgroundColor: "rgb(var(--color-danger))" }}
          />
        )}
      </button>

      {/* DROPDOWN */}
      {isOpen && (
        <div
          className="absolute right-0 mt-3 z-[9999] overflow-hidden"
          style={{
            width: "min(420px, calc(100vw - 2rem))",

            /* 🔥 BACKGROUND FIXED HERE */
            backgroundColor: "rgba(15, 23, 42, 0.85)", // slate-900 glass
            backdropFilter: "blur(28px)",

            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 18,
            boxShadow: "0 30px 80px rgba(0,0,0,0.65)",
          }}
        >
          {/* LIST */}
          <div className="max-h-[60vh] sm:max-h-[420px] overflow-y-auto divide-y divide-white/5">
            {notifications.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p style={{ color: "rgba(255,255,255,0.6)" }}>
                  No notifications
                </p>
              </div>
            ) : (
              notifications.map(n => {
                const iconStyle = getIconStyle(n.type);

                return (
                  <div
                    key={n.id}
                    className="px-4 py-3 transition-colors hover:bg-white/5"
                  >
                    <div className="flex items-start gap-3">
                      {/* ICON */}
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center
                                   flex-shrink-0 text-sm font-semibold"
                        style={iconStyle}
                      >
                        {n.icon}
                      </div>

                      {/* CONTENT */}
                      <div className="flex-1 min-w-0">
                        <h4
                          className="text-sm font-semibold leading-snug"
                          style={{ color: "rgb(var(--color-text-white))" }}
                        >
                          {n.title}
                        </h4>

                        <p
                          className="text-xs mt-1 line-clamp-2"
                          style={{ color: "rgba(255,255,255,0.7)" }}
                        >
                          {n.message}
                        </p>

                        <span
                          className="text-xs mt-2 block"
                          style={{ color: "rgba(255,255,255,0.4)" }}
                        >
                          {n.time}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
