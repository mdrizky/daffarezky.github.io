import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import type { BlogPost } from "@/types";
import { Metadata } from "next";
import BlogDetailClient from "./BlogDetailClient";

export const revalidate = 3600;

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://daffa-portfolio.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!data) return { title: "Not Found" };

  // Build dynamic OG image URL
  const ogImageUrl = new URL(`${siteUrl}/og`);
  ogImageUrl.searchParams.set("title", data.title_id);
  ogImageUrl.searchParams.set("description", data.excerpt_id || "");
  ogImageUrl.searchParams.set("category", data.category || "");
  ogImageUrl.searchParams.set("type", "blog");

  return {
    title: `${data.title_id} | Blog Daffa Rizky`,
    description: data.excerpt_id,
    alternates: {
      canonical: `${siteUrl}/blog/${slug}`,
    },
    openGraph: {
      title: data.title_id,
      description: data.excerpt_id,
      url: `${siteUrl}/blog/${slug}`,
      type: "article",
      publishedTime: data.created_at,
      tags: [data.category],
      images: [
        {
          // Use thumbnail if available, otherwise use dynamic OG image
          url: data.thumbnail || ogImageUrl.toString(),
          width: 1200,
          height: 630,
          alt: data.title_id,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: data.title_id,
      description: data.excerpt_id,
      images: [data.thumbnail || ogImageUrl.toString()],
    },
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

  const { data: relatedPosts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("category", post.category)
    .neq("id", post.id)
    .limit(3);

  return <BlogDetailClient post={post} relatedPosts={(relatedPosts as BlogPost[]) || []} />;
}
