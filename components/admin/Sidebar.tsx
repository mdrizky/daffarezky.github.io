"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { 
  FaHome, FaProjectDiagram, FaBlog, 
  FaCogs, FaEnvelope, FaUserEdit, FaSignOutAlt 
} from "react-icons/fa";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: <FaHome /> },
    { name: "Projects", path: "/admin/projects", icon: <FaProjectDiagram /> },
    { name: "Blog", path: "/admin/blog", icon: <FaBlog /> },
    { name: "Services", path: "/admin/services", icon: <FaCogs /> },
    { name: "Messages", path: "/admin/messages", icon: <FaEnvelope /> },
    { name: "Profile", path: "/admin/profile", icon: <FaUserEdit /> },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <aside className="w-64 h-screen bg-[#0A0A0F] border-r border-white/10 flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-neon text-[#0A0A0F] font-heading font-bold">
            DR
          </div>
          <span className="font-heading font-bold">Admin Panel</span>
        </Link>
      </div>

      <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive 
                  ? "bg-white/10 text-[var(--color-neon-blue)] font-medium" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
        >
          <span className="text-lg"><FaSignOutAlt /></span>
          Logout
        </button>
      </div>
    </aside>
  );
}
