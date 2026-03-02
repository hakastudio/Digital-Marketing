import { getCampaigns, deleteCampaign, createCampaign } from "@/lib/actions";

import { formatCurrency, cn } from "@/lib/utils";
import { 
  Plus, 
  Trash2, 
  Rocket, 
  MoreVertical, 
  ExternalLink,
  Instagram,
  Facebook,
  Twitter,
  Globe,
  Link as LinkIcon
} from "lucide-react";
import CampaignForm from "@/components/campaigns/campaign-form";

function getPlatformIcon(url: string | null) {
  if (!url) return <Globe className="h-4 w-4 text-slate-400" />;
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes("instagram.com")) return <Instagram className="h-4 w-4 text-pink-500" />;
  if (lowerUrl.includes("facebook.com")) return <Facebook className="h-4 w-4 text-blue-600" />;
  if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com")) return <Twitter className="h-4 w-4 text-slate-900" />;
  return <LinkIcon className="h-4 w-4 text-blue-500" />;
}

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();

  return (
    <div className="space-y-4 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Manajer <span className="text-gradient">Kampanye</span> 🚀
          </h1>
          <p className="text-sm text-slate-500 font-medium tracking-tight">Buat, edit, dan pantau kampanye pemasaran secara individual.</p>
        </div>
        <div className="flex items-center gap-4">
           <CampaignForm />
        </div>
      </div>

      {campaigns.length === 0 ? (
        <div className="glass rounded-xl p-8 border-white/40 flex flex-col items-center justify-center text-center shadow-lg shadow-violet-100/30">
          <div className="h-16 w-16 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            <Plus className="h-8 w-8 text-violet-600" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-1">Belum ada kampanye aktif</h3>
          <p className="text-sm text-slate-500 font-medium max-w-sm">
            Mulai dengan membuat kampanye pertama Anda untuk melacak performa di saluran pilihan.
          </p>
        </div>
      ) : (
        <div className="glass rounded-xl border-white/40 overflow-hidden relative shadow-lg shadow-slate-200/30">
           <div className="p-6 border-b border-slate-100/30 bg-white/20 backdrop-blur-md">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-slate-900 rounded-lg shadow-md"><Rocket className="h-4 w-4 text-white" /></div>
                 <div>
                    <h3 className="text-lg font-black text-slate-900">Daftar Kampanye</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{campaigns.length} Entri Ditemukan</p>
                 </div>
              </div>
           </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[9px] uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4 font-black text-center w-12">#</th>
                  <th className="px-6 py-4 font-black text-center w-12">Status</th>
                  <th className="px-6 py-4 font-black">Detail Kampanye</th>
                  <th className="px-6 py-4 font-black">Saluran</th>
                  <th className="px-6 py-4 font-black">Anggaran</th>
                  <th className="px-6 py-4 font-black">Performa</th>
                  <th className="px-6 py-4 font-black text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/30">
                {campaigns.map((campaign: any, idx: number) => (
                  <tr key={campaign.id} className="hover:bg-violet-50/40 transition-all group cursor-default">
                    <td className="px-6 py-4 text-slate-400 font-bold text-center text-xs">{idx + 1}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="flex items-center justify-center relative">
                        <span className={cn(
                          "h-2 w-2 rounded-full shadow-sm",
                          campaign.status === "active" ? "bg-emerald-500 shadow-emerald-500/40" : "bg-slate-300"
                        )}></span>
                        {campaign.status === "active" && (
                          <span className="absolute h-3.5 w-3.5 rounded-full bg-emerald-500/20 animate-ping"></span>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-100 group-hover:scale-105 transition-transform duration-300">
                          {getPlatformIcon(campaign.socialLink)}
                        </div>
                        <div>
                          <div className="text-sm font-black text-slate-900 flex items-center gap-1.5 group-hover:text-violet-600 transition-colors">
                            {campaign.name}
                            {campaign.socialLink && (
                              <a 
                                href={campaign.socialLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-violet-400 hover:text-violet-600 transition-colors"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">ID: {campaign.id.slice(0, 8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-violet-50 text-violet-600 border border-violet-100 shadow-sm">
                        {campaign.channel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-slate-700">
                      {formatCurrency(campaign.budget)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest mb-0.5">Klik</p>
                          <p className="text-sm font-black text-slate-900">{campaign.clicks}</p>
                        </div>
                        <div>
                          <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest mb-0.5">Konv.</p>
                          <p className="text-sm font-black text-slate-900">{campaign.conversions}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                        <form action={async () => {
                          "use server";
                          const newStatus = campaign.status === "active" ? "paused" : "active";
                          await import("@/lib/actions").then(a => a.updateCampaignStatus(campaign.id, newStatus));
                        }}>
                          <button className={cn(
                            "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                            campaign.status === "active" ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          )}>
                            {campaign.status === "active" ? "Jeda" : "Aktifkan"}
                          </button>
                        </form>
                        <form action={async () => {
                          "use server";
                          await import("@/lib/actions").then(a => a.deleteCampaign(campaign.id));
                        }}>
                          <button className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
