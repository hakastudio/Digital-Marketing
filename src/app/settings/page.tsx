"use client";

import { 
  User, 
  Bell, 
  Shield, 
  Database, 
  Globe, 
  Save, 
  CreditCard,
  Lock,
  Mail,
  Zap,
  Info,
  ExternalLink
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { getUserProfile, updateUserProfile, updateNotifications, deleteUserAccount } from "@/lib/actions";

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState("My Profile");
  const [profile, setProfile] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notifSettings, setNotifSettings] = useState({
    emailWeekly: false,
    budgetAlerts: false,
    monthlyReports: false,
  });
  const [saveNotifMsg, setSaveNotifMsg] = useState("");

  // Load notification settings from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("notif_settings");
      if (saved) setNotifSettings(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      getUserProfile(user.primaryEmailAddress.emailAddress).then((p) => {
        setProfile(p);
        // Merge DB values if profile exists
        if (p) {
          const pAny = p as any;
          setNotifSettings({
            emailWeekly: pAny.emailWeekly ?? false,
            budgetAlerts: pAny.budgetAlerts ?? false,
            monthlyReports: pAny.monthlyReports ?? false,
          });
        }
      });
    }
  }, [user, isLoaded]);

  const tabs = [
    { name: "My Profile", icon: User },
    { name: "Security", icon: Shield },
    { name: "Notifications", icon: Bell },
  ];

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id) return;
    setIsSaving(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get("name") as string,
      companyName: formData.get("companyName") as string,
      region: formData.get("region") as string,
    };

    await updateUserProfile(profile.id, data);
    setIsSaving(false);
    alert("Pengaturan profil berhasil diperbarui!");
  };

  const handleToggleNotif = async (field: string, value: boolean) => {
    const newSettings = { ...notifSettings, [field]: value };
    setNotifSettings(newSettings);

    // Always persist to localStorage immediately
    try {
      localStorage.setItem("notif_settings", JSON.stringify(newSettings));
    } catch {}

    // Also save to DB if profile is available
    if (profile?.id) {
      await updateNotifications(profile.id, { [field]: value });
    }

    setSaveNotifMsg("✓ Tersimpan");
    setTimeout(() => setSaveNotifMsg(""), 2000);
  };

  if (!isLoaded) return <div className="p-8 text-slate-500 font-bold">Memuat...</div>;

  return (
    <div className="space-y-4 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-0.5">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          Pengaturan <span className="text-gradient">Akun</span> ⚙️
        </h1>
        <p className="text-sm text-slate-500 font-medium tracking-tight">Kelola profil, preferensi akun, dan integrasi Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-1">
          {tabs.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all",
                activeTab === item.name 
                  ? "glass bg-white/40 text-blue-600 shadow-sm border-white/60" 
                  : "text-slate-500 hover:bg-white/20 hover:text-slate-900"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === "My Profile" && (
            <form onSubmit={handleUpdateProfile} className="glass rounded-xl p-6 border-white/40 shadow-lg shadow-slate-200/20 space-y-6">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 border-4 border-white overflow-hidden relative shadow-md">
                  {user?.imageUrl ? (
                    <Image src={user.imageUrl} alt="Profile" fill className="object-cover" />
                  ) : (
                    <User className="h-10 w-10" />
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">{profile?.name || user?.fullName || "Pengguna"}</h3>
                  <p className="text-xs text-slate-500 font-medium">{profile?.email || user?.primaryEmailAddress?.emailAddress}</p>
                  <a 
                    href="https://clerk.com/user" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-violet-600 hover:text-violet-700 mt-2 transition-colors"
                  >
                    Atur Profil di Clerk <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100/50">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Nama Lengkap</label>
                  <input
                    name="name"
                    value={profile?.name || ""}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Nama Anda"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all font-medium text-sm text-slate-900"
                  />
                </div>
                <div className="space-y-2 opacity-60">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Alamat Email (Read-only)</label>
                  <input
                    readOnly
                    value={profile?.email || ""}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100/50 rounded-xl cursor-not-allowed font-medium text-sm text-slate-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Nama Perusahaan</label>
                  <input
                    name="companyName"
                    value={profile?.companyName || ""}
                    onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                    placeholder="Nama Perusahaan"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all font-medium text-sm text-slate-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Wilayah</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <select 
                      name="region" 
                      value={profile?.region || "Indonesia (ID)"}
                      onChange={(e) => setProfile({ ...profile, region: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all font-medium text-sm text-slate-900 appearance-none cursor-pointer"
                    >
                      <option>Indonesia (ID)</option>
                      <option>Amerika Serikat (US)</option>
                      <option>Singapura (SG)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100/50 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-xs text-slate-400 max-w-[450px] font-medium leading-relaxed">
                  Catatan: Beberapa pengaturan profil dikelola secara terpusat melalui sistem keamanan Clerk untuk perlindungan akun yang lebih baik.
                </p>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2.5 bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200/50 hover:bg-black hover:scale-105 transition-all active:scale-95 disabled:opacity-50"
                >
                  <Save className={cn("h-4 w-4", isSaving && "animate-spin")} />
                  {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "Security" && (
            <div className="glass rounded-xl p-6 border-white/40 shadow-lg shadow-slate-200/20 space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shadow-sm border-2 border-white">
                  <Lock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Keamanan & Kepercayaan</h3>
                  <p className="text-xs text-slate-500 font-medium">Autentikasi tingkat tinggi dikelola oleh Clerk Security</p>
                </div>
              </div>
              <div className="space-y-3 pt-6 border-t border-slate-100/50">
                <a 
                  href="https://clerk.com/user" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full text-left px-5 py-4 bg-white/60 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-md transition-all flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Ubah Kata Sandi & 2FA</p>
                    <p className="text-[10px] text-slate-500 font-medium">Perbarui kredensial login Anda di server aman</p>
                  </div>
                  <Shield className="h-5 w-5 text-slate-300 group-hover:text-amber-500 transition-colors" />
                </a>
              </div>
            </div>
          )}

          {activeTab === "Notifications" && (
            <div className="glass rounded-xl p-6 border-white/40 shadow-lg shadow-slate-200/20 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border-2 border-white">
                    <Bell className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Pusat Notifikasi</h3>
                    <p className="text-xs text-slate-500 font-medium">Sesuaikan frekuensi laporan dan peringatan dashboard</p>
                  </div>
                </div>
                {saveNotifMsg && (
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 animate-in fade-in duration-300">
                    {saveNotifMsg}
                  </span>
                )}
              </div>
              <div className="space-y-3 pt-6 border-t border-slate-100/50">
                {[
                  { title: "Email Mingguan", desc: "Ringkasan performa kampanye minggu ini", icon: Mail, field: "emailWeekly" },
                  { title: "Peringatan Budget", desc: "Beritahu saya saat budget hampir habis", icon: Zap, field: "budgetAlerts" },
                  { title: "Laporan Bulanan", desc: "Analisis mendalam performa pemasaran bulanan", icon: Info, field: "monthlyReports" },
                ].map((notif) => {
                  const isActive = (notifSettings as any)[notif.field] ?? false;
                  return (
                  <div key={notif.title} className="flex items-center justify-between p-4 bg-white/40 border border-slate-100 rounded-2xl hover:bg-white/60 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={cn("p-2.5 rounded-xl transition-colors", isActive ? "bg-violet-100" : "bg-slate-100/50")}>
                        <notif.icon className={cn("h-4 w-4 transition-colors", isActive ? "text-violet-600" : "text-slate-600")} />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-black text-slate-900 uppercase tracking-widest">{notif.title}</p>
                        <p className="text-xs text-slate-500 font-medium">{notif.desc}</p>
                      </div>
                    </div>
                    <div 
                      onClick={() => handleToggleNotif(notif.field, !isActive)}
                      className={cn(
                        "w-11 h-6 rounded-full relative cursor-pointer transition-all duration-300 shadow-inner",
                        isActive ? "bg-violet-600" : "bg-slate-300"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm",
                        isActive ? "right-1" : "left-1"
                      )} />
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "My Profile" && (
            <div className="bg-rose-50/30 rounded-2xl p-6 border border-rose-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="space-y-1 text-center md:text-left">
                <h4 className="text-[10px] font-black text-rose-900 uppercase tracking-[0.2em]">Zona Bahaya</h4>
                <p className="text-xs text-rose-700 leading-relaxed font-medium">
                  Hapus akun dan semua data secara permanen. Tindakan ini **tidak dapat dibatalkan**.
                </p>
              </div>
              <button 
                onClick={async () => {
                  if (confirm("Apakah Anda yakin ingin menghapus akun? Semua data akan hilang.") && profile?.id) {
                    await deleteUserAccount(profile.id);
                    // Redirect to clerk sign out or delete account flow
                    window.location.href = "/";
                  }
                }}
                className="px-6 py-3 bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-rose-200/30 hover:bg-rose-700 hover:scale-105 transition-all active:scale-95"
              >
                Hapus Selamanya
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
