import type { Config } from "tailwindcss";

// Catatan: Project ini menggunakan Tailwind CSS v4.
// Konfigurasi utama ada di app/globals.css menggunakan @theme directive.
// File ini hanya untuk kompatibilitas dengan tools yang memerlukannya.
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
