"use client";

import { useState } from "react";
import { Link2, Loader2, Instagram, Youtube, Facebook, TrendingUp, Star, Sparkles, MessageSquare, Share2, ExternalLink, AlertCircle, Download, BarChart3, Eye, MousePointer, Play, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const PLATFORM_METRICS: Record<string, { label: string; icon: any; placeholder: string }[]> = {
  instagram: [
    { label: "Engagement Rate (%)", icon: ThumbsUp, placeholder: "e.g. 4.5" },
    { label: "Story Views", icon: Eye, placeholder: "e.g. 1200" },
    { label: "Reach", icon: BarChart3, placeholder: "e.g. 8000" },
  ],
  tiktok: [
    { label: "Video Completion Rate (%)", icon: Play, placeholder: "e.g. 72" },
    { label: "Shares", icon: Share2, placeholder: "e.g. 450" },
  ],
  youtube: [
    { label: "Avg View Duration (mm:ss)", icon: Play, placeholder: "e.g. 3:42" },
    { label: "CTR Thumbnail (%)", icon: MousePointer, placeholder: "e.g. 6.8" },
  ],
  facebook: [
    { label: "Link Clicks", icon: MousePointer, placeholder: "e.g. 340" },
    { label: "Relevance Score (1-10)", icon: Star, placeholder: "e.g. 7" },
  ],
};

function detectPlatform(url: string): { id: string; name: string; icon: any; color: string; bg: string; text: string } | null {
  const lower = url.toLowerCase();
  if (lower.includes("instagram.com") || lower.includes("instagr.am"))
    return { id: "instagram", name: "Instagram", icon: Instagram, color: "from-pink-500 to-rose-500", bg: "bg-pink-50", text: "text-pink-600" };
  if (lower.includes("tiktok.com") || lower.includes("vm.tiktok"))
    return { id: "tiktok", name: "TikTok", icon: TrendingUp, color: "from-slate-800 to-pink-600", bg: "bg-slate-50", text: "text-slate-700" };
  if (lower.includes("youtube.com") || lower.includes("youtu.be"))
    return { id: "youtube", name: "YouTube", icon: Youtube, color: "from-red-500 to-rose-600", bg: "bg-red-50", text: "text-red-600" };
  if (lower.includes("facebook.com") || lower.includes("fb.com") || lower.includes("fb.watch"))
    return { id: "facebook", name: "Facebook", icon: Facebook, color: "from-blue-600 to-blue-500", bg: "bg-blue-50", text: "text-blue-600" };
  return null;
}

interface AnalysisResult {
  platform: string;
  score: number;
  visual: string;
  hooks: string[];
  summary: string;
  detailedReport: string;
}

export default function SocialAnalysisPage() {
  const [url, setUrl] = useState("");
  const [context, setContext] = useState("");
  const [metrics, setMetrics] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  const detected = url.trim() ? detectPlatform(url) : null;
  const platformMetrics = detected ? PLATFORM_METRICS[detected.id] || [] : [];

  const handleAnalyze = async () => {
    if (isLoading || !url.trim()) return;
    if (!detected) {
      setError("Link tidak dikenali. Masukkan link dari Instagram, TikTok, YouTube, atau Facebook.");
      return;
    }

    setIsLoading(true);
    setResult(null);
    setError("");

    const metricsText = Object.entries(metrics)
      .filter(([, v]) => v.trim())
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");

    const prompt = `Kamu adalah pakar analisis konten sosial media ${detected.name} dengan pengalaman 10 tahun.

Analisis konten berikut secara mendalam:
URL: ${url}
Platform: ${detected.name}
${metricsText ? `Metrik yang diberikan user: ${metricsText}` : "Metrik: Tidak disertakan"}
${context ? `Konteks: ${context}` : ""}

${detected.id === "instagram" ? "Fokus metrik: Engagement Rate, Story Views, Reach." : ""}
${detected.id === "tiktok" ? "Fokus metrik: Video Completion Rate, Shares." : ""}
${detected.id === "youtube" ? "Fokus metrik: Average View Duration, CTR Thumbnail." : ""}
${detected.id === "facebook" ? "Fokus metrik: Link Clicks, Relevance Score." : ""}

Berikan analisis DETAIL dalam format PERSIS seperti ini:
RINGKASAN: [1-2 kalimat tentang jenis konten]
SKOR: [angka 1-10]
ANALISA VISUAL: [2-3 kalimat saran spesifik perbaikan visual/konten]
HOOK 1: [kalimat hook viral]
HOOK 2: [kalimat hook viral]
HOOK 3: [kalimat hook viral]
LAPORAN DETAIL:
- Kekuatan: [2-3 poin kekuatan konten]
- Kelemahan: [2-3 poin kelemahan yang perlu diperbaiki]
- Strategi Engagement: [2-3 strategi konkrit untuk meningkatkan engagement]
- Waktu Posting Ideal: [rekomendasikan 2 waktu terbaik untuk posting di ${detected.name}]
- Hashtag Rekomendasi: [5 hashtag relevan]
- Benchmark ${detected.name}: [bandingkan metrik user dengan rata-rata industri jika metrik diberikan]`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          dashboardData: null,
        }),
      });
      const data = await res.json();
      const text: string = data.choices?.[0]?.message?.content || "";

      const summaryMatch = text.match(/RINGKASAN:\s*(.+?)(?=SKOR:|$)/is);
      const scoreMatch = text.match(/SKOR:\s*(\d+)/i);
      const visualMatch = text.match(/ANALISA VISUAL:\s*(.+?)(?=HOOK 1:|$)/is);
      const hook1Match = text.match(/HOOK 1:\s*(.+?)(?=HOOK 2:|$)/is);
      const hook2Match = text.match(/HOOK 2:\s*(.+?)(?=HOOK 3:|$)/is);
      const hook3Match = text.match(/HOOK 3:\s*(.+?)(?=LAPORAN DETAIL:|$)/is);
      const reportMatch = text.match(/LAPORAN DETAIL:\s*([\s\S]+)$/i);

      setResult({
        platform: detected.name,
        score: scoreMatch ? parseInt(scoreMatch[1]) : 7,
        summary: summaryMatch ? summaryMatch[1].trim() : "Konten sosial media terdeteksi.",
        visual: visualMatch ? visualMatch[1].trim() : text.slice(0, 200),
        hooks: [
          hook1Match?.[1]?.trim() || "Awali dengan pertanyaan yang memancing rasa ingin tahu.",
          hook2Match?.[1]?.trim() || "Gunakan data mengejutkan di 3 detik pertama.",
          hook3Match?.[1]?.trim() || "Mulai dengan pernyataan provokatif yang relevan.",
        ],
        detailedReport: reportMatch ? reportMatch[1].trim() : "",
      });
    } catch {
      setError("Gagal terhubung ke AI. Periksa koneksi Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!result) return;
    const report = `
LAPORAN ANALISA SOSIAL MEDIA
============================
Platform: ${result.platform}
URL: ${url}
Tanggal: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}

SKOR KONTEN: ${result.score}/10
RINGKASAN: ${result.summary}

ANALISA VISUAL:
${result.visual}

REKOMENDASI HOOK:
1. ${result.hooks[0]}
2. ${result.hooks[1]}
3. ${result.hooks[2]}

${result.detailedReport ? `LAPORAN DETAIL:\n${result.detailedReport}` : ""}

METRIK YANG DIANALISA:
${Object.entries(metrics).filter(([,v]) => v.trim()).map(([k,v]) => `- ${k}: ${v}`).join("\n") || "- Tidak ada metrik yang dimasukkan"}

---
Generated by MarketingAnalytics AI
    `.trim();

    const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `social_report_${result.platform.toLowerCase()}_${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const scoreColor = !result ? "" : result.score >= 8 ? "text-emerald-600" : result.score >= 5 ? "text-amber-500" : "text-rose-500";
  const scoreBg = !result ? "" : result.score >= 8 ? "bg-emerald-50 border-emerald-100" : result.score >= 5 ? "bg-amber-50 border-amber-100" : "bg-rose-50 border-rose-100";

  return (
    <div className="space-y-6 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="space-y-0.5">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-tight">
          Analisa <span className="text-gradient">Sosial Media</span> 📱
        </h1>
        <p className="text-sm text-slate-500 font-medium tracking-tight">
          Tempel link + masukkan metrik platform untuk laporan AI yang mendalam.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* URL Input */}
          <div className="glass rounded-xl p-5 border-white/40 shadow-sm space-y-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Link Sosial Media</label>
              <div className="relative">
                <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => { setUrl(e.target.value); setError(""); setMetrics({}); }}
                  placeholder="Tempel link di sini..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all placeholder:font-medium placeholder:text-slate-400"
                />
              </div>
              <AnimatePresence>
                {detected && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <div className={cn("flex items-center gap-1.5 px-3 py-1 rounded-lg text-white text-[10px] font-black uppercase tracking-widest bg-gradient-to-r", detected.color)}>
                      <detected.icon className="h-3 w-3" />
                      {detected.name}
                    </div>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-violet-500 hover:underline flex items-center gap-1">
                      Buka <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
              {error && (
                <div className="flex items-center gap-2 text-rose-500 text-xs font-bold">
                  <AlertCircle className="h-3.5 w-3.5" /> {error}
                </div>
              )}
            </div>

            {/* Context */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Konteks (Opsional)</label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Misal: &quot;Video tutorial masak 60 detik&quot;"
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all resize-none"
              />
            </div>
          </div>

          {/* Platform-Specific Metrics */}
          <AnimatePresence>
            {detected && platformMetrics.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="glass rounded-xl p-5 border-white/40 shadow-sm space-y-3 overflow-hidden"
              >
                <h3 className="text-xs font-black text-slate-900 flex items-center gap-2">
                  <div className={cn("p-1.5 rounded-md", detected.bg)}>
                    <detected.icon className={cn("h-3.5 w-3.5", detected.text)} />
                  </div>
                  Metrik {detected.name}
                  <span className="text-[10px] font-medium text-slate-400 ml-auto">Opsional — untuk hasil lebih akurat</span>
                </h3>
                {platformMetrics.map((m) => (
                  <div key={m.label} className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.label}</label>
                    <div className="relative">
                      <m.icon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300" />
                      <input
                        type="text"
                        value={metrics[m.label] || ""}
                        onChange={(e) => setMetrics(prev => ({ ...prev, [m.label]: e.target.value }))}
                        placeholder={m.placeholder}
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={isLoading || !url.trim()}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 rounded-xl font-black text-sm shadow-lg shadow-violet-200/50 hover:shadow-violet-300/60 hover:scale-[1.01] active:scale-95 disabled:opacity-50 transition-all"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {isLoading ? "AI Sedang Menganalisa..." : "Analisa dengan AI"}
          </button>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {!result && !isLoading && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full glass rounded-xl border-white/40 flex flex-col items-center justify-center p-16 text-center min-h-[400px]"
              >
                <div className="p-4 bg-slate-50 rounded-2xl mb-4"><Link2 className="h-10 w-10 text-slate-300" /></div>
                <p className="font-bold text-slate-400 text-base">Tempel link untuk mulai</p>
                <p className="text-sm text-slate-300 mt-1 font-medium">Metrik platform akan muncul otomatis</p>
                <div className="flex gap-4 mt-6 text-slate-300">
                  <Instagram className="h-5 w-5" /><TrendingUp className="h-5 w-5" /><Youtube className="h-5 w-5" /><Facebook className="h-5 w-5" />
                </div>
              </motion.div>
            )}

            {isLoading && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full glass rounded-xl border-white/40 flex flex-col items-center justify-center p-16 space-y-4 min-h-[400px]"
              >
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }} className="p-4 bg-violet-100 rounded-2xl">
                  <Sparkles className="h-8 w-8 text-violet-600" />
                </motion.div>
                <p className="font-black text-slate-700">AI Sedang Menganalisa...</p>
                <p className="text-xs text-slate-400">Menyusun skor, analisa visual, hook, dan laporan detail</p>
              </motion.div>
            )}

            {result && !isLoading && (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }} className="space-y-4"
              >
                {/* Score */}
                <div className={cn("glass rounded-xl p-5 border flex items-center gap-5", scoreBg)}>
                  <div className="shrink-0 text-center">
                    <div className={cn("text-5xl font-black tracking-tighter", scoreColor)}>{result.score}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">/ 10</div>
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-1.5">
                      {[...Array(result.score)].map((_, i) => (
                        <Star key={i} className={cn("h-3 w-3 fill-current", scoreColor)} />
                      ))}
                    </div>
                    <p className={cn("text-sm font-black", scoreColor)}>
                      {result.score >= 8 ? "Potensi Viral Tinggi! 🔥" : result.score >= 5 ? "Konten Cukup Baik ✨" : "Perlu Optimasi 📈"}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">{result.summary}</p>
                  </div>
                  <button onClick={handleDownloadReport} className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95">
                    <Download className="h-3 w-3" /> Unduh
                  </button>
                </div>

                {/* Visual Analysis */}
                <div className="glass rounded-xl p-5 border-white/40">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <MessageSquare className="h-3.5 w-3.5" /> Analisa Visual & Konten
                  </h4>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">{result.visual}</p>
                </div>

                {/* Hooks */}
                <div className="glass rounded-xl p-5 border-white/40">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Share2 className="h-3.5 w-3.5" /> 3 Rekomendasi Hook {result.platform}
                  </h4>
                  <div className="space-y-2">
                    {result.hooks.map((hook, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-violet-50 rounded-xl border border-violet-100/50">
                        <span className="shrink-0 h-5 w-5 flex items-center justify-center bg-violet-600 text-white rounded-full text-[10px] font-black">{i + 1}</span>
                        <p className="text-sm text-slate-800 font-medium leading-relaxed">"{hook}"</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detailed Report */}
                {result.detailedReport && (
                  <div className="glass rounded-xl p-5 border-white/40">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <BarChart3 className="h-3.5 w-3.5" /> Laporan Detail {result.platform}
                    </h4>
                    <div className="text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-line">
                      {result.detailedReport}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
