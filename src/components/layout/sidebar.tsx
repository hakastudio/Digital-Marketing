"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  LayoutDashboard, 
  PlusCircle, 
  Filter, 
  Settings,
  Menu,
  X,
  TrendingUp,
  Calculator,
  Users,
  Globe,
  FileText,
  Rss
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Ringkasan", href: "/dashboard", icon: LayoutDashboard },
  { name: "Saluran", href: "/channels", icon: BarChart3 },
  { name: "Kampanye", href: "/campaigns", icon: PlusCircle },
  { name: "Funnel", href: "/funnel", icon: Filter },
  { name: "Ramalan Budget", href: "/forecasting", icon: TrendingUp },
  { name: "Kalkulator ROI", href: "/calculator", icon: Calculator },
  { name: "Wawasan Audiens", href: "/audience", icon: Users },
  { name: "Pantauan Kompetitor", href: "/competitors", icon: Globe },
  { name: "Pusat Laporan", href: "/reports", icon: FileText },
  { name: "Analisa Sosial Media", href: "/social-analysis", icon: Rss },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-50 p-2 glass rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6 text-slate-900" /> : <Menu className="h-6 w-6 text-slate-900" />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] lg:translate-x-0 lg:static lg:inset-0 border-r border-white/5 shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="flex items-center px-6 min-h-[64px] border-b border-white/5">
            <span className="text-xl font-black tracking-tighter">
              Marketing<span className="text-violet-500">Analytics</span>
            </span>
          </div>

          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
            <div className="px-4 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Menu Utama</span>
            </div>
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center px-3 py-2 text-xs font-semibold rounded-lg transition-all group relative overflow-hidden",
                    isActive
                      ? "bg-violet-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon className={cn(
                    "mr-3 h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                    isActive ? "text-white" : "text-slate-500 group-hover:text-violet-400"
                  )} />
                  {item.name}
                  {isActive && (
                    <div className="absolute right-0 top-0 h-full w-1 bg-violet-400 rounded-l-full shadow-[0_0_10px_rgba(167,139,250,0.8)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/5 bg-slate-950/50">
            <Link 
              href="/settings"
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center px-3 py-2 text-xs font-semibold rounded-lg transition-all group",
                pathname === "/settings"
                  ? "bg-violet-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Settings className={cn(
                "mr-3 h-5 w-5 transition-transform duration-300 group-hover:rotate-45",
                pathname === "/settings" ? "text-white" : "text-slate-500 group-hover:text-violet-400"
              )} />
              Setelan
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
