'use client'

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/LanguageProvider";
import { FaPaperPlane, FaUser, FaClock, FaCommentDots } from "react-icons/fa";
import type { BlogComment } from "@/types";

export default function BlogComments({ postId }: { postId: string }) {
  const { language } = useLanguage();
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const t = {
    title: language === 'id' ? 'Komentar' : 'Comments',
    namePlaceholder: language === 'id' ? 'Nama' : 'Name',
    emailPlaceholder: language === 'id' ? 'Email (tidak ditampilkan)' : 'Email (not shown)',
    commentPlaceholder: language === 'id' ? 'Tulis komentar...' : 'Write a comment...',
    send: language === 'id' ? 'Kirim Komentar' : 'Post Comment',
    sending: language === 'id' ? 'Mengirim...' : 'Posting...',
    success: language === 'id' ? 'Komentar terkirim! Menunggu persetujuan admin.' : 'Comment sent! Waiting for admin approval.',
    error: language === 'id' ? 'Gagal mengirim komentar.' : 'Failed to post comment.',
    noComments: language === 'id' ? 'Belum ada komentar.' : 'No comments yet.',
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    const { data } = await supabase
      .from("blog_comments")
      .select("*")
      .eq("post_id", postId)
      .eq("is_approved", true)
      .order("created_at", { ascending: true });
    
    if (data) setComments(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !content) return;

    setSubmitting(true);
    const { error } = await supabase
      .from("blog_comments")
      .insert([{ post_id: postId, name, email, content, is_approved: false }]);

    if (error) {
      alert(t.error);
    } else {
      alert(t.success);
      setName("");
      setEmail("");
      setContent("");
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-20">
      <h2 className="text-2xl font-heading font-bold mb-8 text-gray-900 dark:text-white flex items-center gap-3">
        <FaCommentDots className="text-blue-500" />
        {t.title} ({comments.length})
      </h2>

      {/* Form */}
      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 mb-12">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.namePlaceholder}
              required
              className="bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl py-2 px-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              required
              className="bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl py-2 px-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t.commentPlaceholder}
            required
            rows={3}
            className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl py-3 px-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
          ></textarea>
          <button
            type="submit"
            disabled={submitting}
            className="bg-gradient-neon text-[#0A0A0F] px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
          >
            {submitting ? t.sending : <><FaPaperPlane /> {t.send}</>}
          </button>
        </form>
      </div>

      {/* List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">{t.noComments}</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-400 shrink-0">
                <FaUser />
              </div>
              <div className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">{comment.name}</h4>
                  <span className="text-[10px] text-gray-500 flex items-center gap-1">
                    <FaClock />
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
