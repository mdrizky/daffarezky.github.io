'use client'

import { useEffect, useState } from 'react';
import { useLanguage } from "@/components/LanguageProvider";
import { FaTrophy, FaStar, FaLevelUpAlt } from "react-icons/fa";

export default function Gamification() {
  const { language } = useLanguage();
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [badges, setBadges] = useState<string[]>([]);
  const [showNotification, setShowNotification] = useState<string | null>(null);

  useEffect(() => {
    // Load state from LocalStorage
    const savedXp = parseInt(localStorage.getItem('user_xp') || '0');
    const savedLevel = parseInt(localStorage.getItem('user_level') || '1');
    const savedBadges = JSON.parse(localStorage.getItem('user_badges') || '[]');
    
    setXp(savedXp);
    setLevel(savedLevel);
    setBadges(savedBadges);

    // Track page views
    const views = parseInt(localStorage.getItem('page_views') || '0') + 1;
    localStorage.setItem('page_views', views.toString());

    // Award badges
    if (views >= 10 && !savedBadges.includes('Frequent Reader')) {
      awardBadge('Frequent Reader');
    }
  }, []);

  const awardBadge = (badgeName: string) => {
    const currentBadges = JSON.parse(localStorage.getItem('user_badges') || '[]');
    if (!currentBadges.includes(badgeName)) {
      const newBadges = [...currentBadges, badgeName];
      localStorage.setItem('user_badges', JSON.stringify(newBadges));
      setBadges(newBadges);
      setShowNotification(badgeName);
      addXp(50);
      setTimeout(() => setShowNotification(null), 5000);
    }
  };

  const addXp = (amount: number) => {
    const currentXp = parseInt(localStorage.getItem('user_xp') || '0') + amount;
    let currentLevel = parseInt(localStorage.getItem('user_level') || '1');
    
    // Level up logic (100 XP per level for simplicity)
    const newLevel = Math.floor(currentXp / 100) + 1;
    if (newLevel > currentLevel) {
      // Level up!
      localStorage.setItem('user_level', newLevel.toString());
      setLevel(newLevel);
    }
    
    localStorage.setItem('user_xp', currentXp.toString());
    setXp(currentXp);
  };

  const t = {
    level: language === 'id' ? 'Level' : 'Level',
    badges: language === 'id' ? 'Pencapaian' : 'Achievements',
    newBadge: language === 'id' ? 'Pencapaian Baru!' : 'New Achievement!',
  };

  return (
    <>
      {/* XP Bar Floating */}
      <div className="fixed bottom-24 left-6 z-50 group">
        <div className="bg-white/80 dark:bg-black/50 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl p-3 shadow-lg flex items-center gap-3 transition-all hover:scale-105">
          <div className="w-10 h-10 rounded-xl bg-gradient-neon flex items-center justify-center text-[#0A0A0F] font-bold">
            {level}
          </div>
          <div className="hidden group-hover:block w-32">
            <div className="flex justify-between text-[10px] font-bold mb-1 text-gray-500">
              <span>XP</span>
              <span>{xp % 100} / 100</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-500" 
                style={{ width: `${xp % 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Badge Notification */}
      {showNotification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-top-10 duration-500">
          <div className="bg-gradient-neon p-[2px] rounded-2xl shadow-[0_0_30px_rgba(0,255,136,0.5)]">
            <div className="bg-[#0A0A0F] rounded-2xl px-6 py-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl text-[var(--color-neon-green)]">
                <FaTrophy />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--color-neon-green)] uppercase tracking-widest">{t.newBadge}</p>
                <p className="text-white font-bold text-lg">{showNotification}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Badges List (can be integrated into profile/about) */}
    </>
  );
}
