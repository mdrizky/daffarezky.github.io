"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
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

  const navLinks = [
    { name: "Beranda", path: "/" },
    { name: "Tentang", path: "/tentang" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Skills", path: "/skills" },
    { name: "Services", path: "/services" },
    { name: "Blog", path: "/blog" },
    { name: "Kontak", path: "/kontak" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 z-40 w-full transition-all duration-300",
        isScrolled ? "glass py-4 shadow-md" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-neon text-white font-heading font-bold text-lg shadow-[0_0_15px_rgba(0,255,136,0.5)] transition-transform group-hover:scale-105">
            DR
          </div>
          <span className="font-heading font-bold text-xl hidden sm:block">
            Daffa Rizky
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
              return (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-[var(--color-neon-green)]",
                      isActive ? "text-[var(--color-neon-green)]" : "text-gray-300"
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
            className="rounded-full bg-gradient-neon px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(0,153,255,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(0,255,136,0.6)]"
          >
            Hire Me 🔥
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full glass flex flex-col items-center py-6 gap-6 lg:hidden shadow-xl border-t border-white/10 animate-in slide-in-from-top-2">
          <ul className="flex flex-col items-center gap-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
              return (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-[var(--color-neon-green)]",
                      isActive ? "text-[var(--color-neon-green)]" : "text-gray-300"
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
            className="rounded-full bg-gradient-neon px-8 py-3 text-base font-semibold text-white shadow-[0_0_20px_rgba(0,153,255,0.4)] transition-all active:scale-95"
          >
            Hire Me 🔥
          </Link>
        </div>
      )}
    </nav>
  );
}
