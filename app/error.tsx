'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0A0A0F]">
      <div className="text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-8 border border-red-500/20">
          ⚠️
        </div>
        <h2 className="text-3xl font-heading font-bold text-white mb-4">Terjadi Kesalahan</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Maaf, sepertinya ada gangguan teknis. Jangan khawatir, Anda bisa mencoba menyegarkan halaman atau kembali ke beranda.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="px-8 py-3 bg-gradient-neon text-[#0A0A0F] font-bold rounded-full hover:scale-105 transition-all"
          >
            Coba Lagi
          </button>
          <Link
            href="/"
            className="px-8 py-3 border border-white/10 text-white font-bold rounded-full hover:bg-white/5 transition-all"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}
