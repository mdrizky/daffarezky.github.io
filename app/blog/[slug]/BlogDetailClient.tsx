"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaCalendarAlt, FaArrowLeft, FaClock, FaShare, FaWhatsapp, FaTwitter, FaLink } from "react-icons/fa";
import { useLanguage } from "@/components/LanguageProvider";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { BlogPost } from "@/types";

// Estimate reading time (avg 200 words/min)
function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// Reading progress bar
function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200 dark:bg-white/10">
      <div
        className="h-full bg-gradient-to-r from-[#00FF88] to-[#0099FF] transition-all duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// Share buttons
function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const waUrl = `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`;
  const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Share:</span>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-full bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
        aria-label="Share on WhatsApp"
      >
        <FaWhatsapp size={16} />
      </a>
      <a
        href={twUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-full bg-[#1DA1F2]/10 border border-[#1DA1F2]/20 flex items-center justify-center text-[#1DA1F2] hover:bg-[#1DA1F2]/20 transition-colors"
        aria-label="Share on Twitter"
      >
        <FaTwitter size={16} />
      </a>
      <button
        onClick={copyLink}
        className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
        aria-label="Copy link"
      >
        {copied ? (
          <span className="text-[10px] font-bold text-green-500">✓</span>
        ) : (
          <FaLink size={14} />
        )}
      </button>
    </div>
  );
}

export default function BlogDetailClient({
  post,
  relatedPosts,
}: {
  post: BlogPost;
  relatedPosts: BlogPost[];
}) {
  const { language } = useLanguage();
  const contentRef = useRef<HTMLDivElement>(null);

  const title = language === "id" ? post.title_id : post.title_en;
  const content = language === "id" ? post.content_id : post.content_en;
  const excerpt = language === "id" ? post.excerpt_id : post.excerpt_en;

  const date = new Date(post.created_at).toLocaleDateString(
    language === "id" ? "id-ID" : "en-US",
    { day: "numeric", month: "long", year: "numeric" }
  );

  const minutes = readingTime(content);
  const pageUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://daffa-portfolio.vercel.app/blog/${post.slug}`;

  return (
    <>
      <ReadingProgressBar />

      <div className="pt-32 pb-24 min-h-screen">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          {/* Back */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-[var(--color-neon-blue)] transition-colors mb-10 group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            {language === "id" ? "Kembali ke Blog" : "Back to Blog"}
          </Link>

          {/* Header */}
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-[var(--color-neon-blue)]/15 text-[var(--color-neon-blue)] border border-[var(--color-neon-blue)]/25">
                {post.category}
              </span>
              <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm">
                <FaCalendarAlt size={12} />
                <span>{date}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm">
                <FaClock size={12} />
                <span>
                  {minutes} {language === "id" ? "menit baca" : "min read"}
                </span>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-heading font-bold leading-tight mb-5 text-gray-900 dark:text-white">
              {title}
            </h1>

            {excerpt && (
              <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed border-l-4 border-[var(--color-neon-green)] pl-5">
                {excerpt}
              </p>
            )}
          </header>

          {/* Thumbnail */}
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 mb-12 shadow-lg">
            <Image
              src={post.thumbnail || "/og-image.jpg"}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article Content */}
          <article
            ref={contentRef}
            className="
              prose prose-lg max-w-none
              dark:prose-invert
              prose-headings:font-heading prose-headings:font-bold
              prose-h1:text-3xl prose-h1:mt-12 prose-h1:mb-6
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-5 prose-h2:border-l-4 prose-h2:border-[#0099FF] prose-h2:pl-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-[#00FF88]
              prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-[1.85] prose-p:mb-6
              prose-a:text-[#0099FF] hover:prose-a:text-[#00FF88] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-bold
              prose-em:text-gray-600 dark:prose-em:text-gray-400
              prose-ul:my-6 prose-ul:space-y-2
              prose-ol:my-6 prose-ol:space-y-2
              prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:leading-relaxed
              prose-blockquote:border-l-4 prose-blockquote:border-[#00FF88] prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-white/5 prose-blockquote:rounded-r-xl prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic
              prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-300
              prose-code:text-[#00FF88] prose-code:bg-gray-100 dark:prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-gray-900 dark:prose-pre:bg-black/50 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-white/10 prose-pre:rounded-2xl prose-pre:overflow-x-auto
              prose-img:rounded-2xl prose-img:shadow-lg prose-img:border prose-img:border-gray-200 dark:prose-img:border-white/10
              prose-hr:border-gray-200 dark:prose-hr:border-white/10 prose-hr:my-10
              prose-table:border-collapse
              prose-th:bg-gray-100 dark:prose-th:bg-white/10 prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-bold
              prose-td:px-4 prose-td:py-3 prose-td:border prose-td:border-gray-200 dark:prose-td:border-white/10
            "
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </article>

          {/* Share + Tags */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                #{post.category}
              </span>
            </div>
            <ShareButtons title={title} url={pageUrl} />
          </div>

          {/* Author CTA */}
          <div className="mt-12 p-8 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl text-center flex flex-col items-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00FF88] to-[#0099FF] flex items-center justify-center text-[#0A0A0F] font-bold text-xl mb-4">
              DR
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              {language === "id" ? "Suka artikel ini?" : "Like this article?"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
              {language === "id"
                ? "Dapatkan lebih banyak insight dan tips menarik di Instagram saya."
                : "Get more insights and interesting tips on my Instagram."}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="https://instagram.com/m.daffarizkyy_"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-[#E1306C] to-[#833AB4] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:scale-105 transition-transform"
              >
                Follow IG @m.daffarizkyy_
              </a>
              <Link
                href="/kontak"
                className="bg-gradient-to-r from-[#00FF88] to-[#0099FF] text-[#0A0A0F] px-6 py-2.5 rounded-full font-bold text-sm hover:scale-105 transition-transform"
              >
                {language === "id" ? "Hire Me 🔥" : "Hire Me 🔥"}
              </Link>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts && relatedPosts.length > 0 && (
            <div className="mt-20 border-t border-gray-200 dark:border-white/10 pt-16">
              <h2 className="text-2xl font-heading font-bold mb-8 text-gray-900 dark:text-white">
                {language === "id" ? "Artikel" : "Related"}{" "}
                <span className="text-gradient">
                  {language === "id" ? "Terkait" : "Articles"}
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => {
                  const relTitle =
                    language === "id"
                      ? relatedPost.title_id
                      : relatedPost.title_en;
                  const relExcerpt =
                    language === "id"
                      ? relatedPost.excerpt_id
                      : relatedPost.excerpt_en;
                  return (
                    <Link
                      key={relatedPost.id}
                      href={`/blog/${relatedPost.slug}`}
                      className="group"
                    >
                      <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-3 border border-gray-200 dark:border-white/10">
                        <Image
                          src={relatedPost.thumbnail || "/og-image.jpg"}
                          alt={relTitle}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <span className="text-xs font-bold text-[var(--color-neon-blue)] uppercase tracking-wider">
                        {relatedPost.category}
                      </span>
                      <h3 className="font-bold mt-1 group-hover:text-[var(--color-neon-blue)] transition-colors line-clamp-2 text-gray-900 dark:text-white">
                        {relTitle}
                      </h3>
                      {relExcerpt && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {relExcerpt}
                        </p>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
