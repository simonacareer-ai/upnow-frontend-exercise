"use client";

import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const is429 = error.message?.includes("429");

  return (
    <main className="mx-auto flex max-w-lg flex-col items-center gap-4 px-6 py-20 text-center">
      <AlertTriangle size={40} className="text-warning" />
      <h2 className="text-xl font-semibold text-neutral-900">
        {is429 ? "Too many requests" : "Something went wrong"}
      </h2>
      <p className="text-sm text-neutral-500">
        {is429
          ? "You've hit the API rate limit. Please wait a minute and try again."
          : "We couldn't load the page. The API may be temporarily unavailable."}
      </p>
      <button
        onClick={reset}
        className="mt-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
      >
        Try again
      </button>
    </main>
  );
}
