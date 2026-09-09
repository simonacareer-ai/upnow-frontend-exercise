"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { LogOut, LayoutDashboard, Building2, LogIn } from "lucide-react";

export default function Header() {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-base-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-white">
            U
          </span>
          <span className="text-lg">UpNow</span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              pathname === "/"
                ? "bg-primary-50 text-primary"
                : "text-neutral-500 hover:text-neutral-900",
            )}
          >
            <span className="flex items-center gap-1.5">
              <Building2 size={15} />
              Listings
            </span>
          </Link>

          {user && (
            <Link
              href="/dashboard"
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                pathname === "/dashboard"
                  ? "bg-primary-50 text-primary"
                  : "text-neutral-500 hover:text-neutral-900",
              )}
            >
              <span className="flex items-center gap-1.5">
                <LayoutDashboard size={15} />
                Dashboard
              </span>
            </Link>
          )}
        </nav>

        <div className="flex-1" />

        {/* Auth area */}
        {isLoading ? (
          <div className="h-8 w-24 animate-pulse rounded-lg bg-base-200" />
        ) : user ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-neutral-700 sm:block">
              {user.firstName ?? user.email ?? `User #${user.id}`}
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-neutral-500 transition-colors hover:bg-base-100 hover:text-neutral-900"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            <LogIn size={15} />
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
