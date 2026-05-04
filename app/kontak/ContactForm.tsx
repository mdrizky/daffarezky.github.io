"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Client-side supabase for form submission (using anon key)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const { error } = await supabase
        .from("messages")
        .insert([{ 
          name: formData.name, 
          email: formData.email, 
          message: formData.message 
        }]);

      if (error) throw error;

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.message || "Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm text-gray-400 font-medium">Nama Lengkap</label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-neon-blue)] transition-colors"
            placeholder="John Doe"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm text-gray-400 font-medium">Email</label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-neon-blue)] transition-colors"
            placeholder="john@example.com"
          />
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm text-gray-400 font-medium">Pesan</label>
        <textarea
          id="message"
          required
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-neon-blue)] transition-colors resize-none"
          placeholder="Ceritakan tentang project Anda..."
        ></textarea>
      </div>

      {status === "success" && (
        <div className="bg-[var(--color-neon-green)]/20 text-[var(--color-neon-green)] p-4 rounded-xl border border-[var(--color-neon-green)]/30 text-sm">
          Pesan berhasil dikirim! Saya akan membalas secepatnya.
        </div>
      )}

      {status === "error" && (
        <div className="bg-red-500/20 text-red-400 p-4 rounded-xl border border-red-500/30 text-sm">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-gradient-neon text-[#0A0A0F] py-4 rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,153,255,0.3)] mt-2"
      >
        {status === "loading" ? "Mengirim..." : "Kirim Pesan"}
      </button>
    </form>
  );
}
