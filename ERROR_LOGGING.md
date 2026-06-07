# Error Logging Setup

Saya telah menyiapkan skeleton untuk monitoring error menggunakan **Sentry**.

## Cara Mengaktifkan:

1.  Daftar di [sentry.io](https://sentry.io) dan buat project baru.
2.  Instal library Sentry:
    ```bash
    npm install @sentry/nextjs
    ```
3.  Jalankan wizard Sentry untuk konfigurasi otomatis:
    ```bash
    npx @sentry/wizard@latest -i nextjs
    ```
4.  Tambahkan `NEXT_PUBLIC_SENTRY_DSN` ke file `.env.local` Anda.
5.  Uncomment kode di `sentry.client.config.ts`.

Dengan Sentry, Anda bisa memantau error yang dialami pengunjung secara real-time dari dashboard Sentry.
