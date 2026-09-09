export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <div className="skeleton mb-4 h-4 w-32" />
      <div className="skeleton mb-6 h-64 w-full rounded-xl" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="skeleton mb-2 h-5 w-20" />
          <div className="skeleton mb-2 h-8 w-3/4" />
          <div className="skeleton h-4 w-1/2" />
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-16 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="skeleton h-52 rounded-xl" />
      </div>
    </main>
  );
}
