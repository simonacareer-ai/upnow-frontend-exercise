import Link from "next/link";
import { ArrowLeft, MapPin, Building2, BedDouble, Bath, Maximize, Layers } from "lucide-react";

const API = "https://staging.upnow.ae/api";

async function getUnit(id: string) {
  const res = await fetch(`${API}/listings/units/${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Unit fetch failed: ${res.status}`);
  return res.json();
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UnitDetailPage({ params }: PageProps) {
  const { id } = await params;
  const data = await getUnit(id);

  const unit = data.unit ?? data;
  const property = data.property ?? unit.property ?? {};
  const coverPhoto = data.coverPhotoUrl ?? data.coverPhoto ?? null;
  const photos: string[] = data.photos ?? [];
  const allImages = coverPhoto ? [coverPhoto, ...photos] : photos;

  const price =
    data.askingPrice ?? unit.askingPrice ?? null;
  const freq =
    data.askingPriceFrequency ?? unit.askingPriceFrequency ?? "";

  function categoryLabel(cat: string): string {
    return cat?.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) ?? "";
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      {/* Back link */}
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-neutral-500 transition-colors hover:text-primary"
      >
        <ArrowLeft size={16} /> Back to listings
      </Link>

      {/* Image gallery */}
      <div className="mb-6 overflow-hidden rounded-xl bg-base-100">
        {allImages.length > 0 ? (
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            <img
              src={allImages[0]}
              alt={unit.unitName || property.buildingName}
              className="aspect-[4/3] w-full object-cover sm:aspect-auto sm:h-80"
            />
            {allImages.length > 1 && (
              <div className="hidden gap-1 sm:grid sm:grid-cols-2">
                {allImages.slice(1, 5).map((url: string, i: number) => (
                  <img
                    key={i}
                    src={url}
                    alt=""
                    className="aspect-square w-full object-cover"
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center text-neutral-400">
            <Building2 size={48} strokeWidth={1} />
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Category badge */}
          <span className="inline-block rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary">
            {categoryLabel(property.spaceCategory || unit.unitType)}
          </span>

          <h1 className="mt-3 text-2xl font-bold text-neutral-900">
            {unit.unitName || property.buildingName}
          </h1>

          <p className="mt-1 flex items-center gap-1 text-sm text-neutral-500">
            <MapPin size={14} />
            {property.fullAddress ||
              [property.community?.nameEn, property.emirate?.nameEn]
                .filter(Boolean)
                .join(", ")}
          </p>

          {/* Unit details grid */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {unit.bedrooms != null && (
              <div className="flex items-center gap-2 rounded-lg border border-base-200 p-3">
                <BedDouble size={18} className="text-primary" />
                <div>
                  <p className="text-sm font-semibold">{unit.bedrooms}</p>
                  <p className="text-xs text-neutral-500">Bedrooms</p>
                </div>
              </div>
            )}
            {unit.bathrooms != null && (
              <div className="flex items-center gap-2 rounded-lg border border-base-200 p-3">
                <Bath size={18} className="text-primary" />
                <div>
                  <p className="text-sm font-semibold">{unit.bathrooms}</p>
                  <p className="text-xs text-neutral-500">Bathrooms</p>
                </div>
              </div>
            )}
            {unit.size != null && (
              <div className="flex items-center gap-2 rounded-lg border border-base-200 p-3">
                <Maximize size={18} className="text-primary" />
                <div>
                  <p className="text-sm font-semibold">
                    {unit.size} {unit.sizeUnit || "sqft"}
                  </p>
                  <p className="text-xs text-neutral-500">Area</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 rounded-lg border border-base-200 p-3">
              <Layers size={18} className="text-primary" />
              <div>
                <p className="text-sm font-semibold">
                  {unit.floor === "0" ? "Ground" : `Floor ${unit.floor}`}
                </p>
                <p className="text-xs text-neutral-500">Floor</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {data.description && (
            <div className="mt-6">
              <h2 className="mb-2 text-lg font-semibold">Description</h2>
              <p className="text-sm leading-relaxed text-neutral-700">
                {data.description}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar — price card */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 rounded-xl border border-base-200 bg-white p-5 shadow-sm">
            {price ? (
              <>
                <p className="text-2xl font-bold text-neutral-900">
                  {price.toLocaleString("en-AE", {
                    style: "currency",
                    currency: "AED",
                    maximumFractionDigits: 0,
                  })}
                  {freq && (
                    <span className="text-base font-normal text-neutral-500">
                      /{freq}
                    </span>
                  )}
                </p>
                <p className="mt-1 text-xs text-neutral-500">Asking price</p>
              </>
            ) : (
              <p className="text-lg font-semibold text-neutral-700">
                Contact for price
              </p>
            )}

            <hr className="my-4 border-base-200" />

            <div className="space-y-2 text-sm text-neutral-700">
              <div className="flex justify-between">
                <span className="text-neutral-500">Building</span>
                <span className="font-medium">{property.buildingName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Unit</span>
                <span className="font-medium">{unit.unitNumber}</span>
              </div>
              {property.emirate?.nameEn && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">Emirate</span>
                  <span className="font-medium">{property.emirate.nameEn}</span>
                </div>
              )}
              {property.community?.nameEn && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">Community</span>
                  <span className="font-medium">{property.community.nameEn}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
