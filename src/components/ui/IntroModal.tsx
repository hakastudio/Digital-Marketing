"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Target, TrendingUp, ArrowRight, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";

export default function IntroModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeenModal = sessionStorage.getItem("hasSeenIntroModal");
      if (!hasSeenModal) {
        setIsOpen(true);
        sessionStorage.setItem("hasSeenIntroModal", "true");
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0F0720]/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[260px] bg-white rounded-2xl overflow-hidden shadow-2xl shadow-violet-900/40"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-100/50 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors z-10"
            >
              <X className="h-3 w-3" />
            </button>

            {/* Gradient Header */}
            <div className="h-10 bg-gradient-to-br from-violet-600 to-indigo-700 px-4 flex items-center justify-center relative overflow-hidden">
               <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
               <div className="flex items-center gap-2">
                 <div className="p-1.5 bg-white/20 backdrop-blur-lg rounded-lg">
                   <BarChart3 className="h-4 w-4 text-white" />
                 </div>
                 <span className="text-xs font-black text-white tracking-tight">MarketingAnalytics</span>
               </div>
            </div>

            {/* Content */}
            <div className="p-3 space-y-2.5 text-center">
              <div className="space-y-1">
                <h2 className="text-sm font-black text-slate-900 leading-tight">Siap Maksimalkan <br/><span className="text-violet-600">Profit Iklan Anda?</span></h2>
                <p className="text-[10px] text-slate-500 font-bold max-w-[220px] mx-auto">Temukan wawasan terdalam kampanye Anda dengan algoritma Senior Marketing Advisor.</p>
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { icon: Zap, title: "Groq AI Powered", desc: "Analisa instan secepat kilat.", color: "bg-amber-100 text-amber-600" },
                  { icon: Target, title: "Precision Tracking", desc: "ROAS & ROI real-time.", color: "bg-blue-100 text-blue-600" },
                  { icon: TrendingUp, title: "Profit Optimized", desc: "Strategi pertumbuhan yang tajam.", color: "bg-emerald-100 text-emerald-600" }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className="flex items-center gap-2 text-left p-2 rounded-xl border border-slate-50 bg-slate-50/50 hover:bg-slate-50 hover:border-violet-100 transition-all group"
                  >
                    <div className={`p-2 rounded-xl ${item.color} group-hover:scale-110 transition-transform flex-shrink-0`}>
                      <item.icon className="h-3 w-3" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-[12px]">{item.title}</h4>
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2 bg-violet-600 text-white rounded-lg font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-violet-200 hover:bg-violet-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Mulai Sekarang <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
