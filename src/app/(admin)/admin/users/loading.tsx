export default function UsersLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-8 h-10 w-48 rounded-[8px] bg-[#D9DCE3]" />
      <div className="mb-6 flex gap-4">
        <div className="h-10 flex-1 max-w-sm rounded-[8px] bg-[#D9DCE3]" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 w-20 rounded-[8px] bg-[#D9DCE3]" />
          ))}
        </div>
      </div>
      <div className="rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] h-96" />
    </div>
  );
}
