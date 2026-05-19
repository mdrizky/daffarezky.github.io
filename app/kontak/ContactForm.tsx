"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"

type FormState = {
  name: string
  email: string
  whatsapp: string
  subject: string
  message: string
  honeypot: string
}

export default function ContactForm() {
  const router = useRouter()
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    whatsapp: "",
    subject: "",
    message: "",
    honeypot: "",
  })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null)

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message })
    setTimeout(() => setToast(null), 5000)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // basic validation
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      showToast("error", "Nama, email, dan pesan harus diisi!")
      return
    }

    // email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      showToast("error", "Format email tidak valid!")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        showToast("error", data.error || "Gagal mengirim pesan!")
        return
      }

      showToast("success", "Pesan terkirim! Terima kasih telah menghubungi saya 🎉")
      setForm({
        name: "",
        email: "",
        whatsapp: "",
        subject: "",
        message: "",
        honeypot: "",
      })

      // reload messages on admin page after 1s
      setTimeout(() => router.refresh(), 1000)
    } catch (err) {
      console.error(err)
      showToast("error", "Terjadi kesalahan. Coba lagi!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        {/* honeypot */}
        <input
          type="text"
          name="honeypot"
          value={form.honeypot}
          onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
          style={{ display: "none" }}
          tabIndex={-1}
          autoComplete="off"
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-2">
              Nama Lengkap
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              required
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-2">
              WhatsApp (Opsional)
            </label>
            <input
              type="tel"
              placeholder="+62 812 3456 7890"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-2">
              Subjek
            </label>
            <input
              type="text"
              placeholder="Diskusi Project"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-200 mb-2">
            Pesan
          </label>
          <textarea
            placeholder="Ceritakan tentang project Anda..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={5}
            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition resize-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "Mengirim..." : "Kirim Pesan"}
        </button>
      </form>

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg text-white font-medium animate-fade-in ${
            toast.type === "success"
              ? "bg-emerald-600/90 border border-emerald-500"
              : "bg-red-600/90 border border-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}
    </>
  )
}
