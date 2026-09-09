import type { OccupancyRow } from "@/lib/types";

interface Props {
  rows: OccupancyRow[];
}

function pct(n?: number): string {
  if (n == null) return "—";
  return `${(n * (n <= 1 ? 100 : 1)).toFixed(1)}%`;
}

function currency(n?: number): string {
  if (n == null) return "—";
  return n.toLocaleString("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  });
}

export default function OccupancyTable({ rows }: Props) {
  if (!rows.length) {
    return (
      <p className="py-8 text-center text-sm text-neutral-500">
        No occupancy data available.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-base-200">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-base-200 bg-base-100 text-xs font-medium uppercase tracking-wide text-neutral-500">
            <th className="px-4 py-3">Property</th>
            <th className="px-4 py-3 text-right">Total</th>
            <th className="px-4 py-3 text-right">Occupied</th>
            <th className="px-4 py-3 text-right">Vacant</th>
            <th className="px-4 py-3 text-right">Rate</th>
            <th className="px-4 py-3 text-right">Contracted Rent</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.propertyId ?? i}
              className="border-b border-base-200 last:border-0 hover:bg-base-100/50"
            >
              <td className="px-4 py-3 font-medium text-neutral-900">
                {row.buildingName ??
                  row.property?.buildingName ??
                  `Property ${row.propertyId ?? i + 1}`}
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {row.totalUnits ?? "—"}
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-primary">
                {row.occupiedUnits ?? "—"}
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-error">
                {row.vacantUnits ?? "—"}
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {pct(row.occupancyRate)}
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {currency(row.contractedRent)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
