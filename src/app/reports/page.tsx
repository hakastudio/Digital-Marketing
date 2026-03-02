"use client";


import { 
  FileText, 
  Download, 
  Share2, 
  Calendar, 
  Search, 
  ArrowRight,
  Plus,
  FileSpreadsheet,
  FileJson,
  CheckCircle2,
  Clock
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getCampaigns, getReports, createReport, deleteReport } from "@/lib/actions";

export default function ReportsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [campaignData, reportData] = await Promise.all([
        getCampaigns(),
        getReports()
      ]);
      setCampaigns(campaignData);
      setReports(reportData);
    }
    loadData();
  }, []);

  const exportToCSV = () => {
    if (campaigns.length === 0) return;
    
    const headers = ["ID", "Name", "Channel", "Budget", "Conversions", "Revenue", "Status", "Link"];
    const rows = campaigns.map((c: any) => [
      c.id, 
      c.name, 
      c.channel, 
      c.budget, 
      c.conversions, 
      c.revenue, 
      c.status,
      c.socialLink || ""
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r: any) => r.join(","))
    ].join("\n");

    downloadFile(csvContent, `marketing_report_${new Date().toISOString().split('T')[0]}.csv`, "text/csv");
  };

  const exportToJSON = () => {
    if (campaigns.length === 0) return;
    const jsonContent = JSON.stringify(campaigns, null, 2);
    downloadFile(jsonContent, `marketing_report_${new Date().toISOString().split('T')[0]}.json`, "application/json");
  };

  const exportToPDF = () => {
    window.print();
  };

  const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateReport = async () => {
    if (campaigns.length === 0) return;
    setIsGenerating(true);
    const name = `Laporan Performa - ${new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`;
    await createReport(name, "CSV", campaigns);
    const newReports = await getReports();
    setReports(newReports);
    setIsGenerating(false);
  };

  const handleDownloadReport = (report: any) => {
    try {
      const data = JSON.parse(report.data);
      if (report.type === "CSV") {
        const headers = ["ID", "Name", "Channel", "Budget", "Conversions", "Revenue", "Status"];
        const csv = [headers.join(","), ...data.map((c: any) => [c.id, c.name, c.channel, c.budget, c.conversions, c.revenue, c.status].join(","))].join("\n");
        downloadFile(csv, `${report.name}.csv`, "text/csv");
      } else {
        downloadFile(JSON.stringify(data, null, 2), `${report.name}.json`, "application/json");
      }
    } catch (e) {
      console.error("Error downloading report:", e);
    }
  };
  return (
    <div className="space-y-4 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-tight">
            Pusat <span className="text-gradient">Laporan</span> 📄
          </h1>
          <p className="text-sm text-slate-500 font-medium tracking-tight">Buat, unduh, dan kelola laporan performa pemasaran Anda.</p>
        </div>
        <button 
          onClick={handleCreateReport}
          disabled={isGenerating || campaigns.length === 0}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg font-black shadow-lg shadow-slate-200/50 hover:bg-black transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-widest"
        >
          <Plus className={cn("h-5 w-5", isGenerating && "animate-spin")} />
          {isGenerating ? "Sedang Membuat..." : "Buat Laporan Baru"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quick Actions Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass rounded-xl p-4 border-white/40 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Ekspor Cepat</h3>
            <div className="space-y-2">
              <button 
                onClick={exportToPDF}
                className="w-full flex items-center justify-between p-2.5 rounded-lg glass border-white/20 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-white/60 rounded-md shadow-sm">
                    <FileText className="h-3.5 w-3.5 text-rose-500" />
                  </div>
                  <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">PDF</span>
                </div>
                <Download className="h-3.5 w-3.5 text-slate-300 group-hover:text-blue-500" />
              </button>

              <button 
                onClick={exportToCSV}
                className="w-full flex items-center justify-between p-2.5 rounded-lg glass border-white/20 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-white/60 rounded-md shadow-sm">
                    <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />
                  </div>
                  <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">CSV</span>
                </div>
                <Download className="h-3.5 w-3.5 text-slate-300 group-hover:text-blue-500" />
              </button>
              <button 
                onClick={exportToJSON}
                className="w-full flex items-center justify-between p-2.5 rounded-lg glass border-white/20 hover:border-amber-300 hover:bg-amber-50/50 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-white/60 rounded-md shadow-sm">
                    <FileJson className="h-3.5 w-3.5 text-amber-500" />
                  </div>
                  <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">JSON</span>
                </div>
                <Download className="h-3.5 w-3.5 text-slate-300 group-hover:text-blue-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Report History Table */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass rounded-xl border-white/40 overflow-hidden relative shadow-lg shadow-slate-200/30">
            <div className="p-4 border-b border-slate-100/30 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/20 backdrop-blur-md">
              <h3 className="text-base font-black text-slate-900 tracking-tight">Riwayat Laporan</h3>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input 
                  placeholder="Cari laporan..."
                  className="w-full pl-9 pr-4 py-1.5 glass border-white/40 rounded-lg text-[11px] focus:ring-2 focus:ring-violet-500 transition-all font-medium text-slate-900"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Nama Laporan</th>
                    <th className="px-6 py-4">Tanggal Dibuat</th>
                    <th className="px-6 py-4">Ukuran/Tipe</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reports.map((report: any) => (
                    <tr key={report.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-50 group-hover:bg-white rounded-lg transition-colors">
                            <FileText className={cn(
                              "h-5 w-5",
                              report.type === "PDF" ? "text-rose-500" : "text-emerald-500"
                            )} />
                          </div>
                          <span className="font-bold text-slate-700">{report.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-500">{new Date(report.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700">{report.type}</span>
                          <span className="text-[10px] text-slate-400">{report.size}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.15em] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/50">
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          Siap
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleDownloadReport(report)}
                            className="p-2 hover:bg-white border hover:border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 transition-all"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={async () => {
                              await deleteReport(report.id);
                              const newReports = await getReports();
                              setReports(newReports);
                            }}
                            className="p-2 hover:bg-white border hover:border-slate-200 rounded-lg text-slate-400 hover:text-rose-600 transition-all"
                          >
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-slate-100/30 flex justify-center bg-white/10">
              <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">Lihat Semua Riwayat</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
