"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import {
  LogOut,
  LayoutDashboard,
  Globe,
  Bell,
  HelpCircle,
  Search,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function Header() {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-base-200 bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-primary-dark">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
            U
          </span>
          <span className="text-lg tracking-tight">UpNow</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {[
            { href: "/", label: "Home" },
            { href: "/listings", label: "Explore" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors",
                pathname === link.href
                  ? "text-primary-dark"
                  : "text-neutral-500 hover:text-neutral-900",
              )}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors",
                pathname === "/dashboard"
                  ? "text-primary-dark"
                  : "text-neutral-500 hover:text-neutral-900",
              )}
            >
              <LayoutDashboard size={14} />
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex-1" />

        {/* Right actions */}
        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/listings"
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-base-100"
          >
            <Search size={16} />
          </Link>
          <button className="flex items-center gap-1 rounded-full px-2 py-1 text-[13px] text-neutral-500 hover:bg-base-100">
            <HelpCircle size={14} />
            Help
          </button>
          <button className="flex items-center gap-1 rounded-full px-2 py-1 text-[13px] text-neutral-500 hover:bg-base-100">
            <Globe size={14} />
            EN
          </button>
        </div>

        {/* Auth */}
        {isLoading ? (
          <div className="h-8 w-20 skeleton rounded-lg" />
        ) : user ? (
          <div className="hidden items-center gap-2 md:flex">
            <button className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-base-100">
              <Bell size={16} />
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              {(user.firstName?.[0] ?? user.email?.[0] ?? "U").toUpperCase()}
            </div>
            <button
              onClick={logout}
              className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs text-neutral-500 hover:text-neutral-900"
            >
              <LogOut size={13} />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="hidden rounded-lg bg-primary px-4 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-primary-dark md:block"
          >
            Sign in
          </Link>
        )}

        {/* Mobile toggle */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-base-200 bg-white px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            <Link href="/" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-base-100" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link href="/listings" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-base-100" onClick={() => setMobileOpen(false)}>Explore</Link>
            {user && (
              <Link href="/dashboard" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-base-100" onClick={() => setMobileOpen(false)}>Dashboard</Link>
            )}
            {!user && (
              <Link href="/login" className="mt-1 rounded-lg bg-primary px-3 py-2 text-center text-sm font-semibold text-white" onClick={() => setMobileOpen(false)}>Sign in</Link>
            )}
            {user && (
              <button onClick={() => { logout(); setMobileOpen(false); }} className="rounded-lg px-3 py-2 text-left text-sm text-neutral-500 hover:bg-base-100">
                Sign out
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
