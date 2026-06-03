import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import RootLayoutClient from "@/components/RootLayoutClient";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { createClient } from "@/lib/supabase-server";

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

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  
  // Ambil data Profile
  const { data: profile } = await supabase
    .from('profile')
    .select('*')
    .single();

  // Ambil data Settings (SEO)
  const { data: settings } = await supabase
    .from('settings')
    .select('*')
    .single();

  const siteTitle = settings?.site_title || (profile?.name ? `${profile.name} | Web & Mobile Developer` : "Muhammad Daffa Rizky Adyra | Web & Mobile Developer");
  const siteDesc = settings?.site_description || (profile?.bio_id || "Muhammad Daffa Rizky Adyra, Seorang Web & Mobile Developer muslim...");
  const siteLogo = profile?.logo_url || "/logo.png";
  const siteUrl = "https://portofolio-daffarezky.vercel.app";

  return {
    title: {
      default: siteTitle,
      template: `%s | ${profile?.name || 'Daffa Rizky'}`,
    },
    description: siteDesc,
    metadataBase: new URL(siteUrl),
    keywords: ["Daffa Rizky", "Web Developer", "Mobile Developer", "Next.js", "React Native", "Indonesia", "Muslim Developer"],
    authors: [{ name: profile?.name || "Daffa Rizky", url: siteUrl }],
    creator: profile?.name || "Daffa Rizky",
    publisher: profile?.name || "Daffa Rizky",
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
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: siteTitle,
    },
    formatDetection: {
      telephone: false,
    },
    openGraph: {
      title: siteTitle,
      description: siteDesc,
      url: siteUrl,
      siteName: siteTitle,
      images: [
        {
          url: siteLogo,
          width: 1200,
          height: 630,
          alt: siteTitle,
        },
      ],
      locale: "id_ID",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: siteDesc,
      images: [siteLogo],
      creator: "@daffarizky",
    },
    icons: {
      icon: [
        { url: "/logo.png" },
        { url: "/favicon.ico" },
        { url: "/logo.png", sizes: "16x16", type: "image/png" },
        { url: "/logo.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [{ url: "/logo.png" }],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: settings } = await supabase.from('settings').select('*').limit(1).single();

  const siteTitle = settings?.site_title || "Daffa Rizky";
  const siteDesc = settings?.site_description || "Freelance Developer Indonesia - Spesialis Next.js, React, TypeScript, dan Mobile Development.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Daffa Rizky",
    url: siteUrl,
    image: `${siteUrl}/og-image.jpg`,
    jobTitle: "Freelance Web & Mobile Developer",
    description: siteDesc,
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
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#00FF88" />
      </head>
      <body
        className={`${syne.variable} ${dmSans.variable} font-body antialiased min-h-screen flex flex-col`}
      >
        <ServiceWorkerRegister />
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
