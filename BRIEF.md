# Frontend exercise — Rental Provider hub

## The task

Convert the linked design into a working Next.js screen in this repo.

**Design:** https://claude.ai/code/artifact/d233f35a-b9dd-4299-aaf9-d1205d9060b6

You do not need to build the whole design. Build, in this order:

1. The page header and the summary stat cards.
2. The main list/table section, including its filter tabs.
3. One interactive detail — opening a row, or switching tabs — with real state.

Stop when time is up. A smaller amount of finished, considered work beats a
larger amount of half-built work.

## What is provided

A blank Next.js 16 app (App Router, TypeScript, Tailwind 4). The UpNow brand
tokens are already in `src/app/globals.css`, so `bg-primary`,
`text-neutral-500`, `bg-surface` and friends work out of the box.

```bash
npm install
npm run dev      # http://localhost:3000
```

There is no backend. Hard-code or mock the data in whatever shape you find
natural — how you model it is part of what we are looking at.

## What we are looking at

- How you break a design into components, and where you draw the boundaries.
- Correct use of the App Router: server components by default, `"use client"`
  only where interactivity actually needs it.
- Typing: real types for your data, not `any`.
- Whether the layout holds up on a phone as well as a laptop.
- Empty and loading states — the design shows the happy path; we care that you
  thought about the rest.
- Readable, consistent code. Naming, formatting, no dead code left behind.

## Ground rules

- Any library you would normally reach for is fine — add it.
- Documentation, Google and AI assistants are all allowed. We are interested in
  how you work, not what you have memorised.
- If something in the design is ambiguous, make a call and note it in
  `NOTES.md`. Saying why you chose something counts in your favour.

## Handing it back

Commit your work and share the repo (or a zip). Add a short `NOTES.md` with
what you finished, what you would do next, and anything you deliberately
skipped.
