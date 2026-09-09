export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Hero skeleton */}
      <div className="mb-8">
        <div className="skeleton h-8 w-64" />
        <div className="skeleton mt-2 h-4 w-48" />
      </div>

      {/* Filter skeleton */}
      <div className="mb-6 flex gap-2">
        <div className="skeleton h-10 flex-1" />
        <div className="skeleton h-10 w-36" />
        <div className="skeleton h-10 w-24" />
      </div>

      {/* Grid skeleton */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-base-200 bg-white">
            <div className="skeleton aspect-[4/3] rounded-none" />
            <div className="flex flex-col gap-2 p-4">
              <div className="skeleton h-5 w-24" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
