"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex max-w-lg flex-col items-center gap-4 px-6 py-20 text-center">
      <AlertTriangle size={40} className="text-warning" />
      <h2 className="text-xl font-semibold">Couldn&apos;t load this listing</h2>
      <p className="text-sm text-neutral-500">{error.message}</p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-base-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-base-100"
        >
          Back to listings
        </Link>
      </div>
    </main>
  );
}
