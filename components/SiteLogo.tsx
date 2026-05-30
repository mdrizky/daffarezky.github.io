"use client";

import Image from "next/image";
import Link from "next/link";

interface SiteLogoProps {
  /** Size of the logo container in pixels (default: 40) */
  size?: number;
  /** Show the name text next to the logo (default: true) */
  showName?: boolean;
  /** Override the href (default: "/") */
  href?: string;
  /** Extra className for the wrapper */
  className?: string;
  /** Text size class for the name (default: "text-xl") */
  textSize?: string;
}

export default function SiteLogo({
  size = 40,
  showName = true,
  href = "/",
  className = "",
  textSize = "text-xl",
}: SiteLogoProps) {
  const name = "Daffa Rizky";
  // Cache busting version - increment this number when logo changes
  const logoUrl = "/logo.png?v=3";

  return (
    <Link href={href} className={`flex items-center gap-2 group ${className}`}>
      <div
        className="relative flex-shrink-0 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(0,255,136,0.4)] transition-transform group-hover:scale-105"
        style={{ width: size, height: size }}
      >
        <Image
          src={logoUrl}
          alt={`${name} Logo`}
          fill
          className="object-cover"
          sizes={`${size}px`}
          priority
        />
      </div>

      {showName && (
        <span
          className={`font-heading font-bold ${textSize} text-gray-900 dark:text-white hidden sm:block`}
        >
          {name}
        </span>
      )}
    </Link>
  );
}
