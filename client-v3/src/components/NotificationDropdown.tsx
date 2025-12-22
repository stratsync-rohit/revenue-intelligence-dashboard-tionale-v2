// Notification dropdown component for header
import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import notificationsData from "../data/notifications.json";

type Notification = {
  id: number;
  type: string;
  title: string;
  message: string;
  time: string;
  icon: string;
  iconBg: string;
};

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications] = useState<Notification[]>(notificationsData);
  const ref = useRef<HTMLDivElement>(null);

  // Check if there are any unread notifications
  const hasUnread = notifications.some(n => n.isRead === false);

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

  const getBgColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "info":
        return "bg-blue-500";
      case "primary":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div ref={ref} className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-[rgba(var(--color-accent-primary),0.1)] rounded-full transition-colors"
      >
        <Bell className="w-6 h-6 text-[rgb(var(--color-text-secondary))]" />
        {hasUnread && (
          <span className="absolute top-1 right-1 block w-2.5 h-2.5 bg-red-600 rounded-full " />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
  <div
  className="
    absolute right-0 mt-3
    w-[calc(100vw-2rem)] sm:w-[380px] md:w-[420px]
    max-w-[420px]
    z-[9999]
    bg-[rgba(8,12,20,0.75)]
    backdrop-blur-2xl
    border border-white/10
    rounded-2xl
    shadow-[0_30px_80px_rgba(0,0,0,0.65)]
    overflow-hidden
  "
>

    {/* Notifications List */}
    <div className="max-h-[60vh] sm:max-h-[420px] overflow-y-auto divide-y divide-white/5">
      {notifications.length === 0 ? (
        <div className="px-4 py-10 text-center text-[rgb(var(--color-text-secondary))]">
          <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No notifications</p>
        </div>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className="px-4 py-3 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-start gap-3">
              
              {/* Icon */}
              <div
                className={`${getBgColor(
                  notification.type
                )} w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm`}
              >
                {notification.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white leading-snug">
                  {notification.title}
                </h4>

                <p className="text-xs text-white/70 mt-1 line-clamp-2">
                  {notification.message}
                </p>

                <span className="text-xs text-white/40 mt-2 block">
                  {notification.time}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
)}

    </div>
  );
}
