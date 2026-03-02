import Link from "next/link";

export const dynamic = "force-dynamic";


export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <h2 className="text-4xl font-bold text-slate-900">404 - Halaman Tidak Ditemukan</h2>
      <p className="text-slate-500">Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.</p>
      <Link 
        href="/"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Kembali ke Dashboard
      </Link>
    </div>
  );
}
