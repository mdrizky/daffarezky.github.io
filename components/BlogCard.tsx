"use client";

import Image from "next/image";
import Link from "next/link";
import { FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import { useLanguage } from "@/components/LanguageProvider";
import type { BlogPost } from "@/types";

export default function BlogCard({ post }: { post: BlogPost }) {
  const { language } = useLanguage();

  const title = language === 'id' ? post.title_id : post.title_en;
  const excerpt = language === 'id' ? post.excerpt_id : post.excerpt_en;

  const date = new Date(post.created_at).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <Link href={`/blog/${post.slug}`} className="block h-full group">
      <div className="bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col h-full">
        {/* Thumbnail */}
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={post.thumbnail || "/og-image.jpg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4 z-20 px-3 py-1 text-xs font-bold rounded-full bg-secondary/80 backdrop-blur-sm border border-border text-secondary-foreground">
            {post.category}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-3">
            <FaCalendarAlt />
            <span>{date}</span>
          </div>
          
          <h3 className="text-lg font-heading font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2 text-foreground">
            {title}
          </h3>
          
          <p className="text-muted-foreground text-sm mb-6 line-clamp-3 flex-grow">
            {excerpt}
          </p>

          <div className="flex items-center gap-2 text-primary text-sm font-medium mt-auto group-hover:gap-3 transition-all">
            {language === 'id' ? 'Baca Selengkapnya' : 'Read More'} <FaArrowRight />
          </div>
        </div>
      </div>
    </Link>
  );
}
