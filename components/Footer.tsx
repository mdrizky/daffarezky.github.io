"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SocialLinks from "./SocialLinks";
import { useLanguage } from "@/components/LanguageProvider";
import { supabase } from "@/lib/supabase";
import SiteLogo from "@/components/SiteLogo";

import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  const { language } = useLanguage();
  const [profile, setProfile] = useState<{
    name?: string;
    motto_id?: string;
    motto_en?: string;
    bio_id?: string;
    bio_en?: string;
    footer_bio_id?: string;
    footer_bio_en?: string;
    work_hours?: string;
  } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profile')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data && !error) {
          setProfile(data);
        } else {
          const fallback = await supabase.from('profile').select('*').limit(1).maybeSingle();
          if (fallback.data) setProfile(fallback.data);
        }
      } catch (err) {
        console.error('Error fetching profile in Footer:', err);
      }
    };
    fetchProfile();
  }, []);

  const quickLinksId = [
    { name: "Beranda", path: "/" },
    { name: "Tentang", path: "/tentang" },
    { name: "Portfolio", path: "/projects" },
    { name: "Skills", path: "/skills" },
    { name: "Blog", path: "/blog" },
    { name: "Buku Tamu", path: "/guestbook" },
    { name: "Setup Saya", path: "/uses" },
  ];

  const quickLinksEn = [
    { name: "Home", path: "/" },
    { name: "About", path: "/tentang" },
    { name: "Portfolio", path: "/projects" },
    { name: "Skills", path: "/skills" },
    { name: "Blog", path: "/blog" },
    { name: "Guestbook", path: "/guestbook" },
    { name: "My Setup", path: "/uses" },
  ];

  const quickLinks = language === 'id' ? quickLinksId : quickLinksEn;

  // Dynamic footer bio text: ONLY use footer_bio_id/en; fallback to local storage or short concise default (NEVER use the long bio_id)
  const localFooterBioId = typeof window !== 'undefined' ? localStorage.getItem('portfolio_footer_bio_id') : null;
  const localFooterBioEn = typeof window !== 'undefined' ? localStorage.getItem('portfolio_footer_bio_en') : null;

  const footerBio = language === 'id'
    ? (profile?.footer_bio_id?.trim() || localFooterBioId?.trim() || 'Web & Mobile Developer yang berfokus pada pengembangan teknologi, inovasi digital, dan solusi yang memberikan dampak positif bagi masyarakat.')
    : (profile?.footer_bio_en?.trim() || localFooterBioEn?.trim() || 'Web & Mobile Developer focused on technology development, digital innovation, and solutions that provide a positive impact on society.');

  // Dynamic motto text: prefer motto_id/en, fallback to default
  const mottoText = language === 'id'
    ? (profile?.motto_id?.trim() || 'Teknologi • Inovasi • Kebermanfaatan')
    : (profile?.motto_en?.trim() || profile?.motto_id?.trim() || 'Technology • Innovation • Benefit');

  return (
    <footer className="border-t border-border bg-card/40 pt-16 pb-8 transition-colors duration-300">
      <div className="container mx-auto px-6 md:px-12">
        {/* Newsletter Section */}
        <div className="mb-16">
          <NewsletterForm />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-6">
            <SiteLogo size={40} textSize="text-xl" />
            <p className="text-muted-foreground max-w-sm leading-relaxed text-sm">
              {footerBio}
            </p>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Motto</span>
              <p className="text-sm font-medium text-primary">
                {mottoText}
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading font-bold text-lg text-foreground">
              {language === 'id' ? 'Tautan Cepat' : 'Quick Links'}
            </h3>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading font-bold text-lg text-foreground">
              {language === 'id' ? 'Hubungi' : 'Connect'}
            </h3>
            <p className="text-muted-foreground mb-2 text-sm">
              {language === 'id'
                ? 'Mari bangun sesuatu yang hebat bersama.'
                : "Let's build something great together."}
            </p>
            <SocialLinks variant="icon-only" />
            {profile?.work_hours && (
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-primary text-base">🕐</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                    {language === 'id' ? 'Jam Kerja' : 'Work Hours'}
                  </span>
                  <span className="font-medium text-foreground/80">{profile.work_hours}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border/60 relative gap-4 text-center md:text-left">
          <p className="text-muted-foreground text-sm">
            © 2026 {profile?.name || 'Muhammad Daffa Rezky Adyra'}. {language === 'id' ? 'Dibangun dengan dedikasi, pembelajaran, dan semangat kebermanfaatan.' : 'Built with dedication, learning, and the spirit of benefit.'}
          </p>
          
          {/* Hidden Admin Link */}
          <Link 
            href="/admin" 
            className="absolute bottom-0 right-0 p-2 text-muted-foreground/30 hover:text-muted-foreground transition-colors text-xs"
            aria-label="Admin Access"
          >
            ⌘
          </Link>
        </div>
      </div>
    </footer>
  );
}
