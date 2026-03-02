"use client";

import { SignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, CheckCircle2, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import IntroModal from "@/components/ui/IntroModal";
import SplashScreen from "@/components/ui/SplashScreen";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Check if splash has been shown in this session
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    if (hasSeenSplash) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem("hasSeenSplash", "true");
  };


  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white selection:bg-violet-100 selection:text-violet-900 overflow-hidden font-sans">
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      </AnimatePresence>

      <IntroModal />

      {/* ─── LEFT PANEL ─── */}
      <div className="relative w-full lg:w-[55%] flex flex-col overflow-hidden min-h-[500px] lg:min-h-screen">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A0B3B] via-[#0F0720] to-[#0A0514]" />

        {/* Decorative Blobs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center justify-center gap-2.5 pt-10 pb-4">
          <div className="p-2.5 bg-violet-600 rounded-xl shadow-lg shadow-violet-900/20">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            Marketing<span className="text-violet-400">Analytics</span>
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-8 lg:px-16 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center max-w-xl w-full"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-violet-300 text-[10px] font-black uppercase tracking-[0.2em] mb-6 backdrop-blur-sm">
              <Zap className="h-3 w-3 fill-violet-400" /> Powered by Groq AI
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight mb-5">
              Optimalkan Performa Iklan Anda dalam{" "}
              <span className="text-violet-400">Hitungan Detik.</span>
            </h1>
            <p className="text-slate-400 text-base md:text-lg font-medium leading-relaxed max-w-md mx-auto">
              Analisa ROI, ROAS, dan Laba Bersih secara otomatis dengan algoritma Senior Marketing Advisor.
            </p>
          </motion.div>
        </div>

        {/* Footer left */}
        <p className="relative z-10 text-center pb-6 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
          &copy; 2026 &bull; Haka Digital Network
        </p>
      </div>

      {/* ─── RIGHT PANEL: Authentication ─── */}
      <div className="w-full lg:w-[45%] flex flex-col items-center justify-center p-8 bg-white min-h-screen">
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-violet-600 rounded-xl">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">MarketingAnalytics</span>
            </div>
          </div>

          <SignedIn>
            <div className="text-center space-y-6">
              <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-sm">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Sesi Anda Aktif</h2>
              <p className="text-slate-500 font-medium max-w-xs mx-auto">
                Selamat datang kembali! Dashboard Anda sudah siap diakses.
              </p>
              <Link href="/dashboard" className="block w-full">
                <button className="w-full py-4 bg-[#7F56D9] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#6941C6] transition-all shadow-xl shadow-violet-100 active:scale-95 flex items-center justify-center gap-2">
                  Buka Dashboard <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </SignedIn>

          <SignedOut>
            <SignIn
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-0 p-0",
                  headerTitle: "text-2xl font-black text-slate-900 tracking-tight text-center",
                  headerSubtitle: "text-slate-500 font-medium text-center text-sm",
                  socialButtonsBlockButton: "rounded-xl border-slate-200 hover:bg-slate-50 transition-all font-bold text-sm h-12 shadow-sm",
                  formFieldLabel: "text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5",
                  formFieldInput: "rounded-xl border-slate-200 bg-slate-50 focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 py-3 text-sm font-bold text-slate-900",
                  formButtonPrimary: "bg-[#7F56D9] hover:bg-[#6941C6] rounded-xl py-4 font-black text-xs uppercase tracking-[0.1em] transition-all active:scale-95 shadow-xl shadow-violet-100 mt-4",
                  footerActionLink: "text-violet-600 font-black hover:text-violet-700",
                  dividerText: "text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]",
                  identityPreviewText: "font-bold text-slate-900",
                  formResendCodeLink: "text-violet-600 font-bold",
                },
              }}
              routing="path"
              path="/"
              signUpUrl="/sign-up"
            />
          </SignedOut>

        </div>
      </div>
    </div>
  );
}
