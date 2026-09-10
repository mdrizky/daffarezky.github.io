"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaHome, FaProjectDiagram, FaBlog,
  FaCogs, FaEnvelope, FaUserEdit, FaSignOutAlt,
  FaGraduationCap, FaTools, FaBriefcase, FaCertificate, FaHandshake, FaLightbulb,
  FaUsers, FaTrophy, FaRoute, FaComments, FaNewspaper
} from "react-icons/fa";
import SiteLogo from "@/components/SiteLogo";
import { supabase } from "@/lib/supabase";

const groups = [
  {
    label: "Overview",
    items: [{ name: "Dashboard", path: "/admin", icon: <FaHome /> }],
  },
  {
    label: "Content",
    items: [
      { name: "Profile", path: "/admin/profile", icon: <FaUserEdit /> },
      { name: "Projects", path: "/admin/projects", icon: <FaProjectDiagram /> },
      { name: "Skills", path: "/admin/skills", icon: <FaTools /> },
      { name: "Education", path: "/admin/education", icon: <FaGraduationCap /> },
      { name: "Experience", path: "/admin/experience", icon: <FaBriefcase /> },
      { name: "Journey", path: "/admin/learning-journey", icon: <FaRoute /> },
      { name: "Achievements", path: "/admin/achievements", icon: <FaTrophy /> },
      { name: "Certificates", path: "/admin/certificates", icon: <FaCertificate /> },
      { name: "Services", path: "/admin/services", icon: <FaCogs /> },
      { name: "Why hire me", path: "/admin/reasons-to-hire", icon: <FaLightbulb /> },
      { name: "Focus areas", path: "/admin/focus-areas", icon: <FaTools /> },
      { name: "Values", path: "/admin/core-values", icon: <FaCertificate /> },
      { name: "Quotes", path: "/admin/quotes", icon: <FaBlog /> },
      { name: "Partners", path: "/admin/partners", icon: <FaHandshake /> },
      { name: "Islamic", path: "/admin/islamic", icon: <FaLightbulb /> },
      { name: "Uses", path: "/admin/uses", icon: <FaTools /> },
    ],
  },
  {
    label: "Blog",
    items: [
      { name: "Posts", path: "/admin/blog", icon: <FaNewspaper /> },
      { name: "Comments", path: "/admin/blog-comments", icon: <FaComments /> },
    ],
  },
  {
    label: "Engagement",
    items: [
      { name: "Messages", path: "/admin/messages", icon: <FaEnvelope /> },
      { name: "Testimonials", path: "/admin/testimonials", icon: <FaComments /> },
      { name: "Guestbook", path: "/admin/guestbook", icon: <FaEnvelope /> },
      { name: "Newsletter", path: "/admin/newsletter", icon: <FaEnvelope /> },
    ],
  },
  {
    label: "System",
    items: [
      { name: "Settings", path: "/admin/settings", icon: <FaCogs /> },
      { name: "Admin users", path: "/admin/users", icon: <FaUsers /> },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="w-64 h-screen bg-white dark:bg-[#0A0A0F]/80 backdrop-blur-xl border-r border-gray-200 dark:border-white/10 flex flex-col fixed left-0 top-0 shadow-lg dark:shadow-none z-50">
      <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
        <SiteLogo size={36} textSize="text-base" href="/" />
        <span className="text-xs font-semibold text-gray-400 ml-1">Admin</span>
      </div>

      <nav className="flex-grow p-4 space-y-6 overflow-y-auto custom-scrollbar">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="px-4 mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.path ||
                  (item.path !== "/admin" && pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                      isActive
                        ? "bg-gray-900 text-white dark:bg-white/10 dark:text-white font-semibold"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-white/10">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 transition-colors font-medium"
        >
          <span className="text-lg"><FaSignOutAlt /></span>
          Logout
        </button>
      </div>
    </aside>
  );
}
