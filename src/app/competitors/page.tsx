"use client";

import { useEffect, useState } from "react";
import { 
  Globe, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Search, 
  MoreVertical, 
  TrendingUp, 
  Type,
  Link as LinkIcon,
  MessageSquare
} from "lucide-react";
import { 
  getCompetitors, 
  addCompetitor, 
  deleteCompetitor 
} from "@/lib/actions";
import { cn } from "@/lib/utils";

interface Competitor {
  id: string;
  name: string;
  website: string;
  strategy: string;
  traffic: string;
  notes: string;
}

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newComp, setNewComp] = useState<Partial<Competitor>>({});

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await getCompetitors();
      setCompetitors(data as any);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComp.name && newComp.website) {
      const success = await addCompetitor({
        name: newComp.name,
        website: newComp.website,
        strategy: newComp.strategy || "N/A",
        traffic: newComp.traffic || "N/A",
        notes: newComp.notes || "No notes added yet.",
      });

      if (success) {
        const data = await getCompetitors();
        setCompetitors(data as any);
        setNewComp({});
        setIsAdding(false);
      }
    }
  };

  const removeCompetitor = async (id: string) => {
    const success = await deleteCompetitor(id);
    if (success) {
      setCompetitors(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-4 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Pantauan <span className="text-gradient">Kompetitor</span> 🕵️
          </h1>
          <p className="text-sm text-slate-500 font-medium tracking-tight">Lacak dan monitor strategi digital serta performa kompetitor Anda.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg font-black shadow-lg shadow-slate-200/50 hover:bg-black transition-all active:scale-95 text-xs uppercase tracking-widest"
        >
          <Plus className="h-4 w-4" />
          Tambah Kompetitor
        </button>
      </div>

      <div className="glass rounded-xl border-white/40 overflow-hidden relative shadow-lg shadow-slate-200/30">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Kompetitor</th>
                <th className="px-6 py-4">Strategi Utama</th>
                <th className="px-6 py-4">Traffic (Est.)</th>
                <th className="px-6 py-4">Catatan</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {competitors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    Belum ada kompetitor yang dilacak. Klik "Tambah Kompetitor" untuk memulai.
                  </td>
                </tr>
              ) : (
                competitors.map((comp) => (
                  <tr key={comp.id} className="hover:bg-violet-50/50 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 flex items-center justify-center bg-white rounded-lg shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                          <Globe className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-2 text-xs">
                            {comp.name}
                            <a href={comp.website} target="_blank" className="text-slate-300 hover:text-blue-500 transition-colors">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium">{comp.website.replace(/^https?:\/\//, '')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100/50">
                        {comp.strategy}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-600 text-xs">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-3.5 w-3.5 text-blue-400" />
                        {comp.traffic}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium text-xs max-w-xs truncate">{comp.notes}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => removeCompetitor(comp.id)}
                        className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAdding(false)} />
          <form 
            onSubmit={handleAdd}
            className="relative w-full max-w-sm glass rounded-xl border-white/40 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300"
          >
            <div className="p-4 border-b border-white/20 bg-white/10 flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900 tracking-tight">Kompetitor Baru</h2>
              <button 
                type="button"
                onClick={() => setIsAdding(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg text-slate-400 transition-colors"
              >
                <Plus className="h-5 w-5 rotate-45" />
              </button>
            </div>
            
            <div className="p-4 space-y-4 bg-white/5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Kompetitor</label>
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input 
                    required
                    placeholder="e.g. Agency X"
                    className="w-full pl-10 pr-4 py-2 glass border-white/40 rounded-lg focus:ring-2 focus:ring-violet-500 transition-all font-medium text-xs text-slate-900"
                    onChange={e => setNewComp({...newComp, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tautan Website</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input 
                    required
                    placeholder="https://example.com"
                    className="w-full pl-10 pr-4 py-2 glass border-white/40 rounded-lg focus:ring-2 focus:ring-violet-500 transition-all font-medium text-xs text-slate-900"
                    onChange={e => setNewComp({...newComp, website: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Strategi</label>
                  <input 
                    placeholder="e.g. PPC Ads"
                    className="w-full px-4 py-2 glass border-white/40 rounded-lg focus:ring-2 focus:ring-violet-500 transition-all font-medium text-xs text-slate-900"
                    onChange={e => setNewComp({...newComp, strategy: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Traffic (Est.)</label>
                  <input 
                    placeholder="e.g. 100k+"
                    className="w-full px-4 py-2 glass border-white/40 rounded-lg focus:ring-2 focus:ring-violet-500 transition-all font-medium text-xs text-slate-900"
                    onChange={e => setNewComp({...newComp, traffic: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Catatan</label>
                <textarea 
                  placeholder="Key observations..."
                  rows={2}
                  className="w-full px-4 py-2 glass border-white/40 rounded-lg focus:ring-2 focus:ring-violet-500 transition-all font-medium resize-none text-xs text-slate-900"
                  onChange={e => setNewComp({...newComp, notes: e.target.value})}
                />
              </div>
            </div>

            <div className="p-4 pt-0 flex gap-3 bg-white/5">
              <button 
                type="submit"
                className="flex-1 bg-slate-900 text-white py-2.5 rounded-lg font-black text-xs uppercase tracking-widest shadow-lg shadow-slate-200/50 transition-all active:scale-95 hover:bg-black"
              >
                Simpan Kompetitor
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
