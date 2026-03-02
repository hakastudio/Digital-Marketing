"use client";

import { SignUp } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  CheckCircle2, 
  ArrowLeft,
  Zap
} from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white selection:bg-violet-100 selection:text-violet-900 overflow-hidden font-sans text-slate-900">
      
      {/* ─── LEFT PANEL: Visual & Social Proof ─── */}
      <div className="relative w-full lg:w-[55%] flex flex-col justify-center items-center p-8 lg:p-20 overflow-hidden min-h-[500px] lg:min-h-screen">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[#0F0720]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A0B3B] via-[#0F0720] to-[#0A0514]" />
        
        {/* Decorative Blobs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-violet-600/20 rounded-full blur-[120px]" 
        />

        {/* Logo (Top Left) */}
        <div className="absolute top-8 left-8 lg:top-12 lg:left-12 flex items-center gap-2.5 z-20">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-2.5 bg-violet-600 rounded-xl shadow-lg shadow-violet-900/20 group-hover:scale-110 transition-transform">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              Marketing<span className="text-violet-400">Analytics</span>
            </span>
          </Link>
        </div>

        {/* Content Section */}
        <div className="relative z-10 w-full max-w-xl text-center lg:text-left pt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-violet-300 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <Zap className="h-3 w-3 fill-violet-400" /> Join the top 1%
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight mb-6">
              Mulai Perjalanan <span className="text-violet-400">Profitabilitas</span> Anda.
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed mb-12 max-w-lg mx-auto lg:mx-0">
              Daftar sekarang dan dapatkan akses ke dashboard analisa pemasaran tercanggih di Indonesia.
            </p>
          </motion.div>

          {/* Feature List for Sign Up */}
          <div className="space-y-6 max-w-md mx-auto lg:mx-0">
             {[
               { title: "Real-time Tracking", desc: "Pantau setiap rupiah yang Anda belanjakan secara instan." },
               { title: "AI Optimization", desc: "Saran cerdas untuk meningkatkan ROAS hingga 5.00x." },
               { title: "Unified Dashboard", desc: "Semua data dari Meta, Google, dan TikTok dalam satu layar." }
             ].map((feature, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.3 + (i * 0.1) }}
                 className="flex items-start gap-4 text-left"
               >
                 <div className="mt-1 p-1 bg-violet-500/20 rounded-lg">
                   <CheckCircle2 className="h-4 w-4 text-violet-400" />
                 </div>
                 <div>
                   <h4 className="text-sm font-black text-white uppercase tracking-widest">{feature.title}</h4>
                   <p className="text-xs text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                 </div>
               </motion.div>
             ))}
          </div>
        </div>
      </div>

      {/* ─── RIGHT PANEL: Authentication ─── */}
      <div className="w-full lg:w-[45%] flex flex-col items-center justify-center p-8 bg-white relative min-h-screen">
        <div className="w-full max-w-[440px] space-y-8 py-12">
          
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-violet-600 transition-colors mb-4 group transform">
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" /> Kembali ke Login
          </Link>

          <div className="flex justify-center">
            <SignUp 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-0 p-0",
                  headerTitle: "text-3xl font-black text-slate-900 tracking-tight text-center",
                  headerSubtitle: "text-slate-500 font-medium text-center",
                  socialButtonsBlockButton: "rounded-xl border-slate-100 hover:bg-slate-50 transition-all font-bold text-sm",
                  formFieldLabel: "text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5",
                  formFieldInput: "rounded-xl border-slate-200 bg-slate-50 focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 py-3 text-sm font-medium",
                  formButtonPrimary: "bg-[#7F56D9] hover:bg-[#6941C6] rounded-xl py-4 font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-violet-100 mt-2",
                  footerActionLink: "text-violet-600 font-bold hover:text-violet-700",
                  dividerText: "text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]"
                }
              }}
              routing="path"
              path="/sign-up"
              signInUrl="/"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
