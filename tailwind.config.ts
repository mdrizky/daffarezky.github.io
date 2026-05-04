import type { Config } from "tailwindcss";

// Note: This project uses Tailwind CSS v4, so the primary configuration is in app/globals.css
// using the @theme directive. This file is kept for compatibility with tools that require it.
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
