"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

interface Props {
  emirates?: { code: string; nameEn: string }[];
}

export default function SearchFilters({ emirates }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [emirate, setEmirate] = useState(searchParams.get("emirate") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [showPriceFilter, setShowPriceFilter] = useState(
    !!(searchParams.get("minPrice") || searchParams.get("maxPrice")),
  );

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
    setEmirate(searchParams.get("emirate") ?? "");
    setMinPrice(searchParams.get("minPrice") ?? "");
    setMaxPrice(searchParams.get("maxPrice") ?? "");
  }, [searchParams]);

  function applyFilters(overrides?: Record<string, string>) {
    const params = new URLSearchParams();
    const values: Record<string, string> = {
      q: query,
      emirate,
      minPrice,
      maxPrice,
      ...overrides,
    };
    for (const [k, v] of Object.entries(values)) {
      if (v) params.set(k, v);
    }
    params.delete("page");
    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {/* Search input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            applyFilters();
          }}
          className="relative flex-1 min-w-[200px]"
        >
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            placeholder="Search by name, location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-base-200 bg-white pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-primary focus:ring-1 focus:ring-primary/30"
          />
        </form>

        {/* Emirate select */}
        <select
          value={emirate}
          onChange={(e) => {
            setEmirate(e.target.value);
            applyFilters({ emirate: e.target.value });
          }}
          className="h-10 rounded-lg border border-base-200 bg-white px-3 text-sm text-neutral-700 outline-none transition-colors focus:border-primary"
        >
          <option value="">All Emirates</option>
          {emirates?.map((e) => (
            <option key={e.code} value={e.code}>
              {e.nameEn}
            </option>
          ))}
          {!emirates?.length && (
            <>
              <option value="DXB">Dubai</option>
              <option value="AUH">Abu Dhabi</option>
              <option value="SHJ">Sharjah</option>
              <option value="AJM">Ajman</option>
              <option value="RAK">Ras Al Khaimah</option>
              <option value="FUJ">Fujairah</option>
              <option value="UAQ">Umm Al Quwain</option>
            </>
          )}
        </select>

        {/* Price filter toggle */}
        <button
          type="button"
          onClick={() => setShowPriceFilter((v) => !v)}
          className="flex h-10 items-center gap-1.5 rounded-lg border border-base-200 bg-white px-3 text-sm text-neutral-700 transition-colors hover:bg-base-100"
        >
          <SlidersHorizontal size={15} />
          Price
        </button>

        {/* Search button */}
        <button
          type="button"
          onClick={() => applyFilters()}
          disabled={isPending}
          className="h-10 rounded-lg bg-primary px-5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {isPending ? "Searching…" : "Search"}
        </button>
      </div>

      {/* Price range inputs */}
      {showPriceFilter && (
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="h-9 w-32 rounded-lg border border-base-200 bg-white px-3 text-sm outline-none focus:border-primary"
          />
          <span className="text-sm text-neutral-400">—</span>
          <input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="h-9 w-32 rounded-lg border border-base-200 bg-white px-3 text-sm outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={() => applyFilters()}
            className="h-9 rounded-lg border border-primary px-3 text-sm text-primary transition-colors hover:bg-primary-50"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
