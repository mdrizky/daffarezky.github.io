import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://daffa-portfolio.vercel.app';

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Daffa Rizky | Blog</title>
  <link>${siteUrl}/blog</link>
  <description>Insight, tips, dan cerita seputar dunia digital marketing, pengembangan website, dan strategi bisnis.</description>
  <language>id-ID</language>
  <atom:link href="${siteUrl}/api/rss" rel="self" type="application/rss+xml" />
  ${posts?.map((post) => `
  <item>
    <title><![CDATA[${post.title_id}]]></title>
    <link>${siteUrl}/blog/${post.slug}</link>
    <guid>${siteUrl}/blog/${post.slug}</guid>
    <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
    <description><![CDATA[${post.excerpt_id}]]></description>
  </item>`).join('')}
</channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
