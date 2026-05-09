"use client";

import Image from "next/image";
import Link from "next/link";
import { FaCalendarAlt, FaArrowLeft } from "react-icons/fa";
import { useLanguage } from "@/components/LanguageProvider";
import type { BlogPost } from "@/types";

export default function BlogDetailClient({ post, relatedPosts }: { post: BlogPost; relatedPosts: BlogPost[] }) {
  const { language } = useLanguage();

  const title = language === 'id' ? post.title_id : post.title_en;
  const content = language === 'id' ? post.content_id : post.content_en;

  const date = new Date(post.created_at).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  const formatContent = (text: string) => {
    if (!text) return "";
    // If it already looks like HTML (contains <p> or <br>), return as is
    if (/<[a-z][\s\S]*>/i.test(text)) return text;
    
    // Otherwise, convert double newlines to paragraphs and single newlines to br
    return text
      .split(/\n\n+/)
      .map(para => `<p className="mb-4">${para.replace(/\n/g, '<br />')}</p>`)
      .join('');
  };

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[var(--color-neon-blue)] transition-colors mb-8">
          <FaArrowLeft /> {language === 'id' ? 'Kembali ke Blog' : 'Back to Blog'}
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-[var(--color-neon-blue)]/20 text-[var(--color-neon-blue)] border border-[var(--color-neon-blue)]/30">
              {post.category}
            </span>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
              <FaCalendarAlt />
              <span>{date}</span>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-heading font-bold mb-8 leading-tight">
            {title}
          </h1>

          <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-1">
            <Image
              src={post.thumbnail || "/og-image.jpg"}
              alt={title}
              fill
              className="object-cover rounded-2xl"
            />
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-heading prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-[var(--color-neon-blue)] hover:prose-a:text-[var(--color-neon-green)] prose-img:rounded-2xl prose-p:text-gray-700 dark:prose-p:text-gray-300">
          <div dangerouslySetInnerHTML={{ __html: formatContent(content) }} />
        </div>

        {/* CTA Follow */}
        <div className="mt-16 p-8 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl text-center flex flex-col items-center shadow-sm">
          <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            {language === 'id' ? 'Suka artikel ini?' : 'Like this article?'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {language === 'id' ? 'Dapatkan lebih banyak insight dan tips menarik di Instagram saya.' : 'Get more insights and interesting tips on my Instagram.'}
          </p>
          <a
            href="https://instagram.com/m.daffarizkyy_"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-[#E1306C] to-[#833AB4] text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
          >
            Follow IG @m.daffarizkyy_
          </a>
        </div>

        {/* Related Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="mt-24 border-t border-gray-200 dark:border-white/10 pt-16">
            <h2 className="text-3xl font-heading font-bold mb-8 text-gray-900 dark:text-white">
              {language === 'id' ? 'Artikel' : 'Related'} <span className="text-gradient">{language === 'id' ? 'Terkait' : 'Articles'}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => {
                const relTitle = language === 'id' ? relatedPost.title_id : relatedPost.title_en;
                return (
                  <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} className="group">
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-4 border border-gray-200 dark:border-white/10">
                      <Image
                        src={relatedPost.thumbnail || "/og-image.jpg"}
                        alt={relTitle}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <h3 className="font-bold text-lg group-hover:text-[var(--color-neon-blue)] transition-colors line-clamp-2 text-gray-900 dark:text-white">
                      {relTitle}
                    </h3>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
