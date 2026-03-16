export default function IdeasLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-8 h-10 w-48 rounded-[8px] bg-muted" />
      <div className="mb-6 flex gap-4">
        <div className="h-10 flex-1 max-w-sm rounded-[8px] bg-muted" />
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-9 w-24 rounded-[8px] bg-muted" />
          ))}
        </div>
      </div>
      <div className="rounded-[12px] border border-border bg-card h-96" />
    </div>
  );
}
