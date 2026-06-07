'use client'

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/LanguageProvider";
import { FaPaperPlane, FaUser, FaClock } from "react-icons/fa";
import type { GuestbookEntry } from "@/types";

export default function GuestbookClient() {
  const { language } = useLanguage();
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const t = {
    title: language === 'id' ? 'Buku Tamu' : 'Guestbook',
    subtitle: language === 'id' ? 'Tinggalkan pesan atau sekadar menyapa!' : 'Leave a message or just say hi!',
    namePlaceholder: language === 'id' ? 'Nama Anda' : 'Your Name',
    messagePlaceholder: language === 'id' ? 'Pesan Anda...' : 'Your Message...',
    send: language === 'id' ? 'Kirim Pesan' : 'Send Message',
    sending: language === 'id' ? 'Mengirim...' : 'Sending...',
    success: language === 'id' ? 'Pesan terkirim! Akan muncul setelah disetujui admin.' : 'Message sent! It will appear after admin approval.',
    error: language === 'id' ? 'Gagal mengirim pesan.' : 'Failed to send message.',
    noEntries: language === 'id' ? 'Belum ada pesan. Jadi yang pertama!' : 'No messages yet. Be the first!',
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const { data } = await supabase
      .from("guestbook")
      .select("*")
      .eq("is_approved", true)
      .order("created_at", { ascending: false });
    
    if (data) setEntries(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;

    setSubmitting(true);
    const { error } = await supabase
      .from("guestbook")
      .insert([{ name, message, is_approved: false }]);

    if (error) {
      alert(t.error);
    } else {
      alert(t.success);
      setName("");
      setMessage("");
    }
    setSubmitting(false);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 text-gray-900 dark:text-white">
            {t.title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {t.subtitle}
          </p>
        </div>

        {/* Form Section */}
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-8 mb-16 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                {t.namePlaceholder}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.namePlaceholder}
                required
                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                {t.messagePlaceholder}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.messagePlaceholder}
                required
                rows={4}
                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-neon text-[#0A0A0F] py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:scale-100"
            >
              {submitting ? t.sending : <><FaPaperPlane /> {t.send}</>}
            </button>
          </form>
        </div>

        {/* Entries Section */}
        <div className="space-y-8">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              {t.noEntries}
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 transition-colors hover:border-blue-500/30"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <FaUser />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{entry.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <FaClock />
                        {new Date(entry.created_at).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed italic">
                  "{entry.message}"
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
