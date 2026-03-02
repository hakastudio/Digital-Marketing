"use client";

import { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { createCampaign } from "@/lib/actions";

export default function CampaignForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    await createCampaign(formData);
    setIsSubmitting(false);
    setIsOpen(false);
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold shadow-sm shadow-blue-200 transition-all active:scale-95"
      >
        <Plus className="h-5 w-5" />
        Buat Kampanye
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">Kampanye Baru</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-200 rounded-lg text-slate-400"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form action={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700" htmlFor="name">Nama Kampanye</label>
                <input 
                  required
                  id="name"
                  name="name"
                  placeholder="e.g. Summer Promo 2024"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700" htmlFor="channel">Saluran</label>
                <select 
                  required
                  id="channel"
                  name="channel"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none bg-white"
                >
                  <option value="Google Ads">Google Ads</option>
                  <option value="Meta Ads">Meta Ads</option>
                  <option value="Instagram Ads">Instagram Ads</option>
                  <option value="TikTok Ads">TikTok Ads</option>
                  <option value="Organic SEO">Organic SEO</option>
                  <option value="Email Marketing">Email Marketing</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700" htmlFor="socialLink">URL Kampanye / Link Sosial</label>
                <input 
                  id="socialLink"
                  name="socialLink"
                  placeholder="e.g. https://www.social.com/post/123"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700" htmlFor="budget">Anggaran Harian (Rp)</label>
                <input 
                  required
                  type="number"
                  id="budget"
                  name="budget"
                  placeholder="0.00"
                  step="0.01"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button 
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button 
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isSubmitting ? 'Memproses...' : 'Luncurkan Kampanye'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
