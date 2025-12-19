// Notification dropdown component for header
import { useState, useEffect, useRef } from "react";
import { Bell, X } from "lucide-react";
import notificationsData from "../data/notifications.json";

type Notification = {
  id: number;
  type: string;
  title: string;
  message: string;
  time: string;
  icon: string;
  iconBg: string;
  isRead: boolean;
};

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(notificationsData);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    setIsOpen(false);
  };

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
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-[rgb(var(--color-bg-secondary))] border border-[rgba(var(--color-border-primary),0.2)] rounded-lg shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-[rgba(var(--color-border-primary),0.2)] flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                  {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
                </p>
              )}
            </div>
            {notifications.length > 0 && (
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-[rgb(var(--color-accent-primary))] hover:underline"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={clearAll}
                  className="text-xs text-red-500 hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-[rgb(var(--color-text-secondary))]">
                <Bell className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 border-b border-[rgba(var(--color-border-primary),0.1)] hover:bg-[rgba(var(--color-accent-primary),0.05)] transition-colors cursor-pointer ${
                    !notification.isRead ? "bg-[rgba(var(--color-accent-primary),0.02)]" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div
                      className={`${getBgColor(
                        notification.type
                      )} w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold`}
                    >
                      {notification.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          className={`text-sm font-semibold ${
                            !notification.isRead
                              ? "text-[rgb(var(--color-text-primary))]"
                              : "text-[rgb(var(--color-text-secondary))]"
                          }`}
                        >
                          {notification.title}
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="text-[rgb(var(--color-text-secondary))] hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-[rgb(var(--color-text-secondary))] mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-[rgb(var(--color-text-tertiary))]">
                          {notification.time}
                        </span>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-[rgb(var(--color-accent-primary))] rounded-full"></span>
                        )}
                      </div>
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
