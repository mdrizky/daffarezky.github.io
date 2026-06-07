import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import RootLayoutClient from "@/components/RootLayoutClient";
import Gamification from "@/components/Gamification";
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

  // Paksa identitas baru untuk menghindari data lama dari database
  const siteTitle = "Muhammad Daffa Rezky Adyra | Developer & Technology Enthusiast";
  const siteDesc = "Butuh web yang cepat, responsif, dan siap pakai? Saya di sini untuk membantu Anda mengubah ide bisnis menjadi aplikasi web modern yang fungsional. Mari berkolaborasi untuk membangun solusi digital terbaik bagi bisnis Anda. Jelajahi proyek saya di bawah ini dan hubungi saya untuk mulai berdiskusi!";
  const sitePhoto = profile?.photo_url || "/logo.png"; 
  const siteUrl = "https://portofolio-daffarezky.vercel.app";

  return {
    title: {
      default: siteTitle,
      template: `%s | ${profile?.name || 'Daffa Rezky'}`,
    },
    description: siteDesc,
    metadataBase: new URL(siteUrl),
    keywords: ["Muhammad Daffa Rezky Adyra", "Daffa Rizky", "Developer", "Technology Enthusiast", "Web Developer", "Mobile Developer", "Next.js", "Indonesia"],
    authors: [{ name: profile?.name || "Muhammad Daffa Rezky Adyra", url: siteUrl }],
    creator: profile?.name || "Muhammad Daffa Rezky Adyra",
    publisher: profile?.name || "Muhammad Daffa Rezky Adyra",
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
    verification: {
      google: "googlead59726551d000c1",
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
          url: sitePhoto,
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
      images: [sitePhoto],
      creator: "@daffarizky",
    },
    icons: {
      icon: [
        { url: sitePhoto },
        { url: "/favicon.ico" },
        { url: sitePhoto, sizes: "16x16", type: "image/png" },
        { url: sitePhoto, sizes: "32x32", type: "image/png" },
      ],
      apple: [{ url: sitePhoto }],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: profile } = await supabase.from('profile').select('photo_url').limit(1).single();

  const siteTitle = "Muhammad Daffa Rezky Adyra | Developer & Technology Enthusiast";
  const siteDesc = "Butuh web yang cepat, responsif, dan siap pakai? Saya di sini untuk membantu Anda mengubah ide bisnis menjadi aplikasi web modern yang fungsional. Mari berkolaborasi untuk membangun solusi digital terbaik bagi bisnis Anda. Jelajahi proyek saya di bawah ini dan hubungi saya untuk mulai berdiskusi!";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portofolio-daffarezky.vercel.app";
  const sitePhoto = profile?.photo_url || "/logo.png";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Muhammad Daffa Rezky Adyra",
    url: siteUrl,
    image: sitePhoto,
    jobTitle: "Developer & Technology Enthusiast",
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
      "IoT",
      "Networking",
      "Cyber Security"
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
        <link rel="apple-touch-icon" href={sitePhoto} />
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
