# Notes

## What I finished

### 1. Public listings page (`/`)
- Server component fetches from `GET /listings/units` via the staging API.
- **Filters:** search (free-text `q`), emirate dropdown, and expandable price range — all driven by API query params through URL `searchParams`.
- **Pagination:** URL-driven, shows ellipsis for large page counts.
- **Loading state:** skeleton shimmer cards via `loading.tsx`.
- **Error state:** dedicated `error.tsx` with rate-limit awareness (429 detection).
- **Empty state:** illustrated message when no results match.

### 2. Unit detail page (`/listings/[id]`)
- Server component fetching `GET /listings/units/:id`.
- Image gallery, property metadata, and sticky price sidebar.
- Own `loading.tsx` and `error.tsx` boundaries.

### 3. Login page (`/login`)
- Two-step OTP flow matching the API contract exactly:
  - Step 1: `POST /auth/login` with `{ email }`.
  - Step 2: `POST /auth/login/verify-otp` with `{ identifier, code }` — note the field name change.
- Handles wrong code, expired code, rate-limited (429), and unknown email errors.
- UI does **not** depend on `devOtp` — works when the field is absent.
- After successful login, fetches `GET /auth/me` and displays user info.

### 4. Stats dashboard (`/dashboard`)
- Fetches `GET /reports/executive-summary` and `GET /reports/occupancy` in parallel.
- Headline KPI stat cards with dynamic rendering (renders whatever numeric fields the API returns).
- Occupancy table broken down by property.
- Redirects to login when the user is not authenticated. Shows a friendly "sign in" prompt rather than throwing.

## Architecture decisions

| Decision | Rationale |
|---|---|
| **Token in `localStorage`** | Simpler than cookies for a client-side auth context. The dashboard and login are `"use client"` components anyway. In production I would use `httpOnly` cookies managed by a Next.js API route for XSS protection. |
| **Server components for listings** | Data is public and benefits from server-side rendering — faster first paint, better SEO, and avoids a client-side fetch waterfall. |
| **`"use client"` for login & dashboard** | Both are inherently interactive: login manages form state; dashboard needs the auth token from the client-side context. |
| **URL-based filters & pagination** | Filters update the URL via `router.push`, which triggers a server-component re-render. Shareable URLs, back-button support, and no client-side state for query params. |
| **Direct staging URL in server components** | The rewrite proxy only handles browser → Next.js requests. Server components call the staging API directly (no CORS on the server). Client components go through `/api/` rewrite. |
| **`<img>` tags instead of `next/image`** | Avoids needing to configure every possible CDN hostname for cover photos. Trade-off: no automatic optimisation. |

## What I would do next

- **Inspect real API response shapes** for stats endpoints and adjust TypeScript types to match exactly (fields like `totalContractedRent` may differ).
- **Add a chart** (e.g. Recharts) for the cashflow or occupancy trend series returned by executive-summary.
- **Infinite scroll** option for listings as an alternative to pagination.
- **More filters:** category, bedrooms, space type dropdowns using data from `GET /listings/locations`.
- **Floor plans** integration via `GET /listings/floor-plans` on the detail page.
- **Better image handling:** configure `next/image` with known CDN domains for automatic WebP/AVIF and lazy loading.
- **E2E tests** with Playwright covering the OTP flow and listing navigation.
- **Rate-limit backoff** — exponential retry on 429 with a user-visible countdown.

## What I deliberately skipped

- **No signup flow** — the API only supports OTP-based login, not registration. The Figma showed a signup screen, but I built what the API supports.
- **No `GET /listings/floor-plans`** — the brief focused on units and a detail view; floor plans are a nice-to-have.
- **No chart library** — the brief said "a well-built table is equally fine" so I used a clean table for occupancy. A chart would be the natural next step.
- **No `GET /reports/lease-expiry` or `/vacancy-analysis`** — I picked occupancy as the second stats view. Adding more views is straightforward with the existing API wrapper.
