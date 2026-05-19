"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import {
  FaProjectDiagram,
  FaTools,
  FaEnvelope,
  FaBlog,
  FaStar,
  FaGraduationCap,
} from "react-icons/fa";

interface Stat {
  label_id: string;
  label_en: string;
  value: number;
  suffix?: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const ref = useRef<number>(0);

  useEffect(() => {
    if (target === 0) return;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        ref.current = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };
    ref.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(ref.current);
  }, [target, duration]);

  return count;
}

function StatCard({
  stat,
  language,
  animate,
}: {
  stat: Stat;
  language: string;
  animate: boolean;
}) {
  const count = useCountUp(animate ? stat.value : 0);

  return (
    <div
      className={`group bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(0,153,255,0.1)] transition-all duration-300 hover:-translate-y-1`}
    >
      <div
        className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center transition-transform group-hover:scale-110`}
      >
        <span className={`text-xl ${stat.color}`}>{stat.icon}</span>
      </div>
      <div>
        <div className="text-3xl font-heading font-bold text-gray-900 dark:text-white tabular-nums">
          {count}
          {stat.suffix}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
          {language === "id" ? stat.label_id : stat.label_en}
        </div>
      </div>
    </div>
  );
}

interface StatsCounterProps {
  language: string;
}

export default function StatsCounter({ language }: StatsCounterProps) {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projects, skills, messages, blogs, testimonials, education] =
          await Promise.all([
            supabase
              .from("projects")
              .select("*", { count: "exact", head: true }),
            supabase
              .from("skills")
              .select("*", { count: "exact", head: true }),
            supabase
              .from("messages")
              .select("*", { count: "exact", head: true }),
            supabase
              .from("blog_posts")
              .select("*", { count: "exact", head: true }),
            supabase
              .from("testimonials")
              .select("*", { count: "exact", head: true }),
            supabase
              .from("education")
              .select("*", { count: "exact", head: true }),
          ]);

        setStats([
          {
            label_id: "Project Selesai",
            label_en: "Projects Done",
            value: projects.count || 0,
            suffix: "+",
            icon: <FaProjectDiagram />,
            color: "text-blue-500",
            bg: "bg-blue-50 dark:bg-blue-500/10",
          },
          {
            label_id: "Skills & Tools",
            label_en: "Skills & Tools",
            value: skills.count || 0,
            suffix: "+",
            icon: <FaTools />,
            color: "text-cyan-500",
            bg: "bg-cyan-50 dark:bg-cyan-500/10",
          },
          {
            label_id: "Pesan Masuk",
            label_en: "Messages",
            value: messages.count || 0,
            icon: <FaEnvelope />,
            color: "text-amber-500",
            bg: "bg-amber-50 dark:bg-amber-500/10",
          },
          {
            label_id: "Artikel Blog",
            label_en: "Blog Articles",
            value: blogs.count || 0,
            icon: <FaBlog />,
            color: "text-green-500",
            bg: "bg-green-50 dark:bg-green-500/10",
          },
          {
            label_id: "Testimoni",
            label_en: "Testimonials",
            value: testimonials.count || 0,
            suffix: "+",
            icon: <FaStar />,
            color: "text-purple-500",
            bg: "bg-purple-50 dark:bg-purple-500/10",
          },
          {
            label_id: "Riwayat Pendidikan",
            label_en: "Education History",
            value: education.count || 0,
            icon: <FaGraduationCap />,
            color: "text-rose-500",
            bg: "bg-rose-50 dark:bg-rose-500/10",
          },
        ]);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Trigger count-up animation when section enters viewport
  useEffect(() => {
    if (loading || stats.length === 0) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [loading, stats]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-2xl bg-gray-100 dark:bg-white/5 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
    >
      {stats.map((stat, i) => (
        <StatCard key={i} stat={stat} language={language} animate={animate} />
      ))}
    </div>
  );
}
