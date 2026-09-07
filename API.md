# UpNow API — what you need for this exercise

## Base URL

```
NEXT_PUBLIC_API_URL=https://staging.upnow.ae/api
```

Put it in `.env.local`. Everything below is relative to that base.

The API is CORS-open and needs no gateway credentials — call it directly from
your app.

---

## 1. Public listings (no authentication)

These are world-readable. Start here; you can build the whole listings page
without logging in at all.

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
      "unit": { "id": 112, "unitNumber": "LAND-1", "unitName": "...", "unitType": "commercial_land", "floor": "0", "propertyId": 5, "property": { /* nested, see below */ } },
      "property": { "id": 5, "buildingName": "Marble Factory", "fullAddress": "16B St, Ras Al Khor", "spaceCategory": "land", "emirate": { "code": "DXB", "nameEn": "Dubai" }, "community": { "nameEn": "Ras Al Khor" }, "latitude": "25.1785584", "longitude": "55.3574528" },
      "coverPhotoUrl": "https://..."
    }
  ],
  "total": 0,
  "page": 1,
  "pageSize": 20
}
```

Note `unit.property` and the top-level `property` both exist — decide which one
your components should read from and be consistent.

### `GET /listings/units/:id`

One unit's full detail.

### `GET /listings/locations`

Location filter options. Optional `country`, `emirate`, `category`.

### `GET /listings/floor-plans`

Optional `propertyId`, `bedrooms`.

---

## 2. Login — two steps

The trap: **step 1 takes `email`, step 2 takes `identifier` and `code`.** Sending
`email` to step 2 fails validation. This catches people out; the field name
really does change.

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
  "maskedPhone": "s•••••e@e•••••e.com",
  "devOtp": "482915"               // staging only — see below
}
```

On staging the code comes back in the response as `devOtp`, so you can complete
the flow without access to a mailbox. Do not build anything that depends on that
field existing — it is absent in production, and your UI must still work.

### Step 2 — exchange the code for a token

```http
POST /auth/login/verify-otp
Content-Type: application/json

{ "identifier": "someone@example.com", "code": "482915" }
```

```jsonc
{ "access_token": "eyJhbGciOi...", "user": { "id": 1, "role": "rental_provider", ... } }
```

### Step 3 — use it

```http
GET /auth/me
Authorization: Bearer <access_token>
```

Where you keep the token is your call — make one and be able to explain it.

---

## Rate limits

Real, and easy to trip while iterating:

- **100 requests / 60 s per IP** globally. A render loop that refetches will hit
  this, and the `429` looks exactly like a broken account.
- **10 requests / 10 min per IP** on `POST /auth/login/verify-otp`.

---

## Test account

Ask us — we will send credentials separately.
