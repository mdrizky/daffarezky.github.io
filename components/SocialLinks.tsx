import React from "react";
import { FaWhatsapp, FaInstagram, FaGithub, FaLinkedin, FaTiktok, FaYoutube } from "react-icons/fa";

type SocialLinksProps = {
  variant?: "icon-only" | "with-label" | "floating";
  className?: string;
};

export default function SocialLinks({ variant = "icon-only", className = "" }: SocialLinksProps) {
  const socialMedia = [
    {
      name: "WhatsApp",
      icon: <FaWhatsapp size={24} />,
      color: "#25D366",
      url: "https://wa.me/6281374936621",
    },
    {
      name: "Instagram",
      icon: <FaInstagram size={24} />,
      color: "#E1306C", // We can use gradient in classes, but for simplicity we'll handle it via className or style
      url: "https://instagram.com/m.daffarizkyy_",
      customClass: "hover:text-[#E1306C]",
    },
    {
      name: "GitHub",
      icon: <FaGithub size={24} />,
      color: "#FFFFFF",
      url: "https://github.com/daffarezky",
      customClass: "hover:text-gray-400",
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin size={24} />,
      color: "#0077B5",
      url: "https://linkedin.com",
      customClass: "hover:text-[#0077B5]",
    },
    {
      name: "TikTok",
      icon: <FaTiktok size={24} />,
      color: "#FFFFFF",
      url: "https://tiktok.com/@daffarizky_",
      customClass: "hover:text-gray-300",
    },
    {
      name: "YouTube",
      icon: <FaYoutube size={24} />,
      color: "#FF0000",
      url: "https://youtube.com",
      customClass: "hover:text-[#FF0000]",
    },
  ];

  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {socialMedia.map((social, index) => (
        <a
          key={index}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 transition-all duration-300 hover:-translate-y-1 ${
            social.customClass || ""
          }`}
          aria-label={social.name}
        >
          <span 
            className="flex items-center justify-center p-2 rounded-full glass hover:scale-110 transition-transform"
            style={social.name === "WhatsApp" ? { color: social.color } : {}}
          >
            {social.icon}
          </span>
          {variant === "with-label" && (
            <span className="text-sm font-medium">{social.name}</span>
          )}
        </a>
      ))}
    </div>
  );
}
