# UpNow API — what you need for this exercise

## 1. Base URL and local setup — read this first

The API only accepts browser requests from origins on its allow-list, and
`http://localhost:3000` is **not** on it. A `fetch()` straight from your React
components to `https://staging.upnow.ae/api/...` will be blocked by CORS.

Do not work around that with a browser extension or a `no-cors` fetch. Proxy
through your own Next.js server instead — same-origin from the browser's point
of view, and it is how the real UpNow frontend is built:

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://staging.upnow.ae/api/:path*",
      },
    ];
  },
};

export default nextConfig;
```

```
# .env.local
NEXT_PUBLIC_API_URL=/api
```

Now call `/api/listings/units` from your app — no absolute URL, no CORS, and the
`Authorization` header passes straight through.

Restart `npm run dev` after editing `next.config.ts`; rewrites are not
hot-reloaded.

---

## 2. Public listings — no authentication

World-readable. Start here; the entire listings screen can be built before login
works.

### `GET /listings/units`

Paginated available units.

| Query param | Notes |
|---|---|
| `page` | default `1` |
| `limit` | default `20` |
| `q` | free-text search |
| `category` | space category |
| `spaceType` | |
| `bedrooms` | |
| `minPrice` / `maxPrice` | |
| `emirate` | e.g. `DXB` |
| `country` | ISO-3166 alpha-2; defaults from the caller's region |
| `sort` | |

Response envelope:

```jsonc
{
  "items": [
    {
      "unit": {
        "id": 112, "unitNumber": "LAND-1", "unitName": "...",
        "unitType": "commercial_land", "floor": "0",
        "propertyId": 5, "property": { /* nested */ }
      },
      "property": {
        "id": 5, "buildingName": "Marble Factory",
        "fullAddress": "16B St, Ras Al Khor", "spaceCategory": "land",
        "emirate":   { "code": "DXB", "nameEn": "Dubai" },
        "community": { "nameEn": "Ras Al Khor" },
        "latitude": "25.1785584", "longitude": "55.3574528"
      },
      "coverPhotoUrl": "https://..."
    }
  ],
  "total": 0, "page": 1, "pageSize": 20
}
```

Both `unit.property` and the top-level `property` exist on every row. Decide
which one your components read from, and be consistent.

| Endpoint | Returns |
|---|---|
| `GET /listings/units/:id` | One unit's full detail |
| `GET /listings/locations` | Filter options. Optional `country`, `emirate`, `category` |
| `GET /listings/floor-plans` | Optional `propertyId`, `bedrooms` |

---

## 3. Login — two steps

The trap: **step 1 takes `email`, step 2 takes `identifier` and `code`.** Sending
`email` to step 2 fails validation. The field name really does change.

### Step 1 — request the code

```http
POST /auth/login
Content-Type: application/json

{ "email": "someone@example.com" }
```

```jsonc
{
  "requiresVerification": true,
  "verificationStep": "email",     // or "phone"
  "maskedPhone": "s.....e@e.....e.com",
  "devOtp": "482915"               // staging only
}
```

On staging the code comes back as `devOtp` so you can finish the flow without a
mailbox. It is **absent in production** — do not build anything that depends on
it; your login UI must still work when it is missing.

### Step 2 — exchange the code for a token

```http
POST /auth/login/verify-otp
Content-Type: application/json

{ "identifier": "someone@example.com", "code": "482915" }
```

```jsonc
{ "access_token": "eyJhbGciOi...", "user": { "id": 1, "role": "rental_provider" } }
```

### Step 3 — use it

```http
GET /auth/me
Authorization: Bearer <access_token>
```

Where you keep the token is your call. Make one, and be able to explain it.

---

## 4. Stats endpoints — authentication required

Each of these needs `Authorization: Bearer <access_token>` and returns data
scoped to the signed-in provider. Omit the header and you get a `401`.

| Endpoint | Returns |
|---|---|
| `GET /reports/executive-summary` | Headline KPIs plus cashflow, renewal, occupancy and aging chart series. The best single source for a dashboard. Optional `year`, defaults to the current year. |
| `GET /reports/occupancy` | Occupancy snapshot — units, occupied counts and contracted rent per property. Optional `occupancy`: `occupied` / `vacant` / `all`. |
| `GET /reports/lease-expiry` | Leases coming up for renewal, grouped by month. Optional `window` in days, default `90`. |
| `GET /reports/vacancy-analysis` | Vacant units to action — asking rent at stake and listing status. |
| `GET /reports/portfolio-overview` | Unit mix — a row per property x unit type x bedrooms x layout x size. |

Shared optional filters on most of the above:

| Param | Notes |
|---|---|
| `buildings` | Comma-separated property ids (default: all) |
| `leaseTypes` | Comma-separated: `direct`, `sub`, `management` (default: all) |
| `year` | Calendar year, where the report is year-bound |

These return real shapes with real nesting. Inspect a response before you model
it — do not guess the field names.

---

## 5. Rate limits

Real, and easy to trip while iterating:

- **100 requests / 60 s per IP** globally. A component that refetches on every
  render will hit this, and the `429` looks exactly like a broken account.
- **10 requests / 10 min per IP** on `POST /auth/login/verify-otp`.

## 6. Test account

Sent to you separately.
