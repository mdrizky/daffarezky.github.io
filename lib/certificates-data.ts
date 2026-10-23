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

export const defaultCertificatesList: CertificateWithDescription[] = [];

