import Image from "next/image";
import Link from "next/link";
import { FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import type { BlogPost } from "@/types";

export default function BlogCard({ post }: { post: BlogPost }) {
  const date = new Date(post.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <Link href={`/blog/${post.slug}`} className="block h-full">
      <div className="glass rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,153,255,0.2)] hover:-translate-y-2 flex flex-col h-full">
        {/* Thumbnail */}
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={post.thumbnail || "/og-image.jpg"}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4 z-20 px-3 py-1 text-xs font-bold rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white">
            {post.category}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
            <FaCalendarAlt />
            <span>{date}</span>
          </div>
          
          <h3 className="text-lg font-heading font-bold mb-3 group-hover:text-[var(--color-neon-blue)] transition-colors line-clamp-2">
            {post.title}
          </h3>
          
          <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-grow">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-2 text-[var(--color-neon-blue)] text-sm font-medium mt-auto group-hover:gap-3 transition-all">
            Baca Selengkapnya <FaArrowRight />
          </div>
        </div>
      </div>
    </Link>
  );
}
