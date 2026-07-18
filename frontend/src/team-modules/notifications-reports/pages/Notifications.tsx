import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsAPI } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Clock,
  Info,
  AlertTriangle,
  Wrench,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";

function getNotificationIcon(title: string) {
  const lower = title.toLowerCase();
  if (lower.includes("assign")) return Wrench;
  if (lower.includes("comment")) return MessageSquare;
  if (lower.includes("complete")) return Check;
  if (lower.includes("reject")) return AlertTriangle;
  if (lower.includes("update") || lower.includes("status")) return Info;
  return Bell;
}

function getNotificationColor(title: string) {
  const lower = title.toLowerCase();
  if (lower.includes("assign")) return { bg: "bg-blue-500/10", text: "text-blue-400" };
  if (lower.includes("comment")) return { bg: "bg-purple-500/10", text: "text-purple-400" };
  if (lower.includes("complete")) return { bg: "bg-emerald-500/10", text: "text-emerald-400" };
  if (lower.includes("reject")) return { bg: "bg-red-500/10", text: "text-red-400" };
  return { bg: "bg-amber-500/10", text: "text-amber-400" };
}

function timeAgo(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString();
}

export function NotificationsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["all-notifications"],
    queryFn: () => notificationsAPI.getAll(),
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationsAPI.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-count"] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationsAPI.markAllAsRead(),
    onSuccess: () => {
      toast.success("All notifications marked as read");
      queryClient.invalidateQueries({ queryKey: ["all-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-count"] });
    },
  });

  const notifications = data?.data || [];
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "You're all caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            onClick={() => markAllReadMutation.mutate()}
            className="bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 gap-2 text-sm"
          >
            <CheckCheck className="h-4 w-4" /> Mark all read
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <Bell className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{notifications.length}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/15 flex items-center justify-center">
              <BellOff className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{unreadCount}</p>
              <p className="text-xs text-muted-foreground">Unread</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="space-y-3 stagger-children">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="border-border bg-card">
              <CardContent className="p-5 flex gap-4">
                <div className="h-10 w-10 rounded-xl shimmer flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded shimmer" />
                  <div className="h-3 w-1/2 rounded shimmer" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <Bell className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold text-muted-foreground">No notifications</h3>
            <p className="text-sm text-muted-foreground mt-1">You'll see updates here when something happens</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2 stagger-children">
          {notifications.map((notification: any) => {
            const Icon = getNotificationIcon(notification.title);
            const color = getNotificationColor(notification.title);

            return (
              <Card
                key={notification.id}
                className={`border-border transition-all duration-200 cursor-pointer group ${
                  notification.isRead
                    ? "bg-card opacity-60 hover:opacity-80"
                    : "bg-card hover:bg-muted/40 border-l-2 border-l-blue-500/40"
                }`}
                onClick={() => {
                  if (!notification.isRead) markReadMutation.mutate(notification.id);
                }}
              >
                <CardContent className="p-5 flex items-start gap-4">
                  <div className={`h-10 w-10 rounded-xl ${color.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`h-5 w-5 ${color.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className={`text-sm font-medium ${notification.isRead ? "text-muted-foreground" : "text-foreground/80"}`}>
                          {notification.title}
                        </p>
                        <p className={`text-sm mt-0.5 ${notification.isRead ? "text-muted-foreground" : "text-muted-foreground"}`}>
                          {notification.message}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {timeAgo(notification.createdAt)}
                        </span>
                        {!notification.isRead && (
                          <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse-glow" />
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

