"use client";

export default function PriorityCard({
  label,
  value,
  unit,
  unitIsPill,
  sub,
  dotClass,
  tone,
  toneSoft,
  icon,
  active,
  onClick,
}: {
  label: string;
  value: string | number;
  unit?: string;
  unitIsPill?: boolean;
  sub: string;
  dotClass?: string;
  tone: string;
  toneSoft: string;
  icon: JSX.Element;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={`priority-card${active ? " is-active" : ""}`}
      style={{ ["--tone" as string]: tone, ["--tone-soft" as string]: toneSoft }}
      onClick={onClick}
      aria-pressed={active}
    >
      <div className="priority-card__top">
        <span className="priority-card__label">{label}</span>
        <span className="priority-card__icon" aria-hidden>
          {icon}
        </span>
      </div>
      <div className="priority-card__value">
        <span className="priority-card__num">{value}</span>
        {unit && <span className={`priority-card__unit${unitIsPill ? " is-pill" : ""}`}>{unit}</span>}
      </div>
      <div className="priority-card__sub">
        {dotClass && <span className={`dot ${dotClass}`} aria-hidden />}
        {sub}
      </div>
    </button>
  );
}
