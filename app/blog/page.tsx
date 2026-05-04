import { createClient } from "@/lib/supabase-server";
import BlogClient from "./BlogClient";
import type { BlogPost } from "@/types";

export const revalidate = 3600;

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: postsData } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  const posts = postsData as BlogPost[] || [];

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">
            Blog & <span className="text-gradient">Artikel</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Insight, tips, dan cerita seputar dunia digital marketing, pengembangan website, dan strategi bisnis.
          </p>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <BlogClient initialPosts={posts} />
        </div>
      </div>
    </div>
  );
}
