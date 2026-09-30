'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types';
import { 
  FaWhatsapp, 
  FaInstagram, 
  FaGithub, 
  FaLinkedin, 
  FaTiktok, 
  FaYoutube, 
  FaExternalLinkAlt 
} from 'react-icons/fa';

export default function SocialMediaGrid() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await supabase.from('profile').select('*').limit(1).maybeSingle();
        if (data) setProfile(data as Profile);
      } catch (err) {
        console.error('Error fetching profile for social links:', err);
      }
    };
    fetchProfile();
  }, []);

  const socials = [
    {
      name: 'WhatsApp',
      handle: profile?.wa || '+62 813-7493-6621',
      actionText: 'Chat Sekarang',
      url: profile?.wa ? `https://wa.me/${profile.wa.replace(/[^0-9]/g, '')}` : 'https://wa.me/6281374936621',
      icon: <FaWhatsapp size={22} />,
      badgeColor: 'bg-[#25D366]/10 text-[#25D366] border-[#25D366]/30',
      hoverBorder: 'hover:border-[#25D366]/50',
      iconBg: 'bg-[#25D366]/15 text-[#25D366]',
    },
    {
      name: 'Instagram',
      handle: profile?.instagram ? (profile.instagram.startsWith('@') ? profile.instagram : `@${profile.instagram.replace(/^https?:\/\/.*instagram\.com\//, '').replace(/\/$/, '')}`) : '@m.daffarizkyy_',
      actionText: 'Follow & DM',
      url: profile?.instagram ? (profile.instagram.startsWith('http') ? profile.instagram : `https://instagram.com/${profile.instagram.replace('@', '')}`) : 'https://instagram.com/m.daffarizkyy_',
      icon: <FaInstagram size={22} />,
      badgeColor: 'bg-[#E1306C]/10 text-[#E1306C] border-[#E1306C]/30',
      hoverBorder: 'hover:border-[#E1306C]/50',
      iconBg: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white',
    },
    {
      name: 'GitHub',
      handle: profile?.github ? `@${profile.github.replace(/^https?:\/\/.*github\.com\//, '').replace(/\/$/, '')}` : '@daffarezky',
      actionText: 'Lihat Repo',
      url: profile?.github || 'https://github.com/daffarezky',
      icon: <FaGithub size={22} />,
      badgeColor: 'bg-zinc-500/10 text-foreground border-zinc-500/30',
      hoverBorder: 'hover:border-foreground/40',
      iconBg: 'bg-foreground text-background',
    },
    {
      name: 'LinkedIn',
      handle: 'Muhammad Daffa Rezky',
      actionText: 'Koneksi',
      url: profile?.linkedin || 'https://linkedin.com/in/daffarezky',
      icon: <FaLinkedin size={22} />,
      badgeColor: 'bg-[#0077B5]/10 text-[#0077B5] border-[#0077B5]/30',
      hoverBorder: 'hover:border-[#0077B5]/50',
      iconBg: 'bg-[#0077B5] text-white',
    },
    {
      name: 'TikTok',
      handle: profile?.tiktok ? (profile.tiktok.startsWith('@') ? profile.tiktok : `@${profile.tiktok.replace(/^https?:\/\/.*tiktok\.com\/@?/, '').replace(/\/$/, '')}`) : '@daffarizky_',
      actionText: 'Tonton Video',
      url: profile?.tiktok ? (profile.tiktok.startsWith('http') ? profile.tiktok : `https://tiktok.com/@${profile.tiktok.replace('@', '')}`) : 'https://tiktok.com/@daffarizky_',
      icon: <FaTiktok size={20} />,
      badgeColor: 'bg-zinc-500/10 text-foreground border-zinc-500/30',
      hoverBorder: 'hover:border-foreground/40',
      iconBg: 'bg-black text-white dark:bg-white dark:text-black',
    },
    {
      name: 'YouTube',
      handle: profile?.youtube ? `@${profile.youtube.replace(/^https?:\/\/.*youtube\.com\/@?/, '').replace(/\/$/, '')}` : '@daffarezky',
      actionText: 'Subscribe',
      url: profile?.youtube || 'https://youtube.com',
      icon: <FaYoutube size={22} />,
      badgeColor: 'bg-[#FF0000]/10 text-[#FF0000] border-[#FF0000]/30',
      hoverBorder: 'hover:border-[#FF0000]/50',
      iconBg: 'bg-[#FF0000] text-white',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
      {socials.map((item) => (
        <a
          key={item.name}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-between p-3.5 rounded-2xl bg-card border border-border/80 ${item.hoverBorder} shadow-2xs hover:shadow-md transition-all duration-300 group hover:-translate-y-0.5`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-11 h-11 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
              {item.icon}
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-sm text-foreground leading-tight truncate flex items-center gap-1.5">
                <span>{item.name}</span>
              </h4>
              <p className="text-xs text-muted-foreground truncate font-mono">
                {item.handle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 pl-2">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg border ${item.badgeColor} transition-all`}>
              {item.actionText}
            </span>
            <FaExternalLinkAlt className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
        </a>
      ))}
    </div>
  );
}
