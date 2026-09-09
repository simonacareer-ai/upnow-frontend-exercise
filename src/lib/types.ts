/* ── Listings ─────────────────────────────────────────────── */

export interface Emirate {
  code: string;
  nameEn: string;
}

export interface Community {
  nameEn: string;
}

export interface Property {
  id: number;
  buildingName: string;
  fullAddress: string;
  spaceCategory: string;
  emirate: Emirate;
  community: Community;
  latitude: string;
  longitude: string;
}

export interface Unit {
  id: number;
  unitNumber: string;
  unitName: string;
  unitType: string;
  floor: string;
  propertyId: number;
  property?: Property;
  bedrooms?: number;
  bathrooms?: number;
  size?: number;
  sizeUnit?: string;
  askingPrice?: number;
  askingPriceFrequency?: string;
}

export interface ListingItem {
  unit: Unit;
  property: Property;
  coverPhotoUrl: string | null;
  photos?: string[];
  askingPrice?: number;
  askingPriceFrequency?: string;
}

export interface ListingsResponse {
  items: ListingItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ListingDetail extends ListingItem {
  description?: string;
  amenities?: string[];
}

export interface LocationOption {
  code: string;
  nameEn: string;
}

/* ── Auth ─────────────────────────────────────────────────── */

export interface LoginRequestBody {
  email: string;
}

export interface LoginResponse {
  requiresVerification: boolean;
  verificationStep: string;
  maskedPhone: string;
  devOtp?: string;
}

export interface VerifyOtpBody {
  identifier: string;
  code: string;
}

export interface VerifyOtpResponse {
  access_token: string;
  user: { id: number; role: string };
}

export interface AuthUser {
  id: number;
  role: string;
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  [key: string]: unknown;
}

/* ── Stats ────────────────────────────────────────────────── */

export interface ExecutiveSummary {
  totalProperties?: number;
  totalUnits?: number;
  occupiedUnits?: number;
  vacantUnits?: number;
  occupancyRate?: number;
  totalContractedRent?: number;
  totalCollectedRent?: number;
  collectionRate?: number;
  outstandingBalance?: number;
  upcomingRenewals?: number;
  [key: string]: unknown;
}

export interface OccupancyRow {
  propertyId?: number;
  buildingName?: string;
  property?: Property;
  totalUnits?: number;
  occupiedUnits?: number;
  vacantUnits?: number;
  occupancyRate?: number;
  contractedRent?: number;
  [key: string]: unknown;
}

export interface OccupancyResponse {
  items?: OccupancyRow[];
  data?: OccupancyRow[];
  properties?: OccupancyRow[];
  [key: string]: unknown;
}
