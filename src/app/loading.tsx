export default function Loading() {
  return (
    <>
      {/* Hero skeleton */}
      <div className="bg-gradient-to-br from-[#0C4A3A] to-[#11614C]">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6">
          <div className="skeleton h-14 w-80 !bg-white/10" />
          <div className="skeleton mt-4 h-4 w-48 !bg-white/10" />
          <div className="skeleton mt-8 h-12 w-full max-w-3xl rounded-2xl !bg-white/10" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="skeleton h-6 w-20" />
        <div className="skeleton mt-2 h-8 w-64" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-base-200">
              <div className="skeleton aspect-[4/3] rounded-none" />
              <div className="flex flex-col gap-2 p-4">
                <div className="skeleton h-5 w-24" />
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
