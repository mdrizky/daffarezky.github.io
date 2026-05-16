"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SocialLinks from "./SocialLinks";
import { useLanguage } from "@/components/LanguageProvider";
import { supabase } from "@/lib/supabase";
import SiteLogo from "@/components/SiteLogo";

export default function Footer() {
  const { language } = useLanguage();
  const [profileName, setProfileName] = useState<string>("Daffa Rizky");

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase.from('profile').select('name').limit(1);
      if (data && data.length > 0) setProfileName(data[0].name);
    };
    fetchProfile();
  }, []);

  const quickLinksId = [
    { name: "Beranda", path: "/" },
    { name: "Tentang", path: "/tentang" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Skills", path: "/skills" },
    { name: "Blog", path: "/blog" },
  ];

  const quickLinksEn = [
    { name: "Home", path: "/" },
    { name: "About", path: "/tentang" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Skills", path: "/skills" },
    { name: "Blog", path: "/blog" },
  ];

  const quickLinks = language === 'id' ? quickLinksId : quickLinksEn;

  return (
    <footer className="border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0A0A0F] pt-16 pb-8 transition-colors duration-300">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <SiteLogo size={40} textSize="text-xl" />
            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
              {language === 'id'
                ? 'Mengubah ide menjadi realitas digital. Seorang Digital Business Strategist yang membantu brand tumbuh di era digital.'
                : 'Turning ideas into digital reality. Aspiring Digital Business Strategist helping brands grow in the digital era.'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white">
              {language === 'id' ? 'Tautan Cepat' : 'Quick Links'}
            </h3>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className="text-gray-500 dark:text-gray-400 hover:text-[var(--color-neon-green)] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white">
              {language === 'id' ? 'Hubungi' : 'Connect'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              {language === 'id'
                ? 'Mari bangun sesuatu yang hebat bersama.'
                : "Let's build something great together."}
            </p>
            <SocialLinks variant="icon-only" />
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-200 dark:border-white/5 relative">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} {profileName}. {language === 'id' ? 'Dibangun dengan penuh semangat.' : 'Built with passion.'}
          </p>
          
          {/* Hidden Admin Link */}
          <Link 
            href="/admin" 
            className="absolute bottom-0 right-0 p-2 text-transparent hover:text-gray-300 dark:hover:text-white/20 transition-colors text-xs"
            aria-label="Admin Access"
          >
            ⌘
          </Link>
        </div>
      </div>
    </footer>
  );
}
