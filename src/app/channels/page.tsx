"use client";


import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getCampaigns } from "@/lib/actions";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function ChannelsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const data = await getCampaigns();
      setCampaigns(data);
    }
    loadData();
  }, []);

  const channelMetrics = campaigns.reduce((acc: any, curr) => {
    const channel = curr.channel || "Other";
    if (!acc[channel]) {
      acc[channel] = { name: channel, spend: 0, revenue: 0, roas: 0 };
    }
    acc[channel].spend += curr.budget;
    acc[channel].revenue += curr.revenue;
    acc[channel].roas = acc[channel].spend > 0 ? (acc[channel].revenue / acc[channel].spend) : 0;
    return acc;
  }, {});

  const channelData = Object.values(channelMetrics);
  return (
    <div className="space-y-4 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-0.5">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          Performa <span className="text-gradient">Saluran</span> 📊
        </h1>
        <p className="text-sm text-slate-500 font-medium tracking-tight">Bandingkan ROI dan efisiensi di berbagai saluran pemasaran.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Spend vs Revenue Bar Chart */}
        <div className="glass rounded-xl p-4 border-white/40 shadow-sm transition-all duration-500">
          <h3 className="text-base font-black text-slate-900 mb-6 flex items-center gap-2">
             <div className="p-1.5 bg-violet-100 rounded-md"><BarChart3 className="h-3.5 w-3.5 text-violet-600" /></div>
             Biaya vs Pendapatan
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Bar dataKey="spend" fill="#94a3b8" name="Ad Spend ($)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" fill="#3b82f6" name="Revenue ($)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ROAS Distribution Pie Chart */}
        <div className="glass rounded-xl p-4 border-white/40 shadow-sm transition-all duration-500">
          <h3 className="text-base font-black text-slate-900 mb-6 flex items-center gap-2">
             <div className="p-1.5 bg-blue-100 rounded-md"><PieChartIcon className="h-3.5 w-3.5 text-blue-600" /></div>
             Distribusi Pendapatan
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="revenue"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {channelData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Analysis Table */}
      <div className="glass rounded-xl border-white/40 overflow-hidden relative shadow-lg shadow-slate-200/30">
        <div className="p-4 border-b border-slate-100/30 flex items-center justify-between bg-white/20 backdrop-blur-md">
          <h3 className="text-base font-black text-slate-900">Metrik Operasional</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 font-black">Saluran</th>
                <th className="px-6 py-4 font-black">Total Biaya</th>
                <th className="px-6 py-4 font-black">Total Pendapatan</th>
                <th className="px-6 py-4 font-black">ROAS</th>
                <th className="px-6 py-4 font-black">Skor Efisiensi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {channelData.map((row: any) => (
                <tr key={row.name} className="hover:bg-violet-50/50 transition-all group">
                  <td className="px-6 py-4 font-bold text-slate-900 text-xs">{row.name}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium text-xs">{formatCurrency(row.spend)}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium text-xs">{formatCurrency(row.revenue)}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg text-xs">
                      {row.roas.toFixed(1)}x
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full",
                          row.roas > 4 ? "bg-emerald-500" : row.roas > 2 ? "bg-blue-500" : "bg-amber-500"
                        )}
                        style={{ width: `${Math.min((row.roas / 10) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
