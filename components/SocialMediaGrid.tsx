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
        const { data } = await supabase
          .from('profile')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (data) setProfile(data as Profile);
      } catch (err) {
        console.error('Error fetching profile for social links:', err);
      }
    };
    fetchProfile();
  }, []);

  const cleanHandle = (val?: string, fallback = '') => {
    if (!val) return fallback;
    try {
      if (val.startsWith('http://') || val.startsWith('https://')) {
        const url = new URL(val);
        const parts = url.pathname.split('/').filter(Boolean);
        return parts.length > 0 ? parts[parts.length - 1].replace(/^@/, '') : fallback;
      }
    } catch {
      // fallback
    }
    return val.replace(/^@/, '');
  };

  const socials = [
    {
      name: 'WhatsApp',
      handle: profile?.wa || '+62 813-7493-6621',
      url: profile?.wa ? `https://wa.me/${profile.wa.replace(/[^0-9]/g, '')}` : 'https://wa.me/6281374936621',
      icon: <FaWhatsapp className="text-xl" />,
      iconTheme: 'bg-[#25D366]/10 text-[#25D366] border-[#25D366]/25 group-hover:border-[#25D366]/50',
    },
    {
      name: 'Instagram',
      handle: profile?.instagram ? `@${cleanHandle(profile.instagram, 'm.daffarizkyy_')}` : '@m.daffarizkyy_',
      url: profile?.instagram ? (profile.instagram.startsWith('http') ? profile.instagram : `https://instagram.com/${cleanHandle(profile.instagram, 'm.daffarizkyy_')}`) : 'https://instagram.com/m.daffarizkyy_',
      icon: <FaInstagram className="text-xl" />,
      iconTheme: 'bg-[#E1306C]/10 text-[#E1306C] border-[#E1306C]/25 group-hover:border-[#E1306C]/50',
    },
    {
      name: 'GitHub',
      handle: profile?.github ? `@${cleanHandle(profile.github, 'daffarezky')}` : '@daffarezky',
      url: profile?.github ? (profile.github.startsWith('http') ? profile.github : `https://github.com/${cleanHandle(profile.github, 'daffarezky')}`) : 'https://github.com/daffarezky',
      icon: <FaGithub className="text-xl" />,
      iconTheme: 'bg-zinc-800/80 text-foreground border-zinc-700/60 group-hover:border-zinc-500/60',
    },
    {
      name: 'LinkedIn',
      handle: profile?.linkedin ? (profile.linkedin.includes('/in/') ? `in/${cleanHandle(profile.linkedin, 'daffarezky')}` : 'Daffa Rezky') : 'in/daffarezky',
      url: profile?.linkedin ? (profile.linkedin.startsWith('http') ? profile.linkedin : `https://linkedin.com/in/${cleanHandle(profile.linkedin, 'daffarezky')}`) : 'https://linkedin.com/in/daffarezky',
      icon: <FaLinkedin className="text-xl" />,
      iconTheme: 'bg-[#0077B5]/10 text-[#0077B5] border-[#0077B5]/25 group-hover:border-[#0077B5]/50',
    },
    {
      name: 'TikTok',
      handle: profile?.tiktok ? `@${cleanHandle(profile.tiktok, 'daffarizky_')}` : '@daffarizky_',
      url: profile?.tiktok ? (profile.tiktok.startsWith('http') ? profile.tiktok : `https://tiktok.com/@${cleanHandle(profile.tiktok, 'daffarizky_')}`) : 'https://tiktok.com/@daffarizky_',
      icon: <FaTiktok className="text-lg" />,
      iconTheme: 'bg-zinc-800/80 text-foreground border-zinc-700/60 group-hover:border-zinc-500/60',
    },
    {
      name: 'YouTube',
      handle: profile?.youtube ? `@${cleanHandle(profile.youtube, 'daffarezky')}` : '@daffarezky',
      url: profile?.youtube ? (profile.youtube.startsWith('http') ? profile.youtube : `https://youtube.com/@${cleanHandle(profile.youtube, 'daffarezky')}`) : 'https://youtube.com/@daffarezky',
      icon: <FaYoutube className="text-xl" />,
      iconTheme: 'bg-[#FF0000]/10 text-[#FF0000] border-[#FF0000]/25 group-hover:border-[#FF0000]/50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
      {socials.map((item) => (
        <a
          key={item.name}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-card/70 dark:bg-zinc-900/50 border border-border/80 dark:border-zinc-800/80 hover:border-cyan-500/40 dark:hover:border-cyan-500/40 hover:bg-card dark:hover:bg-zinc-800/60 shadow-xs hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className={`w-10 h-10 rounded-xl ${item.iconTheme} border flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-200`}>
              {item.icon}
            </div>
            <div className="min-w-0 flex-1 pr-1">
              <span className="block font-semibold text-sm text-foreground group-hover:text-cyan-400 transition-colors leading-tight truncate">
                {item.name}
              </span>
              <span className="block text-xs text-muted-foreground truncate font-mono mt-0.5">
                {item.handle}
              </span>
            </div>
          </div>

          <div className="w-7 h-7 rounded-lg bg-zinc-800/30 dark:bg-zinc-800/50 border border-border/50 dark:border-zinc-700/50 flex items-center justify-center text-muted-foreground/70 group-hover:text-cyan-400 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0">
            <FaExternalLinkAlt className="text-[10px]" />
          </div>
        </a>
      ))}
    </div>
  );
}
