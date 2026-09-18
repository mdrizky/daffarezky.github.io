import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

/** Single skeleton shimmer block */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className
      )}
    />
  );
}

/** Full-page skeleton for public pages */
export function PageSkeleton() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 md:px-12">
        {/* Page header */}
        <div className="text-center mb-16 space-y-4">
          <Skeleton className="h-14 w-80 mx-auto" />
          <Skeleton className="h-5 w-96 mx-auto" />
          <Skeleton className="h-5 w-72 mx-auto" />
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Single card skeleton */
export function CardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/** Blog detail skeleton */
export function BlogDetailSkeleton() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        {/* Back link */}
        <Skeleton className="h-5 w-36 mb-8" />

        {/* Category + date */}
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>

        {/* Title */}
        <Skeleton className="h-12 w-full mb-3" />
        <Skeleton className="h-12 w-4/5 mb-8" />

        {/* Thumbnail */}
        <Skeleton className="aspect-video w-full rounded-2xl mb-12" />

        {/* Content paragraphs */}
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className={`h-5 ${i % 3 === 2 ? "w-3/4" : "w-full"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Admin dashboard skeleton */
export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-80" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-xl p-6 space-y-4"
          >
            <div className="flex justify-between">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <Skeleton className="h-5 w-5 rounded" />
            </div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-16" />
          </div>
        ))}
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 space-y-4">
          <Skeleton className="h-7 w-40" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 rounded-xl border border-border space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <Skeleton className="h-7 w-32" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Generic admin page skeleton (table/form) */
export function AdminPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-72" />
      </div>

      {/* Action bar */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      {/* Table rows */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border grid grid-cols-4 gap-4">
          {["w-24", "w-32", "w-20", "w-16"].map((w, i) => (
            <Skeleton key={i} className={`h-4 ${w}`} />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="p-4 border-b border-border grid grid-cols-4 gap-4 items-center"
          >
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
