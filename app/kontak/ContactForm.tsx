"use client";

import { useState, FormEvent } from "react";
import { FaPaperPlane, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

type FormState = {
  name: string;
  email: string;
  whatsapp: string;
  subject: string;
  message: string;
  honeypot: string;
};

type ToastState = { type: "success" | "error"; message: string } | null;

const inputClass =
  "w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-[var(--color-neon-blue)]/50 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all text-sm";

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    whatsapp: "",
    subject: "",
    message: "",
    honeypot: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 6000);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      showToast("error", "Nama, email, dan pesan harus diisi!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      showToast("error", "Format email tidak valid!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast("error", data.error || "Gagal mengirim pesan!");
        return;
      }

      showToast(
        "success",
        "Pesan terkirim! Saya akan membalas dalam 2 jam. Terima kasih 🎉"
      );
      setForm({
        name: "",
        email: "",
        whatsapp: "",
        subject: "",
        message: "",
        honeypot: "",
      });
    } catch {
      showToast("error", "Terjadi kesalahan. Coba lagi!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Honeypot — hidden from humans */}
        <input
          type="text"
          name="honeypot"
          value={form.honeypot}
          onChange={handleChange}
          style={{ display: "none" }}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={inputClass}
              required
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              WhatsApp{" "}
              <span className="text-gray-400 font-normal">(opsional)</span>
            </label>
            <input
              type="tel"
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
              placeholder="+62 812 3456 7890"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Subjek
            </label>
            <select
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Pilih subjek...</option>
              <option value="Jasa Pembuatan Website">Jasa Pembuatan Website</option>
              <option value="Jasa Aplikasi Mobile">Jasa Aplikasi Mobile</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Konsultasi Digital">Konsultasi Digital</option>
              <option value="Kolaborasi Project">Kolaborasi Project</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Pesan <span className="text-red-500">*</span>
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Ceritakan tentang project Anda, budget, dan timeline yang diinginkan..."
            rows={5}
            className={`${inputClass} resize-none`}
            required
          />
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {form.message.length}/500 karakter
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#00FF88] to-[#0099FF] text-[#0A0A0F] font-bold rounded-xl shadow-[0_0_20px_rgba(0,153,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,136,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-[#0A0A0F] border-t-transparent rounded-full animate-spin" />
              Mengirim...
            </>
          ) : (
            <>
              <FaPaperPlane />
              Kirim Pesan
            </>
          )}
        </button>

        <p className="text-xs text-center text-gray-400 dark:text-gray-500">
          Pesan akan masuk ke email & dashboard admin saya. Biasanya dibalas dalam 2 jam.
        </p>
      </form>

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border text-sm font-medium animate-in slide-in-from-bottom-4 duration-300 max-w-sm ${
            toast.type === "success"
              ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-500/30 text-green-800 dark:text-green-300"
              : "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-500/30 text-red-800 dark:text-red-300"
          }`}
        >
          {toast.type === "success" ? (
            <FaCheckCircle className="text-green-500 flex-shrink-0 text-lg" />
          ) : (
            <FaExclamationCircle className="text-red-500 flex-shrink-0 text-lg" />
          )}
          {toast.message}
        </div>
      )}
    </>
  );
}
