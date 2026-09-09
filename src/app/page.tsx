import { Suspense } from "react";
import ListingCard from "./components/ListingCard";
import SearchFilters from "./components/SearchFilters";
import Pagination from "./components/Pagination";
import type { ListingsResponse } from "@/lib/types";
import { Building2 } from "lucide-react";

// Server components fetch the staging API directly (no CORS on the server).
// Client components go through the Next.js rewrite proxy at /api.
const SERVER_API = process.env.API_URL || "https://staging.upnow.ae/api";

async function getListings(
  params: Record<string, string>,
): Promise<ListingsResponse> {
  const qs = new URLSearchParams(params);
  const res = await fetch(`${SERVER_API}/listings/units?${qs}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Listings fetch failed: ${res.status}`);
  return res.json();
}

async function getLocations() {
  try {
    const res = await fetch(`${SERVER_API}/listings/locations`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ListingsPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const params: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v === "string" && v) params[k] = v;
  }
  if (!params.limit) params.limit = "12";

  const [data, locations] = await Promise.all([
    getListings(params),
    getLocations(),
  ]);

  const currentPage = data.page || 1;
  const totalPages = Math.ceil(data.total / data.pageSize) || 1;

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Hero */}
      <section className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
          Find a space you can trust
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Buy · Sell · Rent · Commercial — across the UAE
        </p>
      </section>

      {/* Filters */}
      <section className="mb-6">
        <Suspense fallback={null}>
          <SearchFilters emirates={locations} />
        </Suspense>
      </section>

      {/* Results count */}
      <p className="mb-4 text-sm text-neutral-500">
        {data.total} {data.total === 1 ? "listing" : "listings"} found
      </p>

      {/* Grid */}
      {data.items.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.items.map((item) => (
            <ListingCard key={item.unit.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-20 text-neutral-400">
          <Building2 size={48} strokeWidth={1} />
          <p className="text-lg font-medium">No listings found</p>
          <p className="text-sm">Try adjusting your filters or search term.</p>
        </div>
      )}

      {/* Pagination */}
      <section className="mt-8">
        <Suspense fallback={null}>
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </Suspense>
      </section>
    </main>
  );
}
