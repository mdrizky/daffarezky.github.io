import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase-server";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  let logoUrl = "/logo.png";
  try {
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profile")
      .select("logo_url")
      .limit(1)
      .maybeSingle();

    if (profile?.logo_url && profile.logo_url.trim()) {
      logoUrl = profile.logo_url.trim();
    }
  } catch {
    // fallback to /logo.png
  }

  return {
    name: "Muhammad Daffa Rezky Adyra | Developer & Technology Enthusiast",
    short_name: "Daffa Rezky",
    description:
      "Portfolio resmi Muhammad Daffa Rezky Adyra. Menampilkan proyek unggulan, teknologi yang dikuasai, serta pengalaman membangun aplikasi dan solusi digital yang berdampak.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0F",
    theme_color: "#00FF88",
    orientation: "portrait",
    icons: [
      {
        src: logoUrl,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: logoUrl,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
