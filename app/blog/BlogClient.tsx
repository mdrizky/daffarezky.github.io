"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import BlogCard from "@/components/BlogCard";
import type { BlogPost } from "@/types";
import { FaSearch } from "react-icons/fa";

export default function BlogClient({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [search, setSearch] = useState("");
  const { language } = useLanguage();
  const allLabel = language === 'id' ? 'Semua' : 'All';
  const [category, setCategory] = useState(allLabel);

  const categories = [allLabel, ...Array.from(new Set(initialPosts.map(p => p.category)))];

  const filteredPosts = initialPosts.filter(post => {
    const matchCategory = category === allLabel || category === 'Semua' || category === 'All' || post.category === category;
    const title = language === 'id' ? post.title_id : post.title_en;
    const excerpt = language === 'id' ? post.excerpt_id : post.excerpt_en;
    const matchSearch = (title || "").toLowerCase().includes(search.toLowerCase()) || 
                        (excerpt || "").toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          {categories.map(cat => {
            const isActive = category === cat || (cat === allLabel && (category === 'Semua' || category === 'All'));
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md scale-105"
                    : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder={language === 'id' ? "Cari artikel..." : "Search articles..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border rounded-full py-2.5 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground shadow-sm"
          />
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground bg-card border border-border rounded-3xl p-8">
          <h3 className="text-xl font-bold mb-2 text-foreground font-heading">
            {language === 'id' ? 'Tidak ada artikel ditemukan' : 'No articles found'}
          </h3>
          <p className="text-sm">
            {language === 'id' 
              ? 'Coba gunakan kata kunci pencarian lain atau pilih kategori yang berbeda.' 
              : 'Try a different search keyword or select another category.'}
          </p>
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
