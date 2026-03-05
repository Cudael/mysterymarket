export default function ReportsLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-8 h-10 w-48 rounded-[8px] bg-[#D9DCE3]" />
      <div className="mb-6 flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-20 rounded-[8px] bg-[#D9DCE3]" />
        ))}
      </div>
      <div className="rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] h-64" />
    </div>
  );
}
