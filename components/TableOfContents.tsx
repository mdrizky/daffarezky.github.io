'use client'

import { useEffect, useState } from 'react';
import { useLanguage } from "@/components/LanguageProvider";

export default function TableOfContents({ content }: { content: string }) {
  const { language } = useLanguage();
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Simple regex to find markdown headings (## and ###)
    const headingLines = content.split('\n').filter(line => line.startsWith('## ') || line.startsWith('### '));
    const extractedHeadings = headingLines.map(line => {
      const level = line.startsWith('### ') ? 3 : 2;
      const text = line.replace(/^#+\s/, '').trim();
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      return { id, text, level };
    });
    setHeadings(extractedHeadings);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -35% 0%' }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="hidden lg:block sticky top-32 h-fit bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 w-64 ml-8">
      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
        {language === 'id' ? 'Daftar Isi' : 'Table of Contents'}
      </h3>
      <nav className="space-y-3">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={`block text-sm transition-all hover:text-blue-500 ${
              activeId === heading.id ? 'text-blue-500 font-bold translate-x-1' : 'text-gray-500'
            } ${heading.level === 3 ? 'pl-4' : ''}`}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
