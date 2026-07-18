import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { cn } from "@/lib/utils";

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out min-w-0",
          sidebarOpen ? "lg:ml-[272px]" : "ml-0"
        )}
      >
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-fade-in w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
