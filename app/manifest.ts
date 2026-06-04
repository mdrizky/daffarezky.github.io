import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Muhammad Daffa Rezky Adyra | TKJ Developer & IoT Enthusiast",
    short_name: "Daffa Rizky",
    description:
      "Siswa TKJ, Web Developer, IoT Enthusiast, dan Founder Project Siaga+.",
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
