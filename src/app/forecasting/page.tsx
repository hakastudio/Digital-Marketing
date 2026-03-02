"use client";


import { useState } from "react";
import { TrendingUp, Target, DollarSign, Calculator as CalcIcon, AlertCircle } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer 
} from "recharts";

export default function ForecastingPage() {
  const [targetConversions, setTargetConversions] = useState<number>(100);
  const [currentCpa, setCurrentCpa] = useState<number>(25);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(5000);
  
  const requiredBudget = targetConversions * currentCpa;
  const budgetHealth = Math.min(100, (monthlyBudget / requiredBudget) * 100);
  
  const gaugeData = [
    { name: "Allocated", value: budgetHealth },
    { name: "Gap", value: 100 - budgetHealth },
  ];

  const GAUGE_COLORS = ["#2563eb", "#f1f5f9"];

  return (
    <div className="space-y-4 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-0.5">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-tight">
          Peramalan <span className="text-gradient">Anggaran</span> 📈
        </h1>
        <p className="text-sm text-slate-500 font-medium tracking-tight">Estimasi biaya iklan yang dibutuhkan berdasarkan target konversi Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass rounded-xl p-4 border-white/40 shadow-lg shadow-slate-200/30">
            <h3 className="text-base font-black text-slate-900 mb-6 flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-md"><CalcIcon className="h-3.5 w-3.5 text-blue-600" /></div>
              Parameter Peramalan
            </h3>
            
            <div className="space-y-4 text-[13px]">
              <div className="space-y-1.5">
                <label className="font-black text-slate-700 uppercase tracking-widest">Target Konversi</label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="number"
                    value={targetConversions}
                    onChange={(e) => setTargetConversions(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-900 bg-white/50 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-black text-slate-700 uppercase tracking-widest">CPA Saat Ini (Rp)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="number"
                    value={currentCpa}
                    onChange={(e) => setCurrentCpa(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-900 bg-white/50 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5 border-t border-slate-100/50 pt-4">
                <label className="font-black text-slate-700 uppercase tracking-widest">Alokasi Anggaran Bulanan (Rp)</label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="number"
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-900 bg-white/50 backdrop-blur-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100/50 flex gap-3 shadow-sm">
            <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800 leading-relaxed font-medium">
              <strong className="font-black text-blue-700">Tip:</strong> CPA bervariasi tiap saluran. Gunakan rata-rata CPA dari saluran terbaik Anda untuk hasil yang lebih akurat.
            </p>
          </div>
        </div>

        {/* Results & Visualization */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass rounded-xl p-4 border-white/40 shadow-lg shadow-slate-200/30">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Anggaran Dibutuhkan</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{formatCurrency(requiredBudget)}</h2>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-2 leading-relaxed tracking-tight">Total investasi yang dibutuhkan untuk mencapai {targetConversions} konversi.</p>
            </div>

            <div className="glass rounded-xl p-4 border-white/40 shadow-lg shadow-slate-200/30">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Selisih Anggaran</p>
              <div className="flex items-baseline gap-2">
                <h2 className={Number(monthlyBudget - requiredBudget) >= 0 ? "text-2xl font-black text-emerald-600 tracking-tight" : "text-2xl font-black text-rose-600 tracking-tight"}>
                  {formatCurrency(Math.abs(monthlyBudget - requiredBudget))}
                </h2>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  {monthlyBudget >= requiredBudget ? "Surplus" : "Defisit"}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-2 leading-relaxed tracking-tight">Perbedaan antara anggaran yang dialokasikan dan yang dibutuhkan.</p>
            </div>
          </div>

          <div className="glass rounded-xl p-6 border-white/40 shadow-lg shadow-slate-200/30 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none"></div>
            <div className="relative h-44 w-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gaugeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    startAngle={180}
                    endAngle={0}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    {gaugeData.map((entry: { name: string; value: number }, index: number) => (
                      <Cell key={`cell-${index}`} fill={GAUGE_COLORS[index % GAUGE_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-x-0 bottom-4 flex flex-col items-center">
                <span className="text-3xl font-black text-slate-900 tracking-tight">{Math.round(budgetHealth)}%</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Kesehatan</span>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Analisa Kesehatan Anggaran</h3>
              <p className="text-slate-600 text-[13px] font-medium leading-relaxed tracking-tight">
                {budgetHealth >= 100 
                  ? "Anggaran Anda sepenuhnya optimal. Anda memiliki dana yang cukup untuk menutupi prediksi CPA dan mencapai sasaran konversi strategis Anda."
                  : `Anggaran saat ini hanya mencakup ${Math.round(budgetHealth)}% dari kebutuhan target. Pertimbangkan untuk menambah pengeluaran sebesar ${formatCurrency(requiredBudget - monthlyBudget)} untuk ROAS maksimal.`}
              </p>
              <div className="flex flex-wrap gap-4">
                <div className={cn(
                  "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm",
                  budgetHealth >= 100 ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-violet-50 text-violet-600 border-violet-100"
                )}>
                  Rekomendasi: {budgetHealth >= 100 ? "Pertahankan Biaya" : "Tingkatkan Skala"}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
