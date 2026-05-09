"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import BlogCard from "@/components/BlogCard";
import type { BlogPost } from "@/types";
import { FaSearch } from "react-icons/fa";

export default function BlogClient({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const { language } = useLanguage();

  const allLabel = language === 'id' ? 'Semua' : 'All';
  const categories = [allLabel, ...Array.from(new Set(initialPosts.map(p => p.category)))];

  const filteredPosts = initialPosts.filter(post => {
    const matchCategory = category === allLabel || post.category === category;
    const title = language === 'id' ? post.title_id : post.title_en;
    const excerpt = language === 'id' ? post.excerpt_id : post.excerpt_en;
    const matchSearch = title.toLowerCase().includes(search.toLowerCase()) || 
                        excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12">
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                category === cat 
                  ? "bg-gradient-neon text-[#0A0A0F] shadow-[0_0_15px_rgba(0,153,255,0.3)]" 
                  : "bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder={language === 'id' ? "Cari artikel..." : "Search articles..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-500"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-20 text-gray-500 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl">
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            {language === 'id' ? 'Tidak ada hasil' : 'No results'}
          </h3>
          <p>{language === 'id' ? 'Coba gunakan kata kunci lain atau pilih kategori berbeda.' : 'Try a different keyword or category.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </>
  );
}
