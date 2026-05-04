import Link from "next/link";
import SocialLinks from "./SocialLinks";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0A0A0F] pt-16 pb-8">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-neon text-white font-heading font-bold text-lg">
                DR
              </div>
              <span className="font-heading font-bold text-xl">
                Daffa Rizky
              </span>
            </Link>
            <p className="text-gray-400 mt-2 max-w-sm">
              Turning ideas into digital reality. Aspiring Digital Business Strategist helping brands grow in the digital era.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading font-bold text-lg">Quick Links</h3>
            <ul className="flex flex-col gap-2">
              {["Beranda", "Tentang", "Portfolio", "Skills", "Blog"].map((item) => (
                <li key={item}>
                  <Link
                    href={item === "Beranda" ? "/" : `/${item.toLowerCase()}`}
                    className="text-gray-400 hover:text-[var(--color-neon-green)] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading font-bold text-lg">Connect</h3>
            <p className="text-gray-400 mb-2">Let's build something great together.</p>
            <SocialLinks variant="icon-only" />
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 relative">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Daffa Rizky. Built with passion.
          </p>
          
          {/* Hidden Admin Link */}
          <Link 
            href="/admin" 
            className="absolute bottom-0 right-0 p-2 text-transparent hover:text-white/20 transition-colors text-xs"
            aria-label="Admin Access"
          >
            ⌘
          </Link>
        </div>
      </div>
    </footer>
  );
}
