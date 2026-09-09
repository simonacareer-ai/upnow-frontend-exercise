import Link from "next/link";
import { MapPin, BedDouble, Bath, Maximize, Heart } from "lucide-react";
import type { ListingItem } from "@/lib/types";

function formatPrice(item: ListingItem): string | null {
  const price =
    item.askingPrice ??
    item.unit.askingPrice ??
    (item as unknown as Record<string, unknown>).price;
  if (!price || typeof price !== "number") return null;
  return `AED ${price.toLocaleString()}`;
}

function formatFrequency(item: ListingItem): string {
  return item.askingPriceFrequency ?? item.unit.askingPriceFrequency ?? "";
}

function categoryLabel(cat: string): string {
  return cat?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) ?? "";
}

export default function ListingCard({ item }: { item: ListingItem }) {
  const { unit, property, coverPhotoUrl } = item;
  const price = formatPrice(item);
  const freq = formatFrequency(item);

  return (
    <Link
      href={`/listings/${unit.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-base-200 bg-white transition-shadow hover:shadow-lg"
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
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary-light to-base-100 text-primary/30">
            <MapPin size={40} strokeWidth={1} />
          </div>
        )}

        {/* Favorite button */}
        <button
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-neutral-500 backdrop-blur-sm transition-colors hover:bg-white hover:text-error"
          onClick={(e) => e.preventDefault()}
        >
          <Heart size={16} />
        </button>

        {/* Category badge */}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-neutral-700 backdrop-blur-sm">
          {categoryLabel(property.spaceCategory || unit.unitType)}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1 p-4">
        {/* Price */}
        {price && (
          <p className="text-base font-bold text-primary">
            {price}
            {freq && <span className="text-xs font-normal text-neutral-500">/{freq}</span>}
          </p>
        )}

        {/* Name */}
        <h3 className="line-clamp-1 text-sm font-semibold text-neutral-900">
          {unit.unitName || property.buildingName}
        </h3>

        {/* Location */}
        <p className="flex items-center gap-1 text-xs text-neutral-500">
          <MapPin size={12} />
          <span className="line-clamp-1">
            {property.community?.nameEn && `${property.community.nameEn}, `}
            {property.emirate?.nameEn}
          </span>
        </p>

        {/* Meta row */}
        <div className="mt-2 flex items-center gap-3 border-t border-base-200 pt-2 text-xs text-neutral-500">
          {unit.bedrooms != null && (
            <span className="flex items-center gap-1">
              <BedDouble size={13} /> {unit.bedrooms}
            </span>
          )}
          {unit.bathrooms != null && (
            <span className="flex items-center gap-1">
              <Bath size={13} /> {unit.bathrooms}
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
