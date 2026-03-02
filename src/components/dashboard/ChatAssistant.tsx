"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatAssistantProps {
  dashboardData?: {
    totalSpend: number;
    totalRevenue: number;
    roas: string;
    totalConversions: number;
    avgCpa: number;
  };
}

export default function ChatAssistant({ dashboardData: initialDashboardData }: ChatAssistantProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [input, setInput] = useState("");
  const [dashboardData, setDashboardData] = useState(initialDashboardData);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Halo! Saya Senior Marketing Advisor Anda. Ada yang bisa saya bantu analisa hari ini?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If no data provided, fetch it autonomously
    if (!dashboardData) {
      import("@/lib/actions").then(({ getCampaigns }) => {
        getCampaigns().then(campaigns => {
          const totalSpend = campaigns.reduce((acc, curr) => acc + curr.budget, 0);
          const totalRevenue = campaigns.reduce((acc, curr) => acc + curr.revenue, 0);
          const totalConversions = campaigns.reduce((acc, curr) => acc + curr.conversions, 0);
          const avgCpa = totalConversions > 0 ? (totalSpend / totalConversions) : 0;
          const roas = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(1) : "0.0";
          
          setDashboardData({
            totalSpend,
            totalRevenue,
            roas,
            totalConversions,
            avgCpa
          });
        });
      });
    }
  }, [dashboardData]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          dashboardData: dashboardData 
        }),
      });
      const data = await response.json();
      if (data.choices && data.choices[0]) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.choices[0].message.content }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Maaf, terjadi kesalahan koneksi." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={false}
      animate={{ width: isCollapsed ? 64 : 320 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="h-full border-r border-slate-200/60 bg-white flex flex-col relative"
    >
      {/* Header / Collapse Toggle */}
      <div className={cn(
        "p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50",
        isCollapsed ? "flex-col gap-4" : "flex-row"
      )}>
        <div className={cn("flex items-center gap-3", isCollapsed ? "flex-col" : "flex-row")}>
          <motion.div 
            layout
            className="p-2 bg-violet-600 rounded-xl shadow-lg shadow-violet-100 shrink-0"
          >
            <Bot className="h-4 w-4 text-white" />
          </motion.div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <h3 className="text-xs font-black text-slate-900 leading-none mb-1">AI Advisor</h3>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active</span>
              </div>
            </motion.div>
          )}
        </div>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors text-slate-500"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Messages */}
      {!isCollapsed ? (
        <AnimatePresence mode="popLayout">
          <motion.div 
            key="messages"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/20"
            >
              {messages.map((msg, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className={cn(
                    "flex items-start gap-2.5",
                    msg.role === "user" ? "flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "p-3 rounded-2xl text-[13px] leading-relaxed shadow-sm border",
                    msg.role === "assistant" 
                      ? "bg-white text-slate-800 rounded-tl-none border-slate-100" 
                      : "bg-violet-600 text-white rounded-tr-none border-violet-500 font-medium"
                  )}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-2.5"
                >
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                    <Loader2 className="h-3 w-3 animate-spin text-violet-600" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Specialized Input Area */}
            <div className="p-4 border-t border-slate-100 bg-white space-y-3">
              <div className="flex gap-2">
                <select 
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] px-2 py-1.5 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 transition-all cursor-pointer"
                  onChange={(e) => setInput(`Analisa performa ${e.target.value} ini: `)}
                >
                  <option value="">Pilih Platform...</option>
                  <option value="ROI, ROAS & Laba Bersih">Analisa ROI, ROAS & Laba Bersih</option>
                  <option value="Instagram">Instagram (Engagement, Story, Reach)</option>
                  <option value="TikTok">TikTok (Completion, Shares)</option>
                  <option value="YouTube">YouTube (AVD, Thumbnail CTR)</option>
                  <option value="Facebook">Facebook (Clicks, Relevance)</option>
                </select>
              </div>

              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Tempel statistik konten di sini..."
                  rows={3}
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 transition-all font-medium resize-none custom-scrollbar"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-1.5 bottom-1.5 p-1.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 transition-all active:scale-95 shadow-md shadow-violet-100"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-slate-400 font-medium italic text-center">AI akan memberikan Skor, Analisa Visual, & 3 Hook.</p>
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center py-8 space-y-6"
        >
           <MessageSquare className="h-5 w-5 text-slate-300" />
           <div className="h-32 w-[1px] bg-gradient-to-b from-slate-200 to-transparent" />
        </motion.div>
      )}
    </motion.div>
  );
}
