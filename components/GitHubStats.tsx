'use client'

import { useLanguage } from "@/components/LanguageProvider";
import { FaGithub, FaChartLine, FaCode } from "react-icons/fa";

export default function GitHubStats({ username }: { username: string }) {
  const { language } = useLanguage();

  const t = {
    title: language === 'id' ? 'Statistik GitHub' : 'GitHub Statistics',
    subtitle: language === 'id' ? 'Kontribusi dan aktivitas kode saya.' : 'My contributions and coding activity.',
  };

  if (!username) return null;

  return (
    <div className="py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gray-900 dark:bg-white/10 flex items-center justify-center text-2xl text-white">
          <FaGithub />
        </div>
        <div>
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">{t.title}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{t.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* GitHub Stats Card */}
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-6 overflow-hidden flex items-center justify-center">
          <img
            src={`https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=transparent&title_color=00FF88&text_color=ffffff&icon_color=0099FF&hide_border=true&bg_color=0D111700`}
            alt="GitHub Stats"
            className="w-full max-w-md dark:invert-0 invert"
          />
        </div>

        {/* Top Languages Card */}
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-6 overflow-hidden flex items-center justify-center">
          <img
            src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=transparent&title_color=00FF88&text_color=ffffff&hide_border=true&bg_color=0D111700`}
            alt="Top Languages"
            className="w-full max-w-md dark:invert-0 invert"
          />
        </div>

        {/* Streak Stats Card */}
        <div className="md:col-span-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-6 overflow-hidden flex items-center justify-center">
          <img
            src={`https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=transparent&stroke=00FF88&fire=0099FF&ring=00FF88&sideNums=ffffff&sideLabels=ffffff&dates=ffffff&currStreakNum=ffffff&currStreakLabel=00FF88&hide_border=true&background=0D111700`}
            alt="GitHub Streak"
            className="w-full max-w-2xl dark:invert-0 invert"
          />
        </div>
      </div>

      {/* Contribution Graph (Using GitHub's own SVG if possible, or another service) */}
      <div className="mt-8 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-8 overflow-hidden">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
          <FaChartLine className="text-blue-500" />
          {language === 'id' ? 'Kontribusi Tahun Ini' : 'Contributions this Year'}
        </h3>
        <div className="flex justify-center">
          <img 
            src={`https://ghchart.rshah.org/00FF88/${username}`} 
            alt="GitHub Contributions" 
            className="w-full max-w-4xl dark:brightness-110"
          />
        </div>
      </div>
    </div>
  );
}
