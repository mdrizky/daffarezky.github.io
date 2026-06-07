import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0A0A0F]">
      <div className="text-center">
        <div className="text-[120px] font-black text-white/5 leading-none mb-4 animate-pulse">
          404
        </div>
        <h2 className="text-3xl font-heading font-bold text-white mb-4 -mt-16">Halaman Tidak Ditemukan</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan. Mari kembali ke jalur yang benar.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-neon text-[#0A0A0F] font-bold rounded-full hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,255,136,0.3)]"
        >
          <span>🏠</span> Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}
