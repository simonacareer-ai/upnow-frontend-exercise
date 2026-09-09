import type {
  ListingsResponse,
  ListingDetail,
  LocationOption,
  LoginResponse,
  VerifyOtpResponse,
  AuthUser,
  ExecutiveSummary,
  OccupancyResponse,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      res.status,
      body.message || body.error || res.statusText,
    );
  }

  return res.json();
}

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

/* ── Public listings ──────────────────────────────────────── */

export function fetchListings(params?: Record<string, string>) {
  const qs = params ? `?${new URLSearchParams(params)}` : "";
  return request<ListingsResponse>(`/listings/units${qs}`);
}

export function fetchListingDetail(id: string | number) {
  return request<ListingDetail>(`/listings/units/${id}`);
}

export function fetchLocations(params?: Record<string, string>) {
  const qs = params ? `?${new URLSearchParams(params)}` : "";
  return request<LocationOption[]>(`/listings/locations${qs}`);
}

/* ── Auth ─────────────────────────────────────────────────── */

export function requestOtp(email: string) {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function verifyOtp(identifier: string, code: string) {
  return request<VerifyOtpResponse>("/auth/login/verify-otp", {
    method: "POST",
    body: JSON.stringify({ identifier, code }),
  });
}

export function fetchMe(token: string) {
  return request<AuthUser>("/auth/me", {
    headers: authHeaders(token),
  });
}

/* ── Stats (auth required) ────────────────────────────────── */

export function fetchExecutiveSummary(token: string, year?: number) {
  const qs = year ? `?year=${year}` : "";
  return request<ExecutiveSummary>(`/reports/executive-summary${qs}`, {
    headers: authHeaders(token),
  });
}

export function fetchOccupancy(
  token: string,
  filter?: "occupied" | "vacant" | "all",
) {
  const qs = filter ? `?occupancy=${filter}` : "";
  return request<OccupancyResponse>(`/reports/occupancy${qs}`, {
    headers: authHeaders(token),
  });
}
