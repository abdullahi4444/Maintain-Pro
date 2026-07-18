import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/app/store";
import {
  Home,
  FileText,
  Users,
  Bell,
  User,
  LogOut,
  Wrench,
  ClipboardList,
  Plus,
  BarChart3,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { cn, getImageUrl } from "@/lib/utils";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navSections = [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", href: "/app/dashboard", icon: Home, roles: ["ADMIN", "TECHNICIAN", "REQUESTER"] },
      ],
    },
    {
      title: "Requests",
      items: [
        { label: "Create Request", href: "/app/requests/create", icon: Plus, roles: ["REQUESTER", "ADMIN"] },
        { label: "My Requests", href: "/app/requests/my", icon: FileText, roles: ["REQUESTER"] },
        { label: "Assigned to Me", href: "/app/requests/assigned", icon: ClipboardList, roles: ["TECHNICIAN"] },
        { label: "All Requests", href: "/app/requests", icon: FileText, roles: ["ADMIN"] },
      ],
    },
    {
      title: "Management",
      items: [
        { label: "Users", href: "/app/users", icon: Users, roles: ["ADMIN"] },
        { label: "Technicians", href: "/app/technicians", icon: Wrench, roles: ["ADMIN"] },
        { label: "Reports", href: "/app/reports", icon: BarChart3, roles: ["ADMIN"] },
      ],
    },
    {
      title: "Account",
      items: [
        { label: "Notifications", href: "/app/notifications", icon: Bell, roles: ["ADMIN", "TECHNICIAN", "REQUESTER"] },
        { label: "Profile", href: "/app/profile", icon: User, roles: ["ADMIN", "TECHNICIAN", "REQUESTER"] },
      ],
    },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-[272px] flex flex-col transition-all duration-300 ease-in-out",
          "bg-card",
          "border-r border-border",
          !open && "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 flex-shrink-0 mt-4">
          <div className="flex items-center gap-2.5">
            <img 
              src="/logo.png" 
              alt="MaintainPro Logo" 
              className="h-8 w-8 rounded-lg"
            />
            <div>
              <h1 className="text-base font-bold text-foreground tracking-tight">MaintainPro</h1>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Dashboard</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors lg:hidden"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section) => {
            const filteredItems = section.items.filter(
              (item) => user?.role && item.roles.includes(user.role)
            );
            if (filteredItems.length === 0) return null;

            return (
              <div key={section.title}>
                <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.title}
                </p>
                <div className="space-y-0.5">
                  {filteredItems.map((item) => (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      onClick={() => window.innerWidth < 1024 && setOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
                          isActive
                            ? "bg-muted text-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200",
                              isActive
                                ? "text-foreground"
                                : "text-muted-foreground group-hover:text-foreground"
                            )}
                          >
                            <item.icon className="h-4 w-4" />
                          </div>
                          <span>{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* User section at bottom */}
        <div className="flex-shrink-0 border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 mb-1">
            {user?.avatar ? (
              <img
                src={getImageUrl(user.avatar) || ""}
                alt={user.fullName}
                className="h-9 w-9 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted border border-border">
                <span className="text-sm font-bold text-foreground">
                  {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user?.fullName}</p>
              <p className="text-[11px] text-muted-foreground">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/[0.08] transition-all duration-200"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/[0.06]">
              <LogOut className="h-4 w-4" />
            </div>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

