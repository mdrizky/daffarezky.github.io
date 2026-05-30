import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWA from "@/components/FloatingWA";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import RootLayoutClient from "@/components/RootLayoutClient";

const syne = Syne({ 
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"]
});

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "700"]
});

// Google Search Console verification
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portofolio-daffarezky.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Daffa Rizky | Freelance Web & Mobile Developer",
    template: "%s | Daffa Rizky",
  },
  description:
    "Freelance Developer Indonesia - Daffa Rizky. Spesialis Next.js, React, TypeScript, dan Mobile Development. Bantu bangun website modern, aplikasi mobile, dan solusi teknologi kustom untuk bisnis dan startup.",
  verification: {
    google: "uXSaWSLWd1NJfDFox7Y1hYIhEwlhMxQVNuAD2AAJ_qM",
  },
  keywords: [
    "Freelance Developer Indonesia",
    "Web Developer Freelance",
    "Mobile Developer Freelance",
    "Next.js Developer",
    "React Developer",
    "TypeScript Developer",
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "Jasa Pembuatan Website",
    "Jasa Aplikasi Mobile",
    "Jasa Development",
    "Daffa Rizky",
    "Developer Jakarta",
    "Developer Indonesia",
  ],
  authors: [{ name: "Daffa Rizky", url: siteUrl }],
  creator: "Daffa Rizky",
  publisher: "Daffa Rizky",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Daffa Rizky | Freelance Web & Mobile Developer",
    description:
      "Freelance Developer Indonesia - Spesialis Next.js, React, TypeScript. Bangun website modern, aplikasi mobile, dan solusi teknologi kustom.",
    url: siteUrl,
    siteName: "Daffa Rizky - Freelance Developer",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Daffa Rizky - Freelance Web & Mobile Developer",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daffa Rizky | Freelance Web & Mobile Developer",
    description:
      "Freelance Developer Indonesia - Spesialis Next.js, React, TypeScript.",
    images: ["/og-image.jpg"],
    creator: "@daffarizky",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Daffa Rizky",
    url: siteUrl,
    image: `${siteUrl}/og-image.jpg`,
    jobTitle: "Freelance Web & Mobile Developer",
    description:
      "Freelance Developer Indonesia - Spesialis Next.js, React, TypeScript, dan Mobile Development.",
    sameAs: [
      "https://github.com/daffarizky",
      "https://linkedin.com/in/daffarizky",
      "https://instagram.com/daffarizky",
    ],
    knowsAbout: [
      "Web Development",
      "Mobile Development",
      "Next.js",
      "React",
      "TypeScript",
      "Full Stack Development",
      "Frontend Development",
      "Backend Development",
    ],
  };

  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${syne.variable} ${dmSans.variable} font-body antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <LanguageProvider>
            <RootLayoutClient>
              {children}
            </RootLayoutClient>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
