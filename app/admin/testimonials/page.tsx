"use client";

import { useEffect, useState } from "react";
import { db, supabase } from "@/lib/database";
import Image from "next/image";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaStar,
  FaImage,
  FaCheckCircle,
} from "react-icons/fa";
import type { Testimonial } from "@/types";

type FormData = {
  name: string;
  role: string;
  content_id: string;
  content_en: string;
  avatar_url: string;
};

const emptyForm: FormData = {
  name: "",
  role: "",
  content_id: "",
  content_en: "",
  avatar_url: "",
};

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [toast, setToast] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await db.testimonials.getAll();
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };
 

  const openNew = () => {
    setEditingId("new");
    setForm(emptyForm);
  };

  const openEdit = (item: Testimonial) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      role: item.role,
      content_id: item.content_id,
      content_en: item.content_en,
      avatar_url: item.avatar_url || "",
    });
  };

  const closeModal = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `testimonials/avatar-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("portfolio-images")
        .upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage
        .from("portfolio-images")
        .getPublicUrl(path);
      setForm((prev) => ({ ...prev, avatar_url: data.publicUrl }));
    } catch (err) {
      console.error(err);
      alert("Gagal upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.content_id.trim()) {
      alert("Nama dan konten (ID) harus diisi!");
      return;
    }
    setSaving(true);
    try {
      if (editingId === "new") {
        const { error } = await supabase.from("testimonials").insert([
          {
            name: form.name.trim(),
            role: form.role.trim(),
            content_id: form.content_id.trim(),
            content_en: form.content_en.trim() || form.content_id.trim(),
            avatar_url: form.avatar_url || null,
          },
        ]);
        if (error) throw error;
        showToast("Testimoni berhasil ditambahkan!");
      } else {
        const { error } = await supabase
          .from("testimonials")
          .update({
            name: form.name.trim(),
            role: form.role.trim(),
            content_id: form.content_id.trim(),
            content_en: form.content_en.trim() || form.content_id.trim(),
            avatar_url: form.avatar_url || null,
          })
          .eq("id", editingId!);
        if (error) throw error;
        showToast("Testimoni berhasil diperbarui!");
      }
      closeModal();
      fetchItems();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan testimoni");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus testimoni ini?")) return;
    const { error } = await db.testimonials.delete(id);
    if (!error) {
      showToast("Testimoni dihapus.");
      fetchItems();
    }
  };

  const inputClass =
    "w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white text-sm transition-all";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-syne text-gray-900 dark:text-white">
            Testimoni
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Kelola ulasan dan testimoni dari klien.
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20"
        >
          <FaPlus size={14} />
          Tambah
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 rounded-2xl bg-gray-100 dark:bg-white/5 animate-pulse"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl">
          <FaStar className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            Belum ada testimoni. Tambahkan yang pertama!
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar key={i} className="text-amber-400 text-xs" />
                ))}
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 italic line-clamp-3 flex-grow">
                "{item.content_id}"
              </p>

              <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-white/10">
                {item.avatar_url ? (
                  <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={item.avatar_url}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="36px"
                    />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00FF88] to-[#0099FF] flex items-center justify-center text-[#0A0A0F] font-bold text-xs flex-shrink-0">
                    {item.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-[var(--color-neon-green)] truncate">
                    {item.role}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEdit(item)}
                    className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 flex items-center justify-center transition-colors"
                  >
                    <FaEdit size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 flex items-center justify-center transition-colors"
                  >
                    <FaTrash size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0D0D14] border border-gray-200 dark:border-white/10 rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingId === "new" ? "Tambah Testimoni" : "Edit Testimoni"}
              </h2>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
              >
                <FaTimes size={14} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Avatar */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Foto Avatar
                </label>
                <div className="flex items-center gap-4">
                  {form.avatar_url ? (
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[var(--color-neon-green)]/30 flex-shrink-0">
                      <Image
                        src={form.avatar_url}
                        alt="Avatar"
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00FF88] to-[#0099FF] flex items-center justify-center text-[#0A0A0F] font-bold flex-shrink-0">
                      <FaImage />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <label
                      htmlFor="avatar-upload"
                      className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                    >
                      {uploadingAvatar ? (
                        <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FaImage size={12} />
                      )}
                      Upload Foto
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                        disabled={uploadingAvatar}
                      />
                    </label>
                    <input
                      type="url"
                      value={form.avatar_url}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, avatar_url: e.target.value }))
                      }
                      placeholder="Atau paste URL foto"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Nama *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="Nama klien"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Jabatan / Role
                  </label>
                  <input
                    type="text"
                    value={form.role}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, role: e.target.value }))
                    }
                    placeholder="Business Owner"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Konten Testimoni (Indonesia) *
                </label>
                <textarea
                  value={form.content_id}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, content_id: e.target.value }))
                  }
                  placeholder="Tulis testimoni dalam Bahasa Indonesia..."
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Konten Testimoni (English){" "}
                  <span className="text-gray-400 font-normal">
                    — opsional, jika kosong pakai versi ID
                  </span>
                </label>
                <textarea
                  value={form.content_en}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, content_en: e.target.value }))
                  }
                  placeholder="Write testimonial in English..."
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-white/10">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-white/20 transition-colors text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 text-sm"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FaSave size={13} />
                )}
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-500/30 text-green-800 dark:text-green-300 rounded-2xl shadow-lg text-sm font-medium animate-in slide-in-from-bottom-4 duration-300">
          <FaCheckCircle className="text-green-500" />
          {toast}
        </div>
      )}
    </div>
  );
}
