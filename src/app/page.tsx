import HeroSearch from "./components/HeroSearch";
import ListingCard from "./components/ListingCard";
import Footer from "./components/Footer";
import type { ListingsResponse } from "@/lib/types";
import { ArrowRight, Shield, Zap, Clock, Star, CheckCircle } from "lucide-react";
import Link from "next/link";

const SERVER_API = process.env.API_URL || "https://staging.upnow.ae/api";

async function getLatestListings(): Promise<ListingsResponse> {
  try {
    const res = await fetch(`${SERVER_API}/listings/units?limit=8`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) return { items: [], total: 0, page: 1, pageSize: 8 };
    return res.json();
  } catch {
    return { items: [], total: 0, page: 1, pageSize: 8 };
  }
}

export default async function HomePage() {
  const listings = await getLatestListings();

  return (
    <>
      {/* ── Hero ──────────────────────────────────── */}
      <HeroSearch />

      {/* ── Luxurious Dubai Partners ──────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Partnerships
        </p>
        <h2 className="mt-2 font-serif text-2xl font-bold text-neutral-900 md:text-3xl">
          Luxurious Dubai partners
        </h2>

        <div className="mt-8 overflow-hidden rounded-2xl bg-gradient-to-r from-[#11614C] to-[#2E9F82] shadow-lg">
          <div className="grid md:grid-cols-2">
            <div className="flex flex-col justify-center p-8 md:p-12">
              <span className="inline-block w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">
                Featured
              </span>
              <h3 className="mt-4 font-serif text-2xl font-bold text-white md:text-3xl">
                Dubai Marina
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                Experience waterfront luxury in one of Dubai&apos;s most iconic
                neighborhoods. Premium apartments with stunning marina views,
                world-class dining, and vibrant nightlife at your doorstep.
              </p>
              <Link
                href="/listings?q=Dubai+Marina&emirate=DXB"
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-primary-dark transition-colors hover:bg-primary-light"
              >
                Explore listings <ArrowRight size={16} />
              </Link>
            </div>
            {listings.items[0]?.coverPhotoUrl ? (
              <img
                src={listings.items[0].coverPhotoUrl}
                alt="Dubai Marina"
                className="h-64 w-full object-cover md:h-auto"
              />
            ) : (
              <div className="h-64 bg-primary/20 md:h-auto" />
            )}
          </div>
        </div>
      </section>

      {/* ── What's New This Week ──────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Explore
            </p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-neutral-900 md:text-3xl">
              What&apos;s new this week.
            </h2>
          </div>
          <Link
            href="/listings"
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark sm:flex"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {listings.items.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {listings.items.slice(0, 4).map((item) => (
              <ListingCard key={item.unit.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-base-200 bg-base-100 p-12 text-center">
            <p className="text-sm text-neutral-500">
              Listings are loading — check back shortly.
            </p>
          </div>
        )}

        <div className="mt-4 flex justify-center sm:hidden">
          <Link
            href="/listings"
            className="flex items-center gap-1 text-sm font-medium text-primary"
          >
            View all listings <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── Inspiration For Your Next Move ─────── */}
      <section className="bg-base-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="font-serif text-2xl font-bold text-neutral-900 md:text-3xl">
            Inspiration for your next move
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Waterfront Living", color: "from-blue-900/80" },
              { label: "Luxury Villas", color: "from-emerald-900/80" },
              { label: "City Apartments", color: "from-amber-900/80" },
              { label: "Family Communities", color: "from-purple-900/80" },
              { label: "Commercial Spaces", color: "from-slate-900/80" },
              { label: "New Developments", color: "from-teal-900/80" },
            ].map((cat, i) => (
              <Link
                key={cat.label}
                href={`/listings?q=${encodeURIComponent(cat.label)}`}
                className={`group relative overflow-hidden rounded-2xl ${
                  i < 2 ? "sm:col-span-1 lg:row-span-2" : ""
                } ${i < 2 ? "h-64 lg:h-full" : "h-48"}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/60 to-primary/30" />
                {listings.items[i]?.coverPhotoUrl && (
                  <img
                    src={listings.items[i].coverPhotoUrl}
                    alt={cat.label}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                )}
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} to-transparent`} />
                <div className="absolute bottom-0 left-0 p-5">
                  <h3 className="text-lg font-bold text-white">{cat.label}</h3>
                  <p className="mt-1 text-xs text-white/70">Explore →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top Rated Spaces ─────────────────────── */}
      {listings.items.length > 4 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Popular
              </p>
              <h2 className="mt-2 font-serif text-2xl font-bold text-neutral-900 md:text-3xl">
                Top rated spaces in the UAE
              </h2>
            </div>
            <Link
              href="/listings"
              className="hidden items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark sm:flex"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {listings.items.slice(4, 8).map((item) => (
              <div key={item.unit.id} className="relative">
                <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-amber-600 backdrop-blur-sm">
                  <Star size={11} fill="currentColor" /> 4.{Math.floor(Math.random() * 5) + 5}
                </div>
                <ListingCard item={item} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Features / Trust Section ─────────────── */}
      <section className="bg-base-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-bold text-neutral-900 md:text-3xl">
              Rent, lease, and pay on<br />
              <span className="text-primary">9 built-in</span> family &amp; friends.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: <Shield size={24} />,
                title: "Verified Listings",
                desc: "Every property is verified by our team. No surprises, no hidden fees, no fake listings.",
              },
              {
                icon: <Zap size={24} />,
                title: "Instant Booking",
                desc: "Book your space instantly with secure digital lease signing and payment processing.",
              },
              {
                icon: <Clock size={24} />,
                title: "24/7 Support",
                desc: "Our dedicated team is available around the clock to help you with any questions.",
              },
            ].map((feat) => (
              <div
                key={feat.title}
                className="rounded-2xl border border-base-200 bg-white p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
                  {feat.icon}
                </div>
                <h3 className="mt-4 text-base font-semibold text-neutral-900">
                  {feat.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Built On Smart Experts ────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <h2 className="font-serif text-2xl font-bold text-neutral-900 md:text-3xl">
          Built on <span className="text-primary">smart</span> the UAE&apos;s smartest experts.
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-neutral-400">
          {["Trusted by 10,000+ users", "Licensed by RERA", "ISO 27001 Certified", "Dubai Land Department"].map(
            (badge) => (
              <div key={badge} className="flex items-center gap-2 text-sm">
                <CheckCircle size={16} className="text-primary" />
                <span className="text-neutral-500">{badge}</span>
              </div>
            ),
          )}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#0C4A3A] to-[#11614C]">
          <div className="grid items-center gap-8 p-8 md:grid-cols-2 md:p-12">
            <div>
              <h2 className="font-serif text-2xl font-bold text-white md:text-3xl">
                List your property.<br />
                Get tenants in <span className="text-primary-light">42 minutes</span>.
              </h2>
              <p className="mt-3 text-sm text-white/70">
                Join thousands of property owners who trust UpNow to find
                qualified tenants quickly and securely.
              </p>
              <button className="mt-6 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary-dark transition-colors hover:bg-primary-light">
                List your property
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { value: "10,000+", label: "Property Listings" },
                { value: "24/7", label: "Support" },
                { value: "100%", label: "Verified" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-white md:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-white/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────── */}
      <Footer />
    </>
  );
}
