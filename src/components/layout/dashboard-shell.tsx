"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import ChatAssistant from "@/components/dashboard/ChatAssistant";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up");

  if (isLandingPage || isAuthPage) {
    return <div className="min-h-screen bg-white">{children}</div>;
  }

  // AI Sidebar is now permanent for all dashboard-related pages
  const showAISidebar = true;

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* 2nd Column: AI Assistant (Sedang) */}
        {showAISidebar && (
          <ChatAssistant />
        )}

        {/* 3rd Column: Main Content (Lebar) */}
        <div className="flex flex-1 flex-col overflow-hidden relative bg-gradient-to-br from-slate-50/50 to-white">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative z-10 overflow-x-hidden">
            <div className="max-w-[1400px] mx-auto w-full">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
