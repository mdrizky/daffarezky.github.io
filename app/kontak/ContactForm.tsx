"use client";

import { useState, FormEvent } from "react";
import { FaPaperPlane, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { Button } from "@/components/ui/Button";

type FormState = {
  name: string;
  email: string;
  whatsapp: string;
  subject: string;
  service: string;
  budget: string;
  timeline: string;
  message: string;
  honeypot: string;
};

type ToastState = { type: "success" | "error"; message: string } | null;

const inputClass =
  "w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground transition-all text-sm";

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    whatsapp: "",
    subject: "",
    service: "",
    budget: "",
    timeline: "",
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
        "Pesan terkirim! Saya akan membalas secepatnya. Terima kasih 🎉"
      );
      setForm({
        name: "",
        email: "",
        whatsapp: "",
        subject: "",
        service: "",
        budget: "",
        timeline: "",
        message: "",
        honeypot: "",
      });
    } catch {
      showToast("error", "Terjadi kesalahan. Silakan coba lagi!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">
              Nama Lengkap <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">
              Email <span className="text-destructive">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="e.g. john@example.com"
              className={inputClass}
              required
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">
              WhatsApp <span className="text-muted-foreground font-normal lowercase">(opsional)</span>
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
            <label className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">
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
              <option value="Jasa Aplikasi Web / Dashboard">Jasa Aplikasi Web / Dashboard</option>
              <option value="Integrasi AI & Automasi">Integrasi AI & Automasi</option>
              <option value="Konsultasi Teknis">Konsultasi Teknis</option>
              <option value="Peluang Kerja / Kolaborasi">Peluang Kerja / Kolaborasi</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">Layanan</label>
            <select name="service" value={form.service} onChange={handleChange} className={inputClass}>
              <option value="">Pilih layanan</option>
              <option value="Website Development">Website Development</option>
              <option value="Web App & Dashboard">Web App & Dashboard</option>
              <option value="AI Solutions">AI Solutions</option>
              <option value="UI/UX & Branding">UI/UX & Branding</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">Budget</label>
            <select name="budget" value={form.budget} onChange={handleChange} className={inputClass}>
              <option value="">Estimasi</option>
              <option value="< 2jt">&lt; 2jt</option>
              <option value="2-5jt">2–5jt</option>
              <option value="5-15jt">5–15jt</option>
              <option value="> 15jt">&gt; 15jt</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">Timeline</label>
            <select name="timeline" value={form.timeline} onChange={handleChange} className={inputClass}>
              <option value="">Estimasi</option>
              <option value="ASAP">Secepatnya (ASAP)</option>
              <option value="1-4 minggu">1–4 minggu</option>
              <option value="1-3 bulan">1–3 bulan</option>
              <option value="Fleksibel">Fleksibel</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">
            Pesan <span className="text-destructive">*</span>
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Ceritakan detail proyek, target, serta kebutuhan yang Anda inginkan..."
            rows={4}
            className={`${inputClass} resize-none`}
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            {form.message.length}/500 karakter
          </p>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full py-4 text-base font-bold flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Mengirim...
            </>
          ) : (
            <>
              <FaPaperPlane /> Kirim Pesan
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Pesan akan tersimpan di dashboard admin dan dikirim ke email saya secara otomatis.
        </p>
      </form>

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border text-sm font-medium animate-in slide-in-from-bottom-4 duration-300 max-w-sm ${
            toast.type === "success"
              ? "bg-card border-primary text-foreground"
              : "bg-destructive/10 border-destructive text-destructive"
          }`}
        >
          {toast.type === "success" ? (
            <FaCheckCircle className="text-primary flex-shrink-0 text-lg" />
          ) : (
            <FaExclamationCircle className="text-destructive flex-shrink-0 text-lg" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </>
  );
}
