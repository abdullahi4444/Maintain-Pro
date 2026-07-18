import { useAuthStore } from "@/app/store";
import { Bell, Menu, Search, User, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { notificationsAPI } from "@/services/api";
import { useTheme } from "@/components/theme-provider";
import { getImageUrl } from "@/lib/utils";

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const { data: notifications } = useQuery({
    queryKey: ["notifications-count"],
    queryFn: () => notificationsAPI.getAll({ limit: 5 }),
    refetchInterval: 30000,
  });

  const unreadCount = notifications?.data?.filter((n: any) => !n.isRead)?.length || 0;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search bar */}
        <div className="hidden md:flex items-center gap-2.5 bg-muted/50 rounded-lg px-3.5 py-2 min-w-[280px] border border-border hover:border-muted-foreground/30 transition-colors">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search requests, users..."
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
          />
          <kbd className="hidden lg:inline-flex h-5 px-1.5 items-center gap-0.5 rounded border border-border bg-background text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/app/notifications")}
          className="relative h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold text-white px-1 animate-pulse-glow">
              {unreadCount}
            </span>
          )}
        </Button>

        {/* User avatar */}
        <button
          onClick={() => navigate("/app/profile")}
          className="flex items-center gap-3 rounded-lg px-2.5 py-1.5 hover:bg-muted transition-colors ml-1"
        >
          {user?.avatar ? (
                <img
                  src={getImageUrl(user.avatar) || ""}
                  alt={user.fullName}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-500/20"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center ring-2 ring-foreground/10">
              <span className="text-xs font-bold text-foreground">
                {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
          )}
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-foreground">{user?.fullName}</p>
            <p className="text-[11px] text-muted-foreground">{user?.role}</p>
          </div>
        </button>
      </div>
    </header>
  );
}

