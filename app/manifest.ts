import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
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
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/favicon.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
