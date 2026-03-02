"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing Analytics Engine...");

  useEffect(() => {
    // Phase 1: Logo Entry & Wait (2 seconds)
    const initialDelay = setTimeout(() => {
      // Phase 2: Start Progress
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            // Phase 3: Final Stabilization (3 seconds delay at 100%)
            setTimeout(onComplete, 3000);
            return 100;
          }
          return prev + 1;
        });
      }, 70); // 70ms per 1% = ~7 seconds for full progress
    }, 2000);

    const textTimer = setInterval(() => {
      const texts = [
        "Initializing Analytics Engine...",
        "Connecting to Groq AI High-Performance Node...",
        "Loading Predictive Marketing Models...",
        "Calibrating Data Pulse & ROI Engines...",
        "Optimizing UI Components for Premium Experience...",
        "Synchronizing User Sessions...",
        "Safety & Security Protocols Verified...",
        "Ready to Launch..."
      ];
      setLoadingText((prev) => {
        const currentIndex = texts.indexOf(prev);
        return texts[(currentIndex + 1) % texts.length];
      });
    }, 1100);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(textTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0F0720]"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative flex flex-col items-center">
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="flex items-center gap-4 mb-12"
        >
          <div className="p-4 bg-violet-600 rounded-2xl shadow-[0_0_40px_rgba(124,58,237,0.3)]">
            <BarChart3 className="h-10 w-10 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-black text-white tracking-tighter">
              Marketing<span className="text-violet-400">Analytics</span>
            </span>
            <span className="text-[10px] font-black tracking-[0.4em] text-violet-500 uppercase">Haka Digital Network</span>
          </div>
        </motion.div>

        {/* Loading Sequence */}
        <div className="w-64 space-y-4">
          <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin text-violet-500" />
              {loadingText}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-violet-600 to-indigo-500"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
