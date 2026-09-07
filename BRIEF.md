# Frontend exercise — integrate login + public listings

## The task

Build two working screens in this repo against the real UpNow staging API.

### 1. Public listings page

- Fetch units from `GET /listings/units` and render them as cards.
- Pagination, or infinite scroll — your choice.
- At least one working filter (search, emirate or price) driven by the API's
  own query params, not by filtering an already-fetched array in the browser.
- Loading, empty and error states. The API can be slow and can fail; both
  should look deliberate rather than broken.
- A unit detail view from `GET /listings/units/:id`.

### 2. Login

- The two-step OTP flow: email → code → token. `API.md` has the exact contract,
  including the field name that changes between the steps.
- Validation and error handling on both steps — wrong code, expired code,
  unknown email, rate-limited.
- Persist the session and show something that proves it worked, e.g. the
  signed-in user from `GET /auth/me`.

Endpoint contracts, payload shapes and rate limits are all in
**[API.md](./API.md)**. Credentials come separately.

## What is provided

A blank Next.js 16 app (App Router, TypeScript, Tailwind 4). UpNow brand tokens
are already in `src/app/globals.css`, so `bg-primary`, `text-neutral-500` and
`bg-surface` work out of the box.

```bash
cp .env.local.example .env.local
npm install
npm run dev      # http://localhost:3000
```

Nothing else is set up — no data layer, no components, no fetch wrapper. How you
put those in place is most of what we are looking at.

## What we are looking at

- **API integration.** Where fetching lives, how errors and loading are handled,
  whether the response shape is typed rather than `any`.
- **App Router use.** Server components by default; `"use client"` only where
  interactivity genuinely needs it. Where you put the token matters — be ready
  to explain the choice.
- **Component boundaries.** Sensible decomposition, no 400-line page files.
- **Resilience.** The rate limits in `API.md` are real. A component that
  refetches on every render will hit them.
- **Responsive layout.** It should hold up on a phone.
- **Readable code.** Consistent naming, no dead code or stray console logs.

## Ground rules

- Any library you would normally reach for is fine — add it.
- Docs, Google and AI assistants are all allowed. We care how you work, not what
  you have memorised.
- Ambiguity is expected. Make a call, note it in `NOTES.md`, move on.

## Handing it back

Commit and push to the repo we shared with you. Add a short `NOTES.md` covering
what you finished, what you would do next, and anything you deliberately skipped
and why.
