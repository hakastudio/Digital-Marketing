"use client";


import { useState } from "react";
import { Plus, Calculator as CalcIcon, DollarSign, TrendingUp, Briefcase, MinusCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

export default function CalculatorPage() {
  const [adSpend, setAdSpend] = useState<number>(1000);
  const [revenue, setRevenue] = useState<number>(5000);
  const [operatingCosts, setOperatingCosts] = useState<number>(500);

  const roas = adSpend > 0 ? (revenue / adSpend).toFixed(2) : "0.00";
  const totalCosts = adSpend + operatingCosts;
  const netProfit = revenue - totalCosts;
  const roi = totalCosts > 0 ? ((netProfit / totalCosts) * 100).toFixed(1) : "0.0";
  const isProfitable = netProfit > 0;

  return (
    <div className="space-y-4 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-0.5">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          Kalkulator <span className="text-gradient">ROAS & ROI</span> 🧮
        </h1>
        <p className="text-sm text-slate-500 font-medium tracking-tight">Cek profitabilitas kampanye dan pengembalian investasi Anda dengan cepat.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass rounded-xl p-4 border-white/40 shadow-sm transition-all duration-500">
            <h3 className="text-base font-black text-slate-900 mb-6 flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-md"><Plus className="h-3.5 w-3.5 text-blue-600" /></div>
              Input Kampanye
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Biaya Iklan (Rp)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="number"
                    value={adSpend}
                    onChange={(e) => setAdSpend(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 glass border-white/40 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Total Pendapatan (Rp)</label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="number"
                    value={revenue}
                    onChange={(e) => setRevenue(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 glass border-white/40 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Biaya Operasional / HPP (Rp)</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="number"
                    value={operatingCosts}
                    onChange={(e) => setOperatingCosts(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 glass border-white/40 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={cn(
            "p-4 rounded-xl border flex items-center gap-4 transition-all duration-500",
            isProfitable 
              ? "glass bg-emerald-50/20 border-emerald-100/50 text-emerald-800 shadow-md shadow-emerald-100/20" 
              : "glass bg-rose-50/20 border-rose-100/50 text-rose-800 shadow-md shadow-rose-100/20"
          )}>
            {isProfitable ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.15em]">Status: {isProfitable ? "Menguntungkan" : "Merugi"}</p>
              <p className="text-[11px] opacity-80 font-medium">{isProfitable ? "Strategi Anda menghasilkan pengembalian positif." : "Biaya operasional melebihi total pendapatan."}</p>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 content-start">
          <div className="glass rounded-xl p-6 border-white/40 shadow-lg shadow-slate-200/30 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
              <CalcIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">ROAS</p>
              <h2 className="text-4xl font-black text-slate-900 mt-2 tracking-tight">{roas}x</h2>
              <p className="text-[11px] text-slate-500 mt-4 max-w-[200px] mx-auto font-medium">
                Return on Ad Spend. Untuk setiap Rp1 yang dihabiskan, Anda menghasilkan <strong>Rp{roas}</strong>.
              </p>
            </div>
          </div>

          <div className="glass rounded-xl p-6 border-white/40 shadow-lg shadow-slate-200/30 flex flex-col items-center justify-center text-center space-y-4">
            <div className={cn(
              "h-10 w-10 rounded-lg flex items-center justify-center transition-all shadow-sm",
              isProfitable ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
            )}>
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">ROI</p>
              <h2 className={cn(
                "text-3xl font-black mt-2 tracking-tight transition-colors",
                isProfitable ? "text-emerald-600" : "text-rose-600"
              )}>
                {roi}%
              </h2>
              <p className="text-[11px] text-slate-500 mt-4 max-w-[200px] mx-auto font-medium">
                ROI menghitung semua biaya. Anda mendapatkan keuntungan bersih <strong>{roi}%</strong>.
              </p>
            </div>
          </div>

          <div className="md:col-span-2 glass rounded-xl p-6 shadow-xl border-white/40 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -mr-12 -mt-12 rounded-full group-hover:bg-blue-500/20 transition-all"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="space-y-1 text-center md:text-left">
                <p className="text-violet-600 text-[10px] font-black uppercase tracking-[0.2em]">Ringkasan Laba Bersih</p>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{formatCurrency(netProfit)}</h2>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <div className="text-center px-4 py-2 glass border-white/40 rounded-xl shadow-sm">
                  <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-0.5">Total Biaya</p>
                  <p className="text-slate-900 font-bold text-xs">{formatCurrency(totalCosts)}</p>
                </div>
                <div className="text-center px-4 py-2 glass border-white/40 rounded-xl shadow-sm border-blue-100/50">
                  <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-0.5">Total Pendapatan</p>
                  <p className="text-slate-900 font-bold text-xs">{formatCurrency(revenue)}</p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
