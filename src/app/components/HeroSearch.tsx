"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Home, DollarSign, BedDouble } from "lucide-react";

const TABS = ["All Properties", "Buy", "Rent", "Short Stays", "Commercial"] as const;

const POPULAR = [
  { label: "Dubai Marina", emirate: "DXB" },
  { label: "JBR", emirate: "DXB" },
  { label: "Downtown Dubai", emirate: "DXB" },
  { label: "Business Bay", emirate: "DXB" },
  { label: "Palm Jumeirah", emirate: "DXB" },
  { label: "Arabian Ranches", emirate: "DXB" },
];

export default function HeroSearch() {
  const router = useRouter();
  const [tab, setTab] = useState<string>("All Properties");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState("");
  const [bedrooms, setBedrooms] = useState("");

  function handleSearch() {
    const params = new URLSearchParams();
    if (location) params.set("q", location);
    if (propertyType) params.set("category", propertyType);
    if (budget) params.set("maxPrice", budget);
    if (bedrooms) params.set("bedrooms", bedrooms);
    if (tab === "Rent") params.set("spaceType", "rent");
    if (tab === "Buy") params.set("spaceType", "buy");
    if (tab === "Commercial") params.set("category", "commercial");
    router.push(`/listings?${params.toString()}`);
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0C4A3A] via-[#11614C] to-[#1a7a5e]">
      {/* Decorative shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-[#0a3d30]/60 to-transparent" />
        <div className="absolute bottom-0 left-10 h-48 w-32 rounded-t-full bg-primary/10" />
        <div className="absolute left-32 top-8 h-64 w-24 rounded-b-[40px] bg-primary-dark/30" />
        <div className="absolute right-0 top-0 h-full w-1/4 bg-gradient-to-l from-primary/10 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 md:pb-16 md:pt-24">
        {/* Heading */}
        <div className="max-w-xl">
          <h1 className="font-serif text-4xl font-bold leading-tight text-white md:text-5xl lg:text-[56px]">
            Find a space<br />you can trust.
          </h1>
          <p className="mt-3 text-sm text-white/70">
            Buy · Sell · Rent · Commercial
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                tab === t
                  ? "bg-white text-primary-dark"
                  : "bg-white/10 text-white/90 hover:bg-white/20"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="mt-4 flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-lg md:flex-row md:items-center">
          {/* Location */}
          <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2 hover:bg-base-100 md:border-r md:border-base-200">
            <MapPin size={16} className="text-neutral-400" />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
            />
          </div>

          {/* Property Type */}
          <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2 hover:bg-base-100 md:border-r md:border-base-200">
            <Home size={16} className="text-neutral-400" />
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full bg-transparent text-sm text-neutral-500 outline-none"
            >
              <option value="">Property Type</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="land">Land</option>
            </select>
          </div>

          {/* Budget */}
          <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2 hover:bg-base-100 md:border-r md:border-base-200">
            <DollarSign size={16} className="text-neutral-400" />
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-transparent text-sm text-neutral-500 outline-none"
            >
              <option value="">Budget</option>
              <option value="50000">Up to AED 50K</option>
              <option value="100000">Up to AED 100K</option>
              <option value="200000">Up to AED 200K</option>
              <option value="500000">Up to AED 500K</option>
              <option value="1000000">Up to AED 1M</option>
            </select>
          </div>

          {/* Bedrooms */}
          <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2 hover:bg-base-100">
            <BedDouble size={16} className="text-neutral-400" />
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full bg-transparent text-sm text-neutral-500 outline-none"
            >
              <option value="">Bedrooms</option>
              <option value="0">Studio</option>
              <option value="1">1 Bed</option>
              <option value="2">2 Beds</option>
              <option value="3">3 Beds</option>
              <option value="4">4+ Beds</option>
            </select>
          </div>

          {/* Search button */}
          <button
            onClick={handleSearch}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            <Search size={16} />
            <span className="md:hidden lg:inline">Search</span>
          </button>
        </div>

        {/* Popular locations */}
        <div className="mt-4 flex flex-wrap gap-2">
          {POPULAR.map((loc) => (
            <button
              key={loc.label}
              onClick={() => {
                setLocation(loc.label);
                router.push(`/listings?q=${encodeURIComponent(loc.label)}&emirate=${loc.emirate}`);
              }}
              className="rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/80 backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              {loc.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
