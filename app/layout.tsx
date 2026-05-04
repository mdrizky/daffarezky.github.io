import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWA from "@/components/FloatingWA";

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

export const metadata: Metadata = {
  title: "Daffa Rizky | Digital Business Strategist",
  description: "Portfolio of Daffa Rizky, an aspiring Digital Business Strategist and Freelancer.",
  openGraph: {
    title: "Daffa Rizky | Digital Business Strategist",
    description: "Portfolio of Daffa Rizky, an aspiring Digital Business Strategist and Freelancer.",
    url: "https://daffa-portfolio.vercel.app",
    siteName: "Daffa Rizky",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Daffa Rizky Portfolio",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${syne.variable} ${dmSans.variable} font-body bg-[#0A0A0F] text-white antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <FloatingWA />
      </body>
    </html>
  );
}
