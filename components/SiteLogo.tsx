"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

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

// Shared cache so all instances share one fetch
let cachedLogo: { logoUrl: string | null; name: string } | null = null;
let fetchPromise: Promise<void> | null = null;

export default function SiteLogo({
  size = 40,
  showName = true,
  href = "/",
  className = "",
  textSize = "text-xl",
}: SiteLogoProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(cachedLogo?.logoUrl ?? null);
  const [name, setName] = useState<string>(cachedLogo?.name ?? "Daffa Rizky");

  useEffect(() => {
    if (cachedLogo) {
      setLogoUrl(cachedLogo.logoUrl);
      setName(cachedLogo.name);
      return;
    }

    if (!fetchPromise) {
      fetchPromise = Promise.resolve(
        supabase
          .from("profile")
          .select("name, logo_url")
          .limit(1)
          .single()
      ).then(({ data }) => {
        cachedLogo = {
          logoUrl: data?.logo_url ?? null,
          name: data?.name ?? "Daffa Rizky",
        };
      }).catch(() => {
        cachedLogo = { logoUrl: null, name: "Daffa Rizky" };
      });
    }

    fetchPromise.then(() => {
      if (cachedLogo) {
        setLogoUrl(cachedLogo.logoUrl);
        setName(cachedLogo.name);
      }
    });
  }, []);

  const getInitials = (n: string) =>
    n
      .split(" ")
      .map((w) => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

  return (
    <Link href={href} className={`flex items-center gap-2 group ${className}`}>
      <div
        className="relative flex-shrink-0 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(0,255,136,0.4)] transition-transform group-hover:scale-105"
        style={{ width: size, height: size }}
      >
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={`${name} Logo`}
            fill
            className="object-cover"
            sizes={`${size}px`}
            priority
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#00FF88] to-[#0099FF] text-white font-heading font-bold"
            style={{ fontSize: size * 0.38 }}
          >
            {getInitials(name)}
          </div>
        )}
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

/**
 * Call this after uploading a new logo to invalidate the in-memory cache
 * so all SiteLogo instances re-fetch on next render.
 */
export function invalidateSiteLogoCache() {
  cachedLogo = null;
  fetchPromise = null;
}
