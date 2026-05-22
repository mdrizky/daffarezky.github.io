"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { 
  FaHome, FaProjectDiagram, FaBlog, 
  FaCogs, FaEnvelope, FaUserEdit, FaSignOutAlt,
  FaGraduationCap, FaTools, FaBriefcase, FaCertificate
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
    { name: "Profile", path: "/admin/profile", icon: <FaUserEdit /> },
    { name: "Education", path: "/admin/education", icon: <FaGraduationCap /> },
    { name: "Certificates", path: "/admin/certificates", icon: <FaCertificate /> },
    { name: "Skills", path: "/admin/skills", icon: <FaTools /> },
    { name: "Services", path: "/admin/services", icon: <FaCogs /> },
    { name: "Portfolio", path: "/admin/projects", icon: <FaProjectDiagram /> },
    { name: "Testimonials", path: "/admin/testimonials", icon: <FaEnvelope /> },
    { name: "Blog", path: "/admin/blog", icon: <FaBlog /> },
    { name: "Learning", path: "/admin/learning-journey", icon: <FaBriefcase /> },
    { name: "Messages", path: "/admin/messages", icon: <FaEnvelope /> },
    { name: "Settings", path: "/admin/settings", icon: <FaUserEdit /> },
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
