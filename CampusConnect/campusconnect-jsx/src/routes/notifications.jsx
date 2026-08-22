import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Bell,
  CalendarDays,
  Users,
  MessagesSquare,
  Settings2,
  CheckCheck,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell, GlassCard } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "../lib/api-config.js";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — CampusConnect" },
      {
        name: "description",
        content:
          "Event confirmations, club updates, mentions and booking reminders.",
      },
    ],
  }),
  component: NotificationsPage,
});

const iconFor = {
  event: CalendarDays,
  club: Users,
  chat: MessagesSquare,
  system: Settings2,
};

const tabs = ["All", "Events", "Clubs", "Mentions"];

const API_URL = `${API_BASE_URL}/api/notifications`;

function NotificationsPage() {
  const [notices, setNotices] = useState([]);
  const [tab, setTab] = useState("All");

  // ✅ FETCH FROM BACKEND
  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await fetch(API_URL);
      const data = await res.json();

      // ✅ DEFINE list FIRST
      const list = Array.isArray(data) ? data : data.data || [];

      const formatted = list.map((n) => ({
        id: n._id,
        title: n.title,
        body: n.message,
        time: new Date(n.createdAt).toLocaleString(),
        kind: n.type || "system",
        read: Boolean(n.read),
      }));

      setNotices(formatted);
    };

    fetchNotifications();

    // 🔁 Auto-refresh every 3 sec (feels real-time)
    const interval = setInterval(fetchNotifications, 3000);
    return () => clearInterval(interval);
  }, []);

  // ✅ MARK ONE AS READ
  const markAsRead = async (id) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

    try {
      await fetch(`${API_URL}/${id}/read`, { method: "PATCH" });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // ✅ MARK ALL AS READ
  const markAllAsRead = async () => {
    setNotices((prev) => prev.map((n) => ({ ...n, read: true })));
    toast("All notifications marked as read");

    try {
      await fetch(`${API_URL}/read-all`, { method: "PATCH" });
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  // ✅ FILTER LOGIC
  const filtered = notices.filter((n) => {
    if (tab === "Events") return n.kind === "event";
    if (tab === "Clubs") return n.kind === "club";
    if (tab === "Mentions") return n.kind === "chat";
    return true;
  });

  const unreadCount = notices.filter((n) => !n.read).length;

  return (
    <AppShell
      title="Notifications"
      subtitle={`${unreadCount} unread`}
      action={
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-xl bg-card/60"
          onClick={markAllAsRead}
        >
          <CheckCheck className="size-4" />
          <span className="hidden sm:inline">Mark all read</span>
        </Button>
      }
    >
      <div className="mx-auto max-w-3xl space-y-4">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
                tab === t
                  ? "bg-gradient-brand text-primary-foreground"
                  : "glass-soft text-muted-foreground hover:text-foreground"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Notifications */}
        {filtered.map((n) => {
          const Icon = iconFor[n.kind] || Settings2;
          const isRead = n.read;

          return (
            <button
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className="block w-full text-left"
            >
              <GlassCard
                className={cn(
                  "grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-4",
                  isRead && "opacity-60"
                )}
              >
                <span className="grid size-10 place-items-center rounded-2xl bg-gradient-brand text-primary-foreground">
                  <Icon className="size-4" />
                </span>

                <div className="min-w-0">
                  <p className="truncate font-semibold">{n.title}</p>
                  <p className="text-sm text-muted-foreground">{n.body}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {n.time}
                  </p>
                </div>

                {!isRead && (
                  <span className="mt-2 size-2 rounded-full bg-primary" />
                )}
              </GlassCard>
            </button>
          );
        })}

        {/* Empty State */}
        {filtered.length === 0 && (
          <GlassCard className="py-14 text-center">
            <Bell className="mx-auto size-9 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              Nothing here right now.
            </p>
          </GlassCard>
        )}
      </div>
    </AppShell>
  );
}