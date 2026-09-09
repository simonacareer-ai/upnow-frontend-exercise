import Link from "next/link";
import { Building2, MapPin, BedDouble, Bath, Maximize } from "lucide-react";
import type { ListingItem } from "@/lib/types";

function formatPrice(item: ListingItem): string | null {
  const price =
    item.askingPrice ??
    item.unit.askingPrice ??
    (item as unknown as Record<string, unknown>).price;
  if (!price || typeof price !== "number") return null;
  const freq =
    item.askingPriceFrequency ??
    item.unit.askingPriceFrequency ??
    "";
  const formatted = price.toLocaleString("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  });
  return freq ? `${formatted}/${freq}` : formatted;
}

function categoryLabel(cat: string): string {
  return cat
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ListingCard({ item }: { item: ListingItem }) {
  const { unit, property, coverPhotoUrl } = item;
  const price = formatPrice(item);

  return (
    <Link
      href={`/listings/${unit.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-base-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-base-100">
        {coverPhotoUrl ? (
          <img
            src={coverPhotoUrl}
            alt={unit.unitName || property.buildingName}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-400">
            <Building2 size={40} strokeWidth={1} />
          </div>
        )}

        {/* Category badge */}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-neutral-700 backdrop-blur-sm">
          {categoryLabel(property.spaceCategory || unit.unitType)}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        {price && (
          <p className="text-lg font-semibold text-neutral-900">{price}</p>
        )}

        <h3 className="line-clamp-1 text-sm font-medium text-neutral-900">
          {unit.unitName || property.buildingName}
        </h3>

        <p className="flex items-center gap-1 text-xs text-neutral-500">
          <MapPin size={12} />
          <span className="line-clamp-1">
            {property.community?.nameEn && `${property.community.nameEn}, `}
            {property.emirate?.nameEn}
          </span>
        </p>

        {/* Meta row */}
        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-neutral-500">
          {unit.bedrooms != null && (
            <span className="flex items-center gap-1">
              <BedDouble size={13} /> {unit.bedrooms} Bed
            </span>
          )}
          {unit.bathrooms != null && (
            <span className="flex items-center gap-1">
              <Bath size={13} /> {unit.bathrooms} Bath
            </span>
          )}
          {unit.size != null && (
            <span className="flex items-center gap-1">
              <Maximize size={13} /> {unit.size} {unit.sizeUnit || "sqft"}
            </span>
          )}
          {!unit.bedrooms && !unit.bathrooms && !unit.size && (
            <span>Unit {unit.unitNumber}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
