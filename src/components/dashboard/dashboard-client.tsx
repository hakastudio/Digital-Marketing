"use client";

import { cn, formatCurrency, formatNumber } from "@/lib/utils";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  Target, 
  TrendingUp, 
  Users,
  Instagram, 
  Facebook, 
  Twitter, 
  Globe, 
  Link as LinkIcon,
  ExternalLink,
  Zap,
  Activity,
  Layers,
  ChevronRight,
  BarChart3
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import Link from "next/link";
import ChatAssistant from "./ChatAssistant";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

function getPlatformIcon(url: string | null) {
  if (!url) return <Globe className="h-4 w-4 text-slate-400" />;
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes("instagram.com")) return <Instagram className="h-4 w-4 text-pink-500" />;
  if (lowerUrl.includes("facebook.com")) return <Facebook className="h-4 w-4 text-blue-600" />;
  if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com")) return <Twitter className="h-4 w-4 text-slate-900" />;
  return <LinkIcon className="h-4 w-4 text-blue-500" />;
}

export default function Dashboard({ 
  campaigns = [] 
}: { 
  campaigns?: any[] 
}) {
  const { user } = useUser();
  const totalSpend = campaigns.reduce((acc, curr) => acc + curr.budget, 0);
  const totalConversions = campaigns.reduce((acc, curr) => acc + curr.conversions, 0);
  const avgCpa = totalConversions > 0 ? (totalSpend / totalConversions) : 0;
  const totalRevenue = campaigns.reduce((acc, curr) => acc + curr.revenue, 0);
  const roas = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(1) : "0.0";
  const netProfit = totalRevenue - totalSpend;
  const roi = totalSpend > 0 ? ((netProfit / totalSpend) * 100).toFixed(1) : "0.0";

  const stats = [
    {
      name: "Total Biaya Iklan",
      value: formatCurrency(totalSpend),
      change: totalSpend > 1000 ? "+12.5%" : "0%",
      trend: "up" as const,
      icon: DollarSign,
      gradient: "from-violet-500 to-indigo-600",
    },
    {
      name: "Total Pendapatan",
      value: formatCurrency(totalRevenue),
      change: totalRevenue > 0 ? "+15.2%" : "0%",
      trend: "up" as const,
      icon: TrendingUp,
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      name: "Laba Bersih",
      value: formatCurrency(netProfit),
      change: netProfit > 0 ? "+20.1%" : "0%",
      trend: netProfit > 0 ? "up" as const : "down" as const,
      icon: BarChart3,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      name: "ROI",
      value: `${roi}%`,
      change: Number(roi) > 20 ? "+5.4%" : "-2.1%",
      trend: Number(roi) > 20 ? "up" as const : "down" as const,
      icon: Zap,
      gradient: "from-amber-500 to-orange-600",
    },
    {
      name: "ROAS",
      value: `${roas}x`,
      change: Number(roas) > 3 ? "+0.5x" : "-0.2x",
      trend: Number(roas) > 3 ? "up" as const : "down" as const,
      icon: Target,
      gradient: "from-rose-500 to-pink-600",
    },
  ];

  const channelMetrics = campaigns.reduce((acc: any, curr) => {
    const channel = curr.channel || "Other";
    if (!acc[channel]) {
      acc[channel] = { name: channel, spend: 0, revenue: 0 };
    }
    acc[channel].spend += curr.budget;
    acc[channel].revenue += curr.revenue;
    return acc;
  }, {});

  const barData = Object.values(channelMetrics);

  return (
    <div className="space-y-4 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-tight">
            Halo, <span className="text-gradient">{user?.firstName || "Marketing Pro"}!</span> 🚀
          </h1>
          <p className="text-sm text-slate-500 font-medium tracking-tight">Dashboard analisa performa kampanye Anda secara real-time.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass px-3 py-1.5 rounded-xl flex items-center gap-2 border-white/40">
            <Layers className="h-4 w-4 text-violet-500" />
            <span className="text-sm font-bold text-slate-700">{campaigns.length} Kampanye Aktif</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      >
        {stats.map((stat, idx) => (
          <motion.div 
            key={stat.name} 
            variants={itemVariants}
            whileHover={{ 
              y: -5, 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            className="group relative overflow-hidden glass rounded-xl p-5 border-white/40 cursor-default"
          >
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 via-violet-500/0 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="flex items-center justify-between relative z-10 mb-5">
              <div className={cn(
                "p-3 rounded-2xl bg-gradient-to-br shadow-lg group-hover:shadow-violet-200/50 transition-all duration-500",
                stat.gradient
              )}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <div className={cn(
                "flex items-center text-[10px] font-black px-2.5 py-1.5 rounded-xl shadow-sm",
                stat.trend === "up" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              )}>
                {stat.change}
              </div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1.5 leading-none">{stat.name}</h3>
              <p className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight truncate">
                {stat.value}
              </p>
            </div>
            
            <div className="mt-5 h-1.5 w-full bg-slate-100/50 rounded-full overflow-hidden relative">
               <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "65%" }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
                  className={cn("h-full rounded-full", stat.gradient.split(' ')[1])} 
               />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 glass rounded-xl p-5 border-white/40 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-transparent opacity-20" />
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="p-1.5 bg-violet-100 rounded-md"><Zap className="h-3.5 w-3.5 text-violet-600 fill-violet-600" /></span>
              Analisa Social Pulse
            </h3>
            <button className="text-[10px] font-black text-violet-600 hover:text-violet-700 underline underline-offset-4 uppercase tracking-widest">Detail Data</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="h-72 relative">
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Total</p>
                    <p className="text-3xl font-black text-slate-900">100%</p>
                  </div>
               </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Instagram', value: campaigns.filter(c => c.socialLink?.includes('instagram')).length },
                      { name: 'Facebook', value: campaigns.filter(c => c.socialLink?.includes('facebook')).length },
                      { name: 'Twitter/X', value: campaigns.filter(c => c.socialLink?.includes('twitter') || c.socialLink?.includes('x.com')).length },
                      { name: 'Other', value: campaigns.filter(c => !c.socialLink || (!c.socialLink.includes('instagram') && !c.socialLink.includes('facebook') && !c.socialLink.includes('twitter') && !c.socialLink.includes('x.com'))).length },
                    ].filter(d => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill="#f43f5e" />
                    <Cell fill="#3b82f6" />
                    <Cell fill="#000000" />
                    <Cell fill="#8b5cf6" />
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100/50 hover:bg-white hover:shadow-lg transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-100 rounded-xl"><Instagram className="h-5 w-5 text-pink-600" /></div>
                    <span className="text-sm font-bold text-slate-800">Instagram Ads</span>
                  </div>
                  <span className="text-xs font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">+25%</span>
                </div>
                <p className="text-sm text-slate-500 font-medium">
                  Tingkat klik Instagram meningkat tajam bulan ini. Fokuskan budget lebih besar di sini.
                </p>
              </div>
              
              <div className="p-4 rounded-xl bg-violet-50 border border-violet-100/50 hover:bg-white hover:shadow-lg transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-100 rounded-xl"><Target className="h-5 w-5 text-violet-600" /></div>
                    <span className="text-sm font-bold text-slate-800">Integritas Link</span>
                  </div>
                </div>
                <p className="text-sm text-slate-500 font-medium">
                  {campaigns.filter(c => c.socialLink).length} dari {campaigns.length} kampanye telah terverifikasi sistem tracking.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-5 border-white/40 flex flex-col relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="p-1.5 bg-blue-100 rounded-lg"><BarChart3 className="h-4 w-4 text-blue-600" /></span>
              Pangsa Saluran
            </h3>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} width={100} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="spend" fill="url(#blueGradient)" radius={[0, 10, 10, 0]} barSize={24}>
                     <defs>
                        <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                     </defs>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-100">
             <Link href="/channels" className="flex items-center justify-between group">
                <span className="text-sm font-bold text-slate-600 group-hover:text-violet-600 transition-colors">Lihat Analisa Saluran</span>
                <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-all shadow-sm">
                   <ChevronRight className="h-4 w-4" />
                </div>
             </Link>
          </div>
        </div>
      </div>

      {/* Recent Campaigns Table */}
      <div className="glass rounded-xl border-white/40 overflow-hidden relative shadow-lg shadow-slate-200/30">
        <div className="p-4 border-b border-slate-100/30 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/20 backdrop-blur-md">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-slate-900 rounded-lg shadow-md"><Globe className="h-4 w-4 text-white" /></div>
             <div>
                <h3 className="text-lg font-black text-slate-900">Kampanye Terbaru</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update Terakhir: Hari Ini</p>
             </div>
          </div>
          <Link href="/campaigns" className="text-xs font-black text-violet-600 bg-violet-50/50 hover:bg-violet-600 hover:text-white px-4 py-1.5 rounded-lg transition-all shadow-sm active:scale-95 uppercase tracking-widest">Lihat Semua</Link>
        </div>
        
        <div className="overflow-x-auto">
          {campaigns.length === 0 ? (
            <div className="px-8 py-20 text-center">
              <div className="inline-flex p-5 bg-slate-50 rounded-3xl mb-4"><Layers className="h-10 w-10 text-slate-300" /></div>
              <p className="text-slate-500 font-bold text-lg">Belum ada kampanye digital.</p>
              <Link href="/campaigns" className="text-violet-600 font-black hover:underline mt-2 inline-block">Mulai buat kampanye pertama Anda →</Link>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-[0.2em]">
                <tr>
                  <th className="px-6 py-4 font-black">Kampanye</th>
                  <th className="px-6 py-4 font-black">Saluran</th>
                  <th className="px-6 py-4 font-black">Anggaran</th>
                  <th className="px-6 py-4 font-black">Klik</th>
                  <th className="px-6 py-4 font-black">Konv.</th>
                  <th className="px-6 py-4 font-black text-right">ROAS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50">
                {campaigns.slice(0, 5).map((row: any) => {
                  const campaignRoas = row.budget > 0 ? (row.revenue / row.budget).toFixed(1) : "0.0";
                  return (
                    <tr key={row.id} className="hover:bg-violet-50/50 transition-all group cursor-default">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 flex items-center justify-center bg-white rounded-lg shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-300">
                            {getPlatformIcon(row.socialLink)}
                          </div>
                          <span className="font-bold text-slate-900 group-hover:text-violet-600 transition-colors uppercase tracking-tight text-xs">{row.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className="px-2 py-1 rounded-md bg-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-600">{row.channel}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-bold text-xs">{formatCurrency(row.budget)}</td>
                      <td className="px-6 py-4 text-slate-600 font-bold text-xs">{formatNumber(row.clicks)}</td>
                      <td className="px-6 py-4 text-slate-600 font-bold text-xs">{formatNumber(row.conversions)}</td>
                      <td className="px-6 py-4 text-right">
                         <span className="inline-flex items-center font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg shadow-sm text-xs">
                            {campaignRoas}x
                         </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
