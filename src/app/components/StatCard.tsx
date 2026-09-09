import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

interface Props {
  label: string;
  value: string | number;
  sub?: string;
  icon?: ReactNode;
  accent?: boolean;
}

export default function StatCard({ label, value, sub, icon, accent }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-xl border p-5 transition-shadow hover:shadow-sm",
        accent
          ? "border-primary/20 bg-primary-50"
          : "border-base-200 bg-white",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          {label}
        </span>
        {icon && <span className="text-neutral-400">{icon}</span>}
      </div>
      <span className="text-2xl font-bold text-neutral-900">{value}</span>
      {sub && <span className="text-xs text-neutral-500">{sub}</span>}
    </div>
  );
}
