'use client'

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/LanguageProvider";
import { PageSkeleton } from "@/components/ui/Skeleton";
import type { BlogPost } from "@/types";

// Lazy load the search/filter client — not needed for initial paint
const BlogClient = dynamic(() => import("./BlogClient"), {
  loading: () => <PageSkeleton />,
  ssr: false,
});

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await supabase
          .from("blog_posts")
          .select("*")
          .order("created_at", { ascending: false });

        if (data) {
          setPosts(data);
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 text-gray-900 dark:text-white">
            Blog & <span className="text-gradient">{language === 'id' ? 'Artikel' : 'Articles'}</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            {language === 'id'
              ? 'Insight, tips, dan cerita seputar dunia digital marketing, pengembangan website, dan strategi bisnis.'
              : 'Insights, tips, and stories around the digital marketing world, web development, and business strategy.'}
          </p>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          {loading ? <PageSkeleton /> : <BlogClient initialPosts={posts} />}
        </div>
      </div>
    </div>
  );
}
