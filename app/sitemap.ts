import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase-server";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://portofolio-daffarezky.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/tentang`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/pengalaman`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/skills`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/certificates`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/kontak`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/guestbook`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/uses`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/cv`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  try {
    const supabase = await createClient();
    const [postsRes, projectsRes] = await Promise.all([
      supabase.from("blog_posts").select("slug, updated_at, created_at").eq("is_published", true).eq("status", "published"),
      supabase.from("projects").select("slug, updated_at, created_at").eq("is_published", true),
    ]);

    const postRoutes: MetadataRoute.Sitemap = (postsRes.data || [])
      .filter((p) => p.slug)
      .map((p) => ({
        url: `${siteUrl}/blog/${p.slug}`,
        lastModified: new Date(p.updated_at || p.created_at || new Date()),
        changeFrequency: "weekly",
        priority: 0.7,
      }));

    const projectRoutes: MetadataRoute.Sitemap = (projectsRes.data || [])
      .filter((p) => p.slug)
      .map((p) => ({
        url: `${siteUrl}/projects/${p.slug}`,
        lastModified: new Date(p.updated_at || p.created_at || new Date()),
        changeFrequency: "weekly",
        priority: 0.8,
      }));

    return [...staticRoutes, ...projectRoutes, ...postRoutes];
  } catch {
    return staticRoutes;
  }
}
