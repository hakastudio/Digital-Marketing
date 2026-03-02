"use client";


import { useState } from "react";
import { 
  Puzzle, 
  CheckCircle2, 
  Link as LinkIcon, 
  ShieldCheck, 
  ArrowRight,
  Monitor,
  Database,
  Search,
  MessageCircle,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

const integrations = [
  { id: "google-ads", name: "Google Ads", description: "Import search and display campaign data directly.", icon: Search, color: "text-blue-500", bgColor: "bg-blue-50", status: "none" },
  { id: "meta-ads", name: "Meta Ads", description: "Sync Facebook and Instagram ad performance metrics.", icon: MessageCircle, color: "text-blue-600", bgColor: "bg-blue-50", status: "connected" },
  { id: "tiktok-ads", name: "TikTok Ads", description: "Track video engagement and conversion data.", icon: Monitor, color: "text-black", bgColor: "bg-slate-100", status: "none" },
  { id: "ga4", name: "Google Analytics 4", description: "Advanced web tracking and event correlation.", icon: BarChart3, color: "text-amber-500", bgColor: "bg-amber-50", status: "connected" },
  { id: "hubspot", name: "HubSpot CRM", description: "Map marketing leads to sales opportunities.", icon: Database, color: "text-orange-500", bgColor: "bg-orange-50", status: "none" },
  { id: "mailchimp", name: "Mailchimp", description: "Email marketing automation and list analytics.", icon: Puzzle, color: "text-yellow-600", bgColor: "bg-yellow-50", status: "none" },
];

export default function IntegrationHub() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="space-y-4 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Pusat <span className="text-gradient">Integrasi</span> 🔌
          </h1>
          <p className="text-sm text-slate-500 font-medium tracking-tight">Hubungkan alat pemasaran Anda untuk memusatkan semua data performa.</p>
        </div>
        <div className="flex glass p-1 rounded-xl border-white/40 shadow-sm">
          {["all", "connected", "available"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === tab 
                  ? "bg-slate-900 text-white shadow-md shadow-slate-200" 
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              {tab === "all" ? "Semua" : tab === "connected" ? "Terhubung" : "Tersedia"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations
          .filter(int => {
            if (activeTab === "connected") return int.status === "connected";
            if (activeTab === "available") return int.status === "none";
            return true;
          })
          .map((int) => (
            <div 
              key={int.id}
              className="group glass rounded-xl border-white/40 p-4 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={cn("p-2.5 rounded-lg shadow-sm border border-white/20 group-hover:scale-110 transition-transform", int.bgColor)}>
                    <int.icon className={cn("h-5 w-5", int.color)} />
                  </div>
                  {int.status === "connected" ? (
                    <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.15em] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/50">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      Terhubung
                    </span>
                  ) : (
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100/50">
                      Terputus
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-black text-slate-900 tracking-tight">{int.name}</h3>
                  <p className="text-slate-500 text-[11px] leading-relaxed font-medium">{int.description}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100/30">
                {int.status === "connected" ? (
                  <div className="flex items-center justify-between">
                    <button className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-rose-600 transition-colors">Putuskan</button>
                    <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-1 hover:translate-x-1 transition-transform">
                      Setel <ArrowRight className="h-2.5 w-2.5" />
                    </button>
                  </div>
                ) : (
                  <button className="w-full bg-slate-900 text-white py-2 rounded-lg font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-slate-200/50 hover:bg-black transition-all group-hover:-translate-y-0.5">
                    Hubungkan
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>

      <div className="rounded-xl bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-700 p-6 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-xl shadow-blue-200/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10 space-y-2 max-w-xl text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <ShieldCheck className="h-4 w-4 text-blue-200" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100">Sinkronisasi Aman</span>
          </div>
          <h2 className="text-xl font-black tracking-tight">Butuh integrasi lain?</h2>
          <p className="text-blue-50/80 text-xs leading-relaxed font-medium">
            Tim kami terus membangun konektor API baru. Minta integrasi kustom untuk 
            tumpukan pemasaran Anda dan kami akan mambangunnya dalam 48 jam.
          </p>
        </div>
        <button className="relative z-10 px-6 py-3 bg-white text-slate-900 rounded-lg font-black text-[10px] uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all active:scale-95 whitespace-nowrap">
          Minta Konektor
        </button>
      </div>
    </div>
  );
}
