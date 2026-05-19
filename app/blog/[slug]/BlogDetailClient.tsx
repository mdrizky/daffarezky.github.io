"use client";

import Image from "next/image"
import Link from "next/link"
import { FaCalendarAlt, FaArrowLeft } from "react-icons/fa"
import { useLanguage } from "@/components/LanguageProvider"
import type { BlogPost } from "@/types"
import React, { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeSanitize from "rehype-sanitize"
import rehypeHighlight from 'rehype-highlight'
import { blogProseClasses } from "@/lib/blog-styles"
import { estimateReadingTime } from "@/lib/readingTime"

export default function BlogDetailClient({ post, relatedPosts }: { post: BlogPost; relatedPosts: BlogPost[] }) {
  const { language } = useLanguage();

  const title = language === 'id' ? post.title_id : post.title_en;
  const content = language === 'id' ? post.content_id : post.content_en;

  const date = new Date(post.created_at).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  const containerRef = useRef<HTMLDivElement | null>(null)
  const [toc, setToc] = useState<Array<{ id: string; text: string; level: number }>>([])
  const [progress, setProgress] = useState<number>(0)
  const [readTime, setReadTime] = useState<string>("")

  useEffect(() => {
    setReadTime(estimateReadingTime(content))

    // collect headings after mount
    const collect = () => {
      const el = containerRef.current
      if (!el) return
      const nodes = Array.from(el.querySelectorAll('h2, h3'))
      const items = nodes.map((node) => ({
        id: (node as HTMLElement).id || slugify((node as HTMLElement).textContent || ''),
        text: (node as HTMLElement).textContent || '',
        level: node.tagName === 'H2' ? 2 : 3,
      }))
      setToc(items)
    }

    // initial collect (headings are rendered by ReactMarkdown)
    const t = setTimeout(collect, 50)

    // progress handler
    const onScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      if (total <= 0) { setProgress(100); return }
      const scrolled = Math.min(Math.max(-rect.top, 0), total)
      setProgress(Math.floor((scrolled / total) * 100))
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', collect)

    onScroll()

    return () => {
      clearTimeout(t)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', collect)
    }
  }, [content])

  // slugify helper for headings
  const slugify = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

  // custom heading renderers to ensure ids exist
  const HeadingRenderer = (level: number) => ({ node, children }: any) => {
    const text = children.join ? children.join('') : String(children)
    const id = slugify(text)
    const Tag = `h${level}` as any
    return <Tag id={id} className={level === 2 ? 'scroll-mt-24' : 'scroll-mt-20'}>{children}</Tag>
  }

  // Use react-markdown + remark-gfm for structured markdown rendering
  const formatContent = (text: string) => {
    return (
      <div ref={containerRef}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSanitize as any, rehypeHighlight as any]}
          components={{
            h2: HeadingRenderer(2),
            h3: HeadingRenderer(3),
            h4: HeadingRenderer(4),
            code({ node, inline, className, children, ...props }) {
              return inline ? (
                <code className="bg-zinc-900 px-1 rounded text-amber-300 text-sm" {...props}>{children}</code>
              ) : (
                <pre className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4 overflow-x-auto text-sm" {...props}><code className={className}>{children}</code></pre>
              )
            }
          }}
          className={blogProseClasses}
        >
          {text}
        </ReactMarkdown>
      </div>
    )
  }

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <div className="flex items-start gap-8">
          <div className="flex-1 max-w-3xl">
            <Link href="/blog" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[var(--color-neon-blue)] transition-colors mb-6">
              <FaArrowLeft /> {language === 'id' ? 'Kembali ke Blog' : 'Back to Blog'}
            </Link>

            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-[var(--color-neon-blue)]/20 text-[var(--color-neon-blue)] border border-[var(--color-neon-blue)]/30">
                  {post.category}
                </span>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                  <FaCalendarAlt />
                  <span>{date} • {readTime}</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-5xl font-heading font-bold mb-6 leading-tight">
                {title}
              </h1>

              <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-1 mb-6">
                <Image
                  src={post.thumbnail || "/og-image.jpg"}
                  alt={title}
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>

              {/* progress bar */}
              <div className="w-full h-1 bg-zinc-800 rounded overflow-hidden mb-6">
                <div className="h-1 bg-gradient-to-r from-emerald-400 to-cyan-400" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Content */}
            <div className="max-w-none mt-6">
              {formatContent(content)}
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

          {/* TOC sidebar for md+ */}
          <aside className="hidden lg:block w-72 sticky top-32 h-[calc(100vh-8rem)] overflow-auto">
            <div className="p-4 bg-white/5 border border-zinc-800 rounded-lg">
              <div className="text-sm text-zinc-400 mb-3">{language === 'id' ? 'Daftar Isi' : 'On this page'}</div>
              <div className="flex flex-col gap-2">
                {toc.length === 0 && <div className="text-xs text-zinc-500">{language === 'id' ? 'Tidak ada sub-judul' : 'No headings found'}</div>}
                {toc.map((t) => (
                  <a key={t.id} href={`#${t.id}`} className={`text-sm hover:text-[var(--color-neon-blue)] ${t.level === 2 ? 'font-medium' : 'pl-4 text-zinc-400'}`}>{t.text}</a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
