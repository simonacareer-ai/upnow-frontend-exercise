"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { fetchExecutiveSummary, fetchOccupancy, ApiError } from "@/lib/api";
import type { ExecutiveSummary, OccupancyRow } from "@/lib/types";
import StatCard from "../components/StatCard";
import OccupancyTable from "../components/OccupancyTable";
import {
  Building2,
  DollarSign,
  TrendingUp,
  Users,
  Loader2,
  LogIn,
  AlertTriangle,
} from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

export default function DashboardPage() {
  const router = useRouter();
  const { token, user, isLoading: authLoading } = useAuth();

  const [summary, setSummary] = useState<ExecutiveSummary | null>(null);
  const [occupancy, setOccupancy] = useState<OccupancyRow[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    if (!token) return;
    setStatus("loading");
    setError("");
    try {
      const [sum, occ] = await Promise.all([
        fetchExecutiveSummary(token),
        fetchOccupancy(token, "all"),
      ]);
      setSummary(sum);
      const rows: OccupancyRow[] =
        (occ as Record<string, unknown>).items as OccupancyRow[] ??
        (occ as Record<string, unknown>).data as OccupancyRow[] ??
        (occ as Record<string, unknown>).properties as OccupancyRow[] ??
        (Array.isArray(occ) ? occ : []);
      setOccupancy(rows);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      if (err instanceof ApiError) {
        setError(
          err.status === 401
            ? "Session expired. Please sign in again."
            : err.message,
        );
      } else {
        setError("Failed to load dashboard data.");
      }
    }
  }, [token]);

  useEffect(() => {
    if (token) loadData();
  }, [token, loadData]);

  /* ── Not signed in ─────────────────────────── */
  if (!authLoading && !token) {
    return (
      <main className="mx-auto flex max-w-lg flex-col items-center gap-4 px-6 py-20 text-center">
        <LogIn size={40} className="text-neutral-400" />
        <h2 className="text-xl font-semibold text-neutral-900">
          Sign in to view your dashboard
        </h2>
        <p className="text-sm text-neutral-500">
          The dashboard shows portfolio stats that require authentication.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="mt-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          Sign in
        </button>
      </main>
    );
  }

  /* ── Loading ───────────────────────────────── */
  if (authLoading || status === "loading" || status === "idle") {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <div className="skeleton h-7 w-48" />
          <div className="skeleton mt-2 h-4 w-72" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-xl" />
          ))}
        </div>
        <div className="mt-8 skeleton h-64 rounded-xl" />
      </main>
    );
  }

  /* ── Error ─────────────────────────────────── */
  if (status === "error") {
    return (
      <main className="mx-auto flex max-w-lg flex-col items-center gap-4 px-6 py-20 text-center">
        <AlertTriangle size={40} className="text-warning" />
        <h2 className="text-xl font-semibold">Dashboard unavailable</h2>
        <p className="text-sm text-neutral-500">{error}</p>
        <button
          onClick={loadData}
          className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          Retry
        </button>
      </main>
    );
  }

  /* ── Helpers ───────────────────────────────── */
  function num(v: unknown): number | null {
    if (typeof v === "number") return v;
    if (typeof v === "string" && !isNaN(Number(v))) return Number(v);
    return null;
  }

  function fmtCurrency(v: unknown): string {
    const n = num(v);
    if (n == null) return "—";
    return n.toLocaleString("en-AE", {
      style: "currency",
      currency: "AED",
      maximumFractionDigits: 0,
    });
  }

  function fmtPct(v: unknown): string {
    const n = num(v);
    if (n == null) return "—";
    return `${(n <= 1 ? n * 100 : n).toFixed(1)}%`;
  }

  function fmtNum(v: unknown): string {
    const n = num(v);
    if (n == null) return "—";
    return n.toLocaleString();
  }

  /* ── Render KPIs ───────────────────────────── */
  const s = summary ?? {};

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Portfolio overview for{" "}
          <span className="font-medium text-neutral-700">
            {user?.firstName ?? user?.email ?? `User #${user?.id}`}
          </span>
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Properties"
          value={fmtNum(s.totalProperties)}
          icon={<Building2 size={18} />}
        />
        <StatCard
          label="Total Units"
          value={fmtNum(s.totalUnits)}
          icon={<Users size={18} />}
        />
        <StatCard
          label="Occupancy Rate"
          value={fmtPct(s.occupancyRate)}
          accent
          icon={<TrendingUp size={18} />}
        />
        <StatCard
          label="Contracted Rent"
          value={fmtCurrency(s.totalContractedRent)}
          icon={<DollarSign size={18} />}
        />
      </div>

      {/* Secondary stats row */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {s.occupiedUnits != null && (
          <StatCard label="Occupied Units" value={fmtNum(s.occupiedUnits)} />
        )}
        {s.vacantUnits != null && (
          <StatCard label="Vacant Units" value={fmtNum(s.vacantUnits)} />
        )}
        {s.totalCollectedRent != null && (
          <StatCard label="Collected Rent" value={fmtCurrency(s.totalCollectedRent)} />
        )}
        {s.collectionRate != null && (
          <StatCard label="Collection Rate" value={fmtPct(s.collectionRate)} />
        )}
        {s.outstandingBalance != null && (
          <StatCard label="Outstanding" value={fmtCurrency(s.outstandingBalance)} />
        )}
        {s.upcomingRenewals != null && (
          <StatCard label="Upcoming Renewals" value={fmtNum(s.upcomingRenewals)} />
        )}
      </div>

      {/* Occupancy table */}
      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">
          Occupancy by Property
        </h2>
        <OccupancyTable rows={occupancy} />
      </section>
    </main>
  );
}
