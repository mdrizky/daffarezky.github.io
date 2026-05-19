# Portfolio Next.js

Portfolio website built with Next.js App Router, TypeScript, Tailwind CSS, and Supabase.

## Fitur Utama

- Halaman beranda portfolio lengkap
- Halaman `Tentang` dengan profil, pendidikan, learning journey, dan sertifikat
- Halaman `Portfolio` dengan filter kategori dan case study modal
- Halaman `Blog` dengan tipografi yang ditingkatkan, TOC, progress bar, dan syntax highlight
- Form kontak dengan validasi, honeypot, rate limit, penyimpanan Supabase, dan notifikasi email (Resend)
- Admin panel lengkap untuk mengelola project, blog, sertifikat, pendidikan, skills, jasa, testimonial, dan pesan
- Proteksi admin dengan login Supabase dan middleware
- Halaman tambahan khusus `Certificates`

## Struktur Halaman

- `/` — Beranda
- `/tentang` — Tentang / About
- `/portfolio` — Project portfolio
- `/blog` — Daftar artikel blog
- `/blog/[slug]` — Detail artikel
- `/kontak` — Form kontak
- `/certificates` — Halaman sertifikat khusus
- `/admin` — Dashboard admin (login Supabase diperlukan)

## Setup Lokal

1. Install dependensi:

```bash
npm install
```

2. Buat file `.env.local` dengan variabel berikut:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_SERVICE_KEY=your-service-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=your-resend-api-key
ADMIN_EMAIL=your-admin-email@example.com
```

> `RESEND_API_KEY` dan `ADMIN_EMAIL` bersifat opsional. Form kontak tetap akan menyimpan pesan ke Supabase tanpa email.

3. Jalankan server:

```bash
npm run dev
```

4. Buka `http://localhost:3000`.

## Admin Panel

- Login: `/admin/login`
- Setelah login, admin akan diarahkan ke dashboard admin.
- Admin panel memuat:
  - Statistik data
  - Kelola `Portfolio`, `Blog`, `Sertifikat`, `Education`, `Skills`, `Services`, `Testimonials`, `Learning Journey`, dan `Messages`
  - Logout dari menu sidebar
- Proteksi tambahan: `middleware.ts` melindungi semua route `/admin` dan `/api/admin`.

## Sertifikat

- Halaman khusus sertifikat tersedia di `/certificates`.
- Jika belum ada hosting untuk project demo, gunakan `demo_url` sebagai link video YouTube/Vimeo.
- Admin panel sertifikat menangani upload file gambar/PDF dan tautan file langsung.

## Upload Data dan Demo Project

- Di admin project, gunakan bidang `Demo / Video URL` untuk memasukkan:
  - live demo website (hosting siap) atau
  - video demo YouTube/Vimeo ketika hosting belum tersedia
- Jika project belum dapat di-demosntrasi secara live, video demo adalah cara yang baik untuk menampilkan hasil kerja.

## Deploy

Saran deploy:

- Gunakan [Vercel](https://vercel.com) untuk hosting Next.js.
- Gunakan [Supabase](https://supabase.com) untuk database dan storage.
- Pastikan environment variable sudah terpasang di Vercel.
- Jalankan build:

```bash
npm run build
```

## Catatan Tambahan

- `app/certificates/page.tsx` menampilkan semua sertifikat dari tabel Supabase `certificates`.
- `app/tentang/page.tsx` juga menampilkan sertifikat dan informasi pendidikan.
- Halaman admin sudah mendukung manajemen sertifikat.

## Teknologi

- Next.js 16.2
- React 19
- TypeScript
- Tailwind CSS v4
- Supabase
- Resend (opsional) untuk email
