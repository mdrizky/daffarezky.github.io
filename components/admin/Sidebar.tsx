"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { 
  FaHome, FaProjectDiagram, FaBlog, 
  FaCogs, FaEnvelope, FaUserEdit, FaSignOutAlt,
  FaGraduationCap, FaTools, FaBriefcase, FaCertificate, FaHandshake, FaLightbulb
} from "react-icons/fa";
import SiteLogo from "@/components/SiteLogo";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: <FaHome /> },
    { name: "Profil", path: "/admin/profile", icon: <FaUserEdit /> },
    { name: "Portfolio", path: "/admin/projects", icon: <FaProjectDiagram /> },
    { name: "Pendidikan", path: "/admin/education", icon: <FaGraduationCap /> },
    { name: "Pengalaman", path: "/admin/experience", icon: <FaBriefcase /> },
    { name: "Keahlian", path: "/admin/skills", icon: <FaTools /> },
    { name: "Sertifikat", path: "/admin/certificates", icon: <FaCertificate /> },
    { name: "Layanan", path: "/admin/services", icon: <FaCogs /> },
    { name: "Partner", path: "/admin/partners", icon: <FaHandshake /> },
    { name: "Blog", path: "/admin/blog", icon: <FaBlog /> },
    { name: "Komentar Blog", path: "/admin/blog-comments", icon: <FaBlog /> },
    { name: "Guestbook", path: "/admin/guestbook", icon: <FaEnvelope /> },
    { name: "Newsletter", path: "/admin/newsletter", icon: <FaEnvelope /> },
    { name: "Uses Items", path: "/admin/uses", icon: <FaTools /> },
    { name: "Pesan", path: "/admin/messages", icon: <FaEnvelope /> },
    { name: "Testimonials", path: "/admin/testimonials", icon: <FaEnvelope /> },
    { name: "Alasan (Home)", path: "/admin/reasons-to-hire", icon: <FaLightbulb /> },
    { name: "Milestone", path: "/admin/journey-milestones", icon: <FaBriefcase /> },
    { name: "Fokus Area", path: "/admin/focus-areas", icon: <FaTools /> },
    { name: "Core Values", path: "/admin/core-values", icon: <FaCertificate /> },
    { name: "Quotes", path: "/admin/quotes", icon: <FaBlog /> },
    { name: "Proyek Aktif", path: "/admin/active-projects", icon: <FaProjectDiagram /> },
    { name: "Konsep Masa Depan", path: "/admin/future-concepts", icon: <FaLightbulb /> },
    { name: "Settings", path: "/admin/settings", icon: <FaCogs /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin_pin_auth');
    router.push("/admin/login");
  };

  return (
    <aside className="w-64 h-screen bg-white dark:bg-[#0A0A0F]/80 backdrop-blur-xl border-r border-gray-200 dark:border-white/10 flex flex-col fixed left-0 top-0 shadow-lg dark:shadow-none z-50 transition-colors duration-300">
      <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
        <SiteLogo size={36} textSize="text-base" href="/" />
        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 ml-1">Admin</span>
      </div>

      <nav className="flex-grow p-4 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? "bg-blue-50 dark:bg-white/10 text-blue-600 dark:text-[var(--color-neon-blue)] font-semibold shadow-sm" 
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
              }`}
            >
              <span className={`text-lg ${isActive ? 'scale-110' : ''} transition-transform`}>{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-white/10">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-400/10 transition-colors font-medium"
        >
          <span className="text-lg"><FaSignOutAlt /></span>
          Logout
        </button>
      </div>
    </aside>
  );
}
