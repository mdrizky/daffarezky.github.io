'use client'

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/LanguageProvider";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import type { BlogPost } from "@/types";

// Lazy load the search/filter client
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
          .eq("is_published", true)
          .eq("status", "published")
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
      <Container>
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <Badge variant="outline" className="mb-4">
            {language === 'id' ? 'Artikel & Pemikiran' : 'Articles & Insights'}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 text-foreground tracking-tight">
            Blog & <span className="text-gradient">{language === 'id' ? 'Artikel' : 'Insights'}</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {language === 'id'
              ? 'Insight, tips teknis, dan cerita pengalaman seputar arsitektur web modern, kecerdasan buatan, dan digital product development.'
              : 'Technical insights, best practices, and stories on modern web architecture, artificial intelligence, and digital products.'}
          </p>
        </div>

        <div>
          {loading ? <PageSkeleton /> : <BlogClient initialPosts={posts} />}
        </div>
      </Container>
    </div>
  );
}
