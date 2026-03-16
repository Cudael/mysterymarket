export default function BlogLoading() {
  return (
    <div>
      {/* Hero skeleton */}
      <div className="bg-muted border-b border-border py-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl text-center">
          <div className="h-12 w-80 mx-auto rounded-[8px] bg-border/60 animate-pulse" />
          <div className="mt-4 h-5 w-96 mx-auto rounded-[6px] bg-border/40 animate-pulse" />
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 max-w-5xl py-14">
        {/* Featured skeleton */}
        <div className="mb-14">
          <div className="h-4 w-20 rounded bg-border/60 animate-pulse mb-5" />
          <div className="rounded-[12px] border border-border bg-card h-48 animate-pulse" />
        </div>

        {/* Category pills skeleton */}
        <div className="flex gap-2 mb-10">
          {[80, 60, 90, 100, 120].map((w) => (
            <div
              key={w}
              style={{ width: w }}
              className="h-9 rounded-full bg-border/50 animate-pulse"
            />
          ))}
        </div>

        {/* Card grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-[12px] border border-border bg-card overflow-hidden"
            >
              <div className="h-44 w-full bg-muted animate-pulse" />
              <div className="p-6 space-y-3">
                <div className="h-5 w-3/4 rounded bg-border/60 animate-pulse" />
                <div className="h-4 w-full rounded bg-border/40 animate-pulse" />
                <div className="h-4 w-5/6 rounded bg-border/40 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
