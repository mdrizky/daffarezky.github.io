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

function resolveAbsoluteUrl(
  pathOrUrl?: string | null, 
  fallback = "/logo.png", 
  siteUrl = "https://portofolio-daffarezky.vercel.app"
): string {
  if (!pathOrUrl || !pathOrUrl.trim()) {
    return `${siteUrl}${fallback.startsWith('/') ? fallback : `/${fallback}`}`;
  }
  const clean = pathOrUrl.trim();
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }
  return `${siteUrl}${clean.startsWith('/') ? clean : `/${clean}`}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  
  // Ambil data Profile dari Supabase
  const { data: profile } = await supabase
    .from('profile')
    .select('*')
    .limit(1)
    .maybeSingle();

  const siteTitle = "Muhammad Daffa Rezky Adyra | Developer & Technology Enthusiast";
  const siteDesc = profile?.bio_id || "Web & Mobile Developer yang berfokus pada pengembangan teknologi, inovasi digital, dan solusi yang memberikan dampak positif bagi masyarakat.";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portofolio-daffarezky.vercel.app";

  // LOGO DARI DATABASE SUPABASE (profile.logo_url) — Tampil sebagai Favicon / Icon di Google Search
  const siteLogo = resolveAbsoluteUrl(profile?.logo_url, "/logo.png", siteUrl);

  // FOTO WAJAH DARI DATABASE SUPABASE (profile.photo_url) — Tampil sebagai Thumbnail di samping hasil pencarian Google
  const sitePhoto = resolveAbsoluteUrl(profile?.photo_url || profile?.about_photo_url, "/logo.png", siteUrl);

  return {
    title: {
      default: siteTitle,
      template: `%s | ${profile?.name || 'Muhammad Daffa Rezky Adyra'}`,
    },
    description: siteDesc,
    metadataBase: new URL(siteUrl),
    keywords: [
      "Muhammad Daffa Rezky Adyra", 
      "Muhammad Daffa Rezky",
      "Daffa Rezky", 
      "Daffa Rizky", 
      "Developer", 
      "Technology Enthusiast", 
      "Web Developer", 
      "Mobile Developer", 
      "Next.js", 
      "Indonesia",
      "Portofolio Daffa Rezky"
    ],
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
    manifest: "/manifest.webmanifest",
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
      siteName: profile?.name || "Muhammad Daffa Rezky Adyra",
      images: [
        {
          url: sitePhoto,
          width: 1200,
          height: 630,
          alt: profile?.name || "Muhammad Daffa Rezky Adyra",
        },
      ],
      locale: "id_ID",
      type: "profile",
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
        { url: siteLogo, type: "image/png" },
        { url: siteLogo, sizes: "32x32", type: "image/png" },
        { url: siteLogo, sizes: "48x48", type: "image/png" },
        { url: siteLogo, sizes: "96x96", type: "image/png" },
        { url: siteLogo, sizes: "192x192", type: "image/png" },
        { url: "/favicon.ico" },
      ],
      shortcut: [{ url: siteLogo }],
      apple: [
        { url: siteLogo, sizes: "180x180", type: "image/png" },
      ],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profile')
    .select('*')
    .limit(1)
    .maybeSingle();

  const siteTitle = "Muhammad Daffa Rezky Adyra | Developer & Technology Enthusiast";
  const siteDesc = profile?.bio_id || "Web & Mobile Developer yang berfokus pada pengembangan teknologi, inovasi digital, dan solusi yang memberikan dampak positif bagi masyarakat.";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portofolio-daffarezky.vercel.app";

  // LOGO DARI DATABASE SUPABASE (profile.logo_url) — Tampil sebagai Favicon / Logo di Google Search
  const siteLogo = resolveAbsoluteUrl(profile?.logo_url, "/logo.png", siteUrl);

  // FOTO WAJAH DARI DATABASE SUPABASE (profile.photo_url) — Tampil sebagai Thumbnail Foto di samping hasil pencarian Google
  const sitePhoto = resolveAbsoluteUrl(profile?.photo_url || profile?.about_photo_url, "/logo.png", siteUrl);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${siteUrl}/#profilepage`,
        "url": siteUrl,
        "name": siteTitle,
        "description": siteDesc,
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "@id": `${siteUrl}/#primaryimage`,
          "url": sitePhoto,
          "contentUrl": sitePhoto,
          "caption": profile?.name || "Muhammad Daffa Rezky Adyra"
        },
        "thumbnailUrl": sitePhoto,
        "mainEntity": {
          "@type": "Person",
          "@id": `${siteUrl}/#person`,
          "name": profile?.name || "Muhammad Daffa Rezky Adyra",
          "alternateName": ["Daffa Rezky", "Daffa Rizky", "Muhammad Daffa Rezky"],
          "url": siteUrl,
          "image": {
            "@type": "ImageObject",
            "url": sitePhoto,
            "contentUrl": sitePhoto,
            "caption": profile?.name || "Muhammad Daffa Rezky Adyra"
          },
          "jobTitle": "Web & Mobile Developer",
          "description": siteDesc,
          "sameAs": [
            profile?.github || "https://github.com/daffarezky",
            profile?.linkedin || "https://linkedin.com/in/daffarezky",
            profile?.instagram || "https://instagram.com/daffarezky",
            profile?.youtube,
            profile?.tiktok
          ].filter(Boolean)
        }
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": profile?.name || "Muhammad Daffa Rezky Adyra",
        "publisher": {
          "@id": `${siteUrl}/#person`
        },
        "image": sitePhoto,
        "thumbnailUrl": sitePhoto
      }
    ]
  };

  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Favicon & Icons: Diambil langsung dari Database Supabase (profile.logo_url) */}
        <link rel="icon" href={siteLogo} />
        <link rel="shortcut icon" href={siteLogo} />
        <link rel="apple-touch-icon" href={siteLogo} />

        {/* Thumbnail Preview: Diambil langsung dari Database Supabase (profile.photo_url) agar muncul di samping kanan hasil pencarian Google */}
        <meta name="thumbnail" content={sitePhoto} />
        <meta name="image" content={sitePhoto} />
        <meta itemProp="image" content={sitePhoto} />
        <link rel="image_src" href={sitePhoto} />

        <link rel="manifest" href="/manifest.webmanifest" />
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
