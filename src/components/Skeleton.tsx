export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border-2 border-[#FBCFE8] bg-white p-5 shadow-sm">
      <div className="h-6 w-3/4 rounded-md bg-[#FBCFE8]/50 mb-3" />
      <div className="h-4 w-full rounded-md bg-[#FFF0F5] mb-2" />
      <div className="h-4 w-2/3 rounded-md bg-[#FFF0F5] mb-4" />
      <div className="h-8 w-1/3 rounded-lg bg-[#FBCFE8]/60 mb-4" />
      <div className="h-10 w-full rounded-xl bg-[#D10068]/20" />
    </div>
  );
}

export function SkeletonOrderCard() {
  return (
    <div className="animate-pulse rounded-xl border border-[#FBCFE8] bg-[#FFF0F5]/40 p-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <div className="h-5 w-40 rounded bg-[#FBCFE8]/60" />
          <div className="h-4 w-60 rounded bg-[#FFF0F5]" />
          <div className="h-6 w-24 rounded bg-[#D10068]/20 mt-3" />
        </div>
        <div className="h-7 w-20 rounded-full bg-[#FBCFE8]/80" />
      </div>
    </div>
  );
}
