export default function BlogPostLoading() {
  return (
    <div className="container mx-auto px-6 lg:px-8 max-w-3xl py-10">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-8">
        <div className="h-4 w-10 rounded bg-border/60 animate-pulse" />
        <div className="h-3 w-3 rounded bg-border/40 animate-pulse" />
        <div className="h-4 w-10 rounded bg-border/60 animate-pulse" />
        <div className="h-3 w-3 rounded bg-border/40 animate-pulse" />
        <div className="h-4 w-40 rounded bg-border/60 animate-pulse" />
      </div>

      {/* Header skeleton */}
      <div className="mb-10 space-y-4">
        <div className="h-6 w-20 rounded-[6px] bg-border/60 animate-pulse" />
        <div className="h-10 w-full rounded bg-border/60 animate-pulse" />
        <div className="h-10 w-4/5 rounded bg-border/50 animate-pulse" />
        <div className="flex items-center gap-4 mt-4">
          <div className="h-8 w-8 rounded-full bg-border/60 animate-pulse" />
          <div className="h-4 w-32 rounded bg-border/50 animate-pulse" />
          <div className="h-4 w-24 rounded bg-border/40 animate-pulse" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="space-y-3">
        {[100, 90, 80, 95, 70, 85, 100, 75].map((w, i) => (
          <div
            key={i}
            style={{ width: `${w}%` }}
            className="h-4 rounded bg-border/40 animate-pulse"
          />
        ))}
        <div className="h-8" />
        {[100, 88, 92, 78, 100, 85].map((w, i) => (
          <div
            key={i + 10}
            style={{ width: `${w}%` }}
            className="h-4 rounded bg-border/40 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
