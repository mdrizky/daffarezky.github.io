'use client'

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { FaQuoteLeft, FaMoon } from "react-icons/fa";

const quotes = [
  {
    id: "id",
    text: "Barangsiapa yang menempuh jalan untuk mencari ilmu, maka Allah akan memudahkan baginya jalan menuju surga.",
    ref: "HR. Muslim"
  },
  {
    id: "en",
    text: "Whoever follows a path in pursuit of knowledge, Allah will make easy for him a path to Paradise.",
    ref: "Narrated by Muslim"
  },
  {
    id: "id",
    text: "Sebaik-baik manusia adalah yang paling bermanfaat bagi orang lain.",
    ref: "HR. Ahmad"
  },
  {
    id: "en",
    text: "The best of people are those that bring most benefit to the rest of mankind.",
    ref: "Narrated by Ahmad"
  },
  {
    id: "id",
    text: "Bekerjalah untuk duniamu seolah-olah kamu hidup selamanya, dan beramallah untuk akhiratmu seolah-olah kamu mati besok.",
    ref: "Ali bin Abi Thalib"
  },
  {
    id: "en",
    text: "Work for your world as if you will live forever, and work for your hereafter as if you will die tomorrow.",
    ref: "Ali bin Abi Thalib"
  }
];

export default function DailyIslamicQuote() {
  const { language } = useLanguage();
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    // Pick a quote based on the day of the year
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const filteredQuotes = quotes.filter(q => q.id === language);
    setQuote(filteredQuotes[dayOfYear % filteredQuotes.length]);
  }, [language]);

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-3xl blur-xl group-hover:opacity-100 opacity-50 transition-opacity"></div>
      <div className="relative bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-8 overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10 text-6xl">
          <FaMoon />
        </div>
        <FaQuoteLeft className="text-3xl text-emerald-500 mb-6" />
        <p className="text-xl md:text-2xl font-heading font-medium text-gray-900 dark:text-white mb-6 leading-relaxed italic">
          {quote.text}
        </p>
        <div className="flex items-center gap-2">
          <div className="w-8 h-px bg-emerald-500"></div>
          <span className="text-sm font-bold text-emerald-500 uppercase tracking-widest">
            {quote.ref}
          </span>
        </div>
      </div>
    </div>
  );
}
