"use client";

import { motion } from "framer-motion";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse p-8">
      {/* Header Skeleton */}
      <div className="flex justify-between items-end mb-8">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-slate-100 rounded-lg" />
          <div className="h-4 w-64 bg-slate-50 rounded-lg" />
        </div>
        <div className="h-10 w-32 bg-slate-100 rounded-xl" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-slate-50 rounded-2xl border border-slate-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 h-96 bg-slate-50 rounded-2xl border border-slate-100" />
        <div className="h-96 bg-slate-50 rounded-2xl border border-slate-100" />
      </div>

      {/* Table Skeleton */}
      <div className="h-64 bg-slate-50 rounded-2xl border border-slate-100" />
    </div>
  );
}
