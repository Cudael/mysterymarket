export default function RefundsLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-8 h-10 w-48 rounded-[8px] bg-muted" />
      <div className="mb-6 flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-9 w-20 rounded-[8px] bg-muted" />
        ))}
      </div>
      <div className="rounded-[12px] border border-border bg-card h-64" />
    </div>
  );
}
