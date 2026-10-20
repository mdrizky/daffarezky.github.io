import type { Certificate } from "@/types";

export type CertificateWithDescription = Certificate & {
  description_id?: string;
  description_en?: string;
};

// Intelligent helper to safely detect certificate category with 100% backward compatibility
export function getCertificateCategory(cert: Partial<Certificate>): 'Keagamaan' | 'Umum & Teknologi' {
  if (cert.category) {
    const cat = cert.category.toLowerCase().trim();
    if (cat.includes('agama') || cat.includes('islam') || cat.includes('qur') || cat.includes('arab')) {
      return 'Keagamaan';
    }
    return 'Umum & Teknologi';
  }

  // Intelligent fallback for legacy items based on keywords
  const text = `${cert.title_id || ''} ${cert.title_en || ''} ${cert.issuer || ''} ${(cert as Record<string, unknown>).description_id || ''}`.toLowerCase();
  if (
    text.includes('tahfidz') || 
    text.includes('qur') || 
    text.includes('tasheel') || 
    text.includes('arab') || 
    text.includes('islam') ||
    text.includes('ashabul') ||
    text.includes('ma\'had') ||
    text.includes('syahadah')
  ) {
    return 'Keagamaan';
  }
  return 'Umum & Teknologi';
}

export const defaultCertificatesList: CertificateWithDescription[] = [
  { 
    id: "cert-dicoding-1", 
    title_id: "Dicoding — Dasar-Dasar Literasi Keuangan", 
    title_en: "Dicoding — Financial Literacy Fundamentals", 
    issuer: "Dicoding", 
    category: "Umum & Teknologi",
    tags: ["Kompetensi", "Literasi Digital"],
    image_url: "/assets/certificates/dicoding-financial-literacy.svg",
    file_url: "/assets/certificates/Financial Literacy 101.pdf", 
    date_issued: "23 September 2025",
    description_id: "Sertifikat kelulusan kompetensi literasi finansial dan teknologi dari Dicoding Indonesia.",
    description_en: "Official financial and tech literacy competence certification from Dicoding Indonesia."
  },
  { 
    id: "cert-tasheel-1", 
    title_id: "Tasheel — Uji Kemampuan Bahasa Arab", 
    title_en: "Tasheel — Arabic Proficiency Test", 
    issuer: "Tasheel", 
    category: "Keagamaan",
    tags: ["Kompetensi", "Bahasa Arab"],
    image_url: "/assets/certificates/sertifikat-tasheel.jpg",
    file_url: "/assets/certificates/sertifikat-tasheel.pdf", 
    date_issued: "03 Januari 2026",
    description_id: "Sertifikat uji kemampuan Bahasa Arab dengan skor sempurna 100/100 untuk beasiswa Timur Tengah.",
    description_en: "Arabic proficiency certification with a perfect score 100/100 for Middle East scholarships."
  },
  { 
    id: "cert-tasheel-2", 
    title_id: "Surat Rekomendasi Tasheel Timur Tengah", 
    title_en: "Tasheel Middle East Recommendation Letter", 
    issuer: "Tasheel", 
    category: "Keagamaan",
    tags: ["Akademik", "Rekomendasi"],
    image_url: "/assets/certificates/surat-rekomendasi-tasheel.jpg",
    file_url: "/assets/certificates/surat-rekomendasi-tasheel.pdf", 
    date_issued: "03 Januari 2026",
    description_id: "Surat rekomendasi akademik resmi dari Asrama Tahfidz Yumna dan Platform Tasheel.",
    description_en: "Official academic recommendation letter from Tahfidz Yumna and Tasheel Platform."
  },
  { 
    id: "cert-tahfidz-1", 
    title_id: "Juara 1 Musabaqah Tahfidz Qur'an 3 Juz", 
    title_en: "1st Place 3 Juz Qur'an Memorization Contest", 
    issuer: "Ashabul Qur'an", 
    category: "Keagamaan",
    tags: ["Prestasi", "Tahfidz"],
    image_url: "/assets/certificates/sertifikat-tahfidz-quran.jpg",
    file_url: "/assets/certificates/Document 15.pdf", 
    date_issued: "15 Sya'ban 1445 H",
    description_id: "Syahadah Syukr wa Taqdir Juara I lomba Tahfidz Al-Qur'an 3 Juz Ma'had Ashabul Qur'an.",
    description_en: "1st Place certificate in 3 Juz Qur'an memorization competition at Ashabul Qur'an Institute."
  },
  { 
    id: "cert-digitalent-1", 
    title_id: "Digitalent — AI Engineer For Milenial", 
    title_en: "Digitalent — AI Engineer For Milenial", 
    issuer: "Kominfo", 
    category: "Umum & Teknologi",
    tags: ["Pelatihan", "AI & Automation"],
    image_url: "/assets/certificates/digitalent-ai-engineer.svg",
    file_url: "/assets/certificates/ai-engineer-milenial.pdf", 
    date_issued: "2024",
    description_id: "Sertifikat pelatihan kecerdasan buatan dari Digital Talent Scholarship Kementerian Kominfo RI.",
    description_en: "AI Engineer training certification from Ministry of Communications and Informatics (Kominfo)."
  },
  { 
    id: "cert-digitalent-2", 
    title_id: "Digitalent — Ethical Hacker For Dummies", 
    title_en: "Digitalent — Ethical Hacker For Dummies", 
    issuer: "Kominfo", 
    category: "Umum & Teknologi",
    tags: ["Kompetensi", "Cybersecurity"],
    image_url: "/assets/certificates/digitalent-ethical-hacker.svg",
    file_url: "/assets/certificates/ethical-hacker-dummies.pdf", 
    date_issued: "2024",
    description_id: "Sertifikasi keahlian keamanan siber dan penetration testing dasar dari Kominfo DTS.",
    description_en: "Cyber security & foundational ethical hacking certification from Kominfo DTS."
  },
  { 
    id: "cert-digitalent-3", 
    title_id: "Produk Digital dan Desain Grafis", 
    title_en: "Digital Products & Graphic Design", 
    issuer: "Kominfo", 
    category: "Umum & Teknologi",
    tags: ["Pelatihan", "Digital Product"],
    image_url: "/assets/certificates/digitalent-digital-products.svg",
    file_url: "/assets/certificates/digital-products-graphic-design.pdf", 
    date_issued: "2024",
    description_id: "Pelatihan pengembangan produk digital dan fondasi desain grafis interaktif dari Kominfo.",
    description_en: "Digital product development and graphic design training from Kominfo."
  },
];
