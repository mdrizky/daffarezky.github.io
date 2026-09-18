'use client'

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/LanguageProvider";
import { FaPaperPlane, FaUser, FaClock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import NewsletterForm from "@/components/NewsletterForm";
import type { GuestbookEntry } from "@/types";

export default function GuestbookClient() {
  const { language } = useLanguage();
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const t = {
    title: language === 'id' ? 'Buku Tamu' : 'Guestbook',
    subtitle: language === 'id' ? 'Tinggalkan jejak, sapaan hangat, atau masukan untuk portfolio ini!' : 'Leave a note, friendly greeting, or feedback on this portfolio!',
    namePlaceholder: language === 'id' ? 'Nama Anda' : 'Your Name',
    messagePlaceholder: language === 'id' ? 'Tuliskan pesan Anda di sini...' : 'Write your message here...',
    send: language === 'id' ? 'Kirim Catatan' : 'Post Note',
    sending: language === 'id' ? 'Mengirim...' : 'Sending...',
    success: language === 'id' ? 'Pesan terkirim! Akan tampil setelah ditinjau oleh admin.' : 'Message sent! It will appear after moderation review.',
    error: language === 'id' ? 'Gagal mengirim pesan. Silakan coba lagi.' : 'Failed to send message. Please try again.',
    noEntries: language === 'id' ? 'Belum ada pesan. Jadilah yang pertama mengisi buku tamu!' : 'No entries yet. Be the first one to sign the guestbook!',
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const { data } = await supabase
        .from("guestbook")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });
      
      if (data) setEntries(data);
    } catch (err) {
      console.error("Error loading guestbook:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setSubmitting(true);
    setStatusMessage(null);
    try {
      const { error } = await supabase
        .from("guestbook")
        .insert([{ name: name.trim(), message: message.trim(), is_approved: false }]);

      if (error) {
        setStatusMessage({ type: 'error', text: t.error });
      } else {
        setStatusMessage({ type: 'success', text: t.success });
        setName("");
        setMessage("");
      }
    } catch {
      setStatusMessage({ type: 'error', text: t.error });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Digital Guestbook</Badge>
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 text-foreground tracking-tight">
              {t.title}
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          {/* Form Section */}
          <Card className="p-8 md:p-10 mb-16 shadow-xl bg-card border-border">
            <h3 className="font-heading font-bold text-2xl mb-2 text-foreground">
              {language === 'id' ? 'Tanda Tangani Buku Tamu' : 'Sign the Guestbook'}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {language === 'id'
                ? 'Pesan Anda akan diverifikasi untuk menjaga komunitas tetap ramah dan bebas spam.'
                : 'Your message will be reviewed to keep the space friendly and spam-free.'}
            </p>

            {statusMessage && (
              <div
                className={`p-4 rounded-xl mb-6 flex items-center gap-3 text-sm font-medium ${
                  statusMessage.type === 'success'
                    ? 'bg-primary/10 border border-primary/20 text-primary'
                    : 'bg-destructive/10 border border-destructive/20 text-destructive'
                }`}
              >
                {statusMessage.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
                <span>{statusMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-foreground">
                  {t.namePlaceholder}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex"
                  required
                  className="w-full bg-background border border-input rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-foreground">
                  {t.messagePlaceholder}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.messagePlaceholder}
                  required
                  rows={4}
                  className="w-full bg-background border border-input rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full py-4 text-base font-bold flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    {t.sending}
                  </>
                ) : (
                  <>
                    <FaPaperPlane /> {t.send}
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Entries Section */}
          <div className="mb-20">
            <h3 className="font-heading font-bold text-2xl mb-8 text-foreground">
              {language === 'id' ? 'Catatan Pengunjung' : 'Visitor Messages'} ({entries.length})
            </h3>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-16 bg-card border border-border rounded-2xl text-muted-foreground">
                <p>{t.noEntries}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <Card key={entry.id} className="bg-card hover:border-primary/40 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                          <FaUser />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground">{entry.name}</h4>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <FaClock size={10} />
                            <span>
                              {new Date(entry.created_at).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed pl-13">
                        &quot;{entry.message}&quot;
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Newsletter Section */}
          <div className="mt-16">
            <NewsletterForm />
          </div>
        </div>
      </Container>
    </div>
  );
}
