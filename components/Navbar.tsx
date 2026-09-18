"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useLanguage } from "@/components/LanguageProvider";
import { cn } from "@/lib/utils";
import { FaBars, FaTimes, FaSun, FaMoon, FaGlobe } from "react-icons/fa";
import SiteLogo from "@/components/SiteLogo";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const theme = resolvedTheme ?? 'light';

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = language === 'id' ? [
    { name: "Beranda", path: "/" },
    { name: "Tentang", path: "/tentang" },
    { name: "Portfolio", path: "/projects" },
    { name: "Keahlian", path: "/skills" },
    { name: "Pengalaman", path: "/pengalaman" },
    { name: "Layanan", path: "/services" },
    { name: "Blog", path: "/blog" },
    { name: "Kontak", path: "/kontak" },
  ] : [
    { name: "Home", path: "/" },
    { name: "About", path: "/tentang" },
    { name: "Portfolio", path: "/projects" },
    { name: "Skills", path: "/skills" },
    { name: "Experience", path: "/pengalaman" },
    { name: "Services", path: "/services" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/kontak" },
  ];

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'id' ? 'en' : 'id');
  };

  return (
    <nav
      className={cn(
        "fixed top-0 z-40 w-full transition-all duration-300",
        isScrolled
          ? "backdrop-blur-xl bg-background/80 py-4 shadow-sm border-b border-border/60"
          : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <SiteLogo size={40} textSize="text-xl" />

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6">
          <ul className="flex items-center gap-5">
            {navLinks.map((link) => {
              const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
              return (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className={cn(
                      "text-sm font-semibold transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Theme & Language Toggles */}
          <div className="flex items-center gap-2 ml-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-muted text-foreground hover:bg-accent transition-all"
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            >
              {theme === 'dark' ? <FaSun className="text-amber-400" /> : <FaMoon className="text-indigo-500" />}
            </button>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted text-foreground hover:bg-accent transition-all text-xs font-bold"
              title="Switch Language"
            >
              <FaGlobe />
              {language === 'id' ? 'EN' : 'ID'}
            </button>
          </div>

          <Link
            href="/kontak"
            className="rounded-full bg-primary text-primary-foreground px-6 py-2.5 text-sm font-semibold shadow-sm transition-all hover:opacity-90 hover:scale-105 active:scale-95"
          >
            {language === 'id' ? 'Hire Me 🔥' : 'Hire Me 🔥'}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 lg:hidden">
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-muted text-foreground"
            >
              {resolvedTheme === 'dark' ? <FaSun className="text-amber-400" /> : <FaMoon className="text-indigo-500" />}
            </button>
          )}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-muted text-foreground text-xs font-bold"
          >
            <FaGlobe />
            {language === 'id' ? 'EN' : 'ID'}
          </button>
          <button
            className="text-foreground p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full backdrop-blur-xl bg-background/95 max-h-[calc(100vh-5rem)] overflow-y-auto flex flex-col items-center py-6 gap-6 lg:hidden shadow-xl border-t border-border animate-in slide-in-from-top-2">
          <ul className="flex flex-col items-center gap-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
              return (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "text-lg font-medium transition-colors",
                      isActive
                        ? "text-primary font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href="/kontak"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-full bg-primary text-primary-foreground px-8 py-3 text-base font-semibold shadow-md transition-all active:scale-95"
          >
            {language === 'id' ? 'Hire Me 🔥' : 'Hire Me 🔥'}
          </Link>
        </div>
      )}
    </nav>
  );
}
