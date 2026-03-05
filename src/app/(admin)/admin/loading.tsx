export default function AdminLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-8 h-10 w-64 rounded-[8px] bg-[#D9DCE3]" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] p-6 h-[108px]"
          />
        ))}
      </div>
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] h-64"
          />
        ))}
      </div>
    </div>
  );
}
