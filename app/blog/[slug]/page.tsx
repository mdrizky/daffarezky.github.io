import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { FaCalendarAlt, FaArrowLeft } from "react-icons/fa";
import type { BlogPost } from "@/types";
import { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).single();
  
  if (!data) return { title: "Not Found" };
  
  return {
    title: `${data.title} | Blog Daffa Rizky`,
    description: data.excerpt,
    openGraph: {
      title: data.title,
      description: data.excerpt,
      images: [{ url: data.thumbnail || "/og-image.jpg" }]
    }
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: postData } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!postData) {
    notFound();
  }

  const post = postData as BlogPost;

  // Fetch related posts (same category, excluding current)
  const { data: relatedPosts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("category", post.category)
    .neq("id", post.id)
    .limit(3);

  const date = new Date(post.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-[var(--color-neon-blue)] transition-colors mb-8">
          <FaArrowLeft /> Kembali ke Blog
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-[var(--color-neon-blue)]/20 text-[var(--color-neon-blue)] border border-[var(--color-neon-blue)]/30">
              {post.category}
            </span>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <FaCalendarAlt />
              <span>{date}</span>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-heading font-bold mb-8 leading-tight">
            {post.title}
          </h1>

          <div className="relative aspect-video w-full rounded-3xl overflow-hidden glass p-1">
            <Image
              src={post.thumbnail || "/og-image.jpg"}
              alt={post.title}
              fill
              className="object-cover rounded-2xl"
            />
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none prose-headings:font-heading prose-headings:text-white prose-a:text-[var(--color-neon-blue)] hover:prose-a:text-[var(--color-neon-green)] prose-img:rounded-2xl">
          {/* Note: In a real app, use a markdown parser like react-markdown. 
              Assuming content is HTML from a rich text editor for simplicity here. */}
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* CTA Follow */}
        <div className="mt-16 p-8 glass rounded-3xl text-center flex flex-col items-center">
          <h3 className="text-2xl font-bold mb-2">Suka artikel ini?</h3>
          <p className="text-gray-400 mb-6">Dapatkan lebih banyak insight dan tips menarik di Instagram saya.</p>
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
          <div className="mt-24 border-t border-white/10 pt-16">
            <h2 className="text-3xl font-heading font-bold mb-8">Artikel <span className="text-gradient">Terkait</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} className="group">
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-4">
                    <Image
                      src={relatedPost.thumbnail || "/og-image.jpg"}
                      alt={relatedPost.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="font-bold text-lg group-hover:text-[var(--color-neon-blue)] transition-colors line-clamp-2">
                    {relatedPost.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
