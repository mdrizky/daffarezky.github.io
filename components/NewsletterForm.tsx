'use client'

import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { FaPaperPlane, FaEnvelope, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function NewsletterForm() {
  const { language } = useLanguage();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const t = {
    title: language === 'id' ? 'Langganan Newsletter' : 'Subscribe to Newsletter',
    description: language === 'id' 
      ? 'Dapatkan rangkuman artikel terbaru, studi kasus proyek, dan tips rekayasa perangkat lunak langsung ke email Anda.' 
      : 'Get latest articles, engineering case studies, and insights delivered straight to your inbox.',
    placeholder: language === 'id' ? 'Masukkan email Anda' : 'Enter your email',
    button: language === 'id' ? 'Berlangganan' : 'Subscribe',
    loading: language === 'id' ? 'Memproses...' : 'Subscribing...',
    success: language === 'id' ? 'Terima kasih telah berlangganan! Periksa email Anda.' : 'Thank you for subscribing! Check your inbox.',
    error: language === 'id' ? 'Gagal berlangganan. Silakan coba lagi.' : 'Failed to subscribe. Please try again.',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (res.ok) {
        setStatus('success');
        setEmail("");
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <Card className="bg-card border-border shadow-md">
      <CardContent className="p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg">
            <FaEnvelope />
          </div>
          <h3 className="text-xl font-heading font-bold text-foreground">{t.title}</h3>
        </div>
        
        <p className="text-muted-foreground mb-6 text-sm leading-relaxed max-w-xl">
          {t.description}
        </p>

        {status === 'success' ? (
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl text-primary text-sm font-medium flex items-center gap-2">
            <FaCheckCircle className="shrink-0" />
            <span>{t.success}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.placeholder}
              required
              className="flex-1 bg-background border border-input rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground"
            />
            <Button
              type="submit"
              disabled={status === 'loading'}
              className="shrink-0 flex items-center justify-center gap-2 py-3 px-6"
            >
              {status === 'loading' ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  {t.loading}
                </>
              ) : (
                <>
                  <FaPaperPlane /> {t.button}
                </>
              )}
            </Button>
          </form>
        )}
        
        {status === 'error' && (
          <p className="mt-3 text-xs text-destructive flex items-center gap-1.5 font-medium">
            <FaExclamationCircle /> {t.error}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
