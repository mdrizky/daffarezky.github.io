import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import type { BlogPost } from "@/types";
import { Metadata } from "next";
import BlogDetailClient from "./BlogDetailClient";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).single();
  
  if (!data) return { title: "Not Found" };
  
  return {
    title: `${data.title_id} | Blog Daffa Rizky`,
    description: data.excerpt_id,
    openGraph: {
      title: data.title_id,
      description: data.excerpt_id,
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

  const { data: relatedPosts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("category", post.category)
    .neq("id", post.id)
    .limit(3);

  return <BlogDetailClient post={post} relatedPosts={(relatedPosts as BlogPost[]) || []} />;
}
