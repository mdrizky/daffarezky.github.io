'use client'

import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { FaPaperPlane, FaEnvelope } from "react-icons/fa";

export default function NewsletterForm() {
  const { language } = useLanguage();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const t = {
    title: language === 'id' ? 'Langganan Newsletter' : 'Subscribe to Newsletter',
    description: language === 'id' 
      ? 'Dapatkan update artikel dan proyek terbaru langsung di email Anda.' 
      : 'Get the latest articles and projects updates directly in your inbox.',
    placeholder: language === 'id' ? 'Email Anda' : 'Your Email',
    button: language === 'id' ? 'Daftar' : 'Subscribe',
    loading: language === 'id' ? 'Memproses...' : 'Processing...',
    success: language === 'id' ? 'Terima kasih telah berlangganan!' : 'Thank you for subscribing!',
    error: language === 'id' ? 'Gagal berlangganan. Coba lagi.' : 'Failed to subscribe. Try again.',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus('success');
        setEmail("");
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
          <FaEnvelope />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t.title}</h3>
      </div>
      <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
        {t.description}
      </p>

      {status === 'success' ? (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-600 dark:text-green-400 text-sm font-medium">
          {t.success}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.placeholder}
            required
            className="flex-1 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl py-3 px-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-gradient-neon text-[#0A0A0F] px-6 rounded-xl font-bold text-sm hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
          >
            {status === 'loading' ? t.loading : <><FaPaperPlane /> {t.button}</>}
          </button>
        </form>
      )}
      {status === 'error' && (
        <p className="mt-2 text-xs text-red-500 font-medium">{t.error}</p>
      )}
    </div>
  );
}
