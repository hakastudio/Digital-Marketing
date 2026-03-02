"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <div className="relative flex flex-col items-center gap-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="p-4 bg-violet-600 rounded-2xl shadow-2xl shadow-violet-200"
        >
          <Bot className="h-8 w-8 text-white" />
        </motion.div>
        
        <div className="space-y-2 text-center">
          <div className="h-4 w-32 bg-slate-100 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-500/20 to-transparent"
            />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading Data...</p>
        </div>
      </div>
    </div>
  );
}
