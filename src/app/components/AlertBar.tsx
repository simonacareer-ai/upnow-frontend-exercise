"use client";

export default function AlertBar({
  absentCount,
  strandedCount,
  overdueCount,
  blockingLabel,
  clock,
  onAutoBalance,
  onQuickFix,
  onSnooze,
  snoozedUntilLabel,
}: {
  absentCount: number;
  strandedCount: number;
  overdueCount: number;
  blockingLabel: string;
  clock: string;
  onAutoBalance: () => void;
  onQuickFix: () => void;
  onSnooze: () => void;
  snoozedUntilLabel: string | null;
}) {
  const isCalm = absentCount === 0 && strandedCount === 0 && overdueCount === 0;

  if (snoozedUntilLabel) {
    return (
      <div className="incident is-calm" role="status">
        <div className="incident__icon" aria-hidden>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 3" />
          </svg>
        </div>
        <div className="incident__body">
          <div className="incident__meta">
            <span className="incident__level">SNOOZED</span>
            <span className="incident__time">Alerts resume {snoozedUntilLabel}</span>
          </div>
          <div className="incident__headline">Incident muted — the crisis matrix below still updates live.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`incident${isCalm ? " is-calm" : ""}`} role="alert">
      <div className="incident__icon" aria-hidden>
        {isCalm ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L1 21h22L12 2z" />
            <path d="M12 9v5M12 17.5h.01" />
          </svg>
        )}
      </div>

      <div className="incident__body">
        <div className="incident__meta">
          <span className="incident__level">{isCalm ? "ALL CLEAR" : "INCIDENT LEVEL 1"}</span>
          <span className="incident__time">Peak Rush · {clock}</span>
        </div>
        <div className="incident__headline">
          {isCalm ? (
            "No blockers, nobody stranded, nothing overdue — floor is running clean."
          ) : (
            <>
              {absentCount} Absent · {strandedCount} Stranded Tasks · {blockingLabel}
            </>
          )}
        </div>
      </div>

      {!isCalm && (
        <div className="incident__actions">
          <button type="button" className="btn btn-accent" onClick={onAutoBalance}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
            </svg>
            Auto-Balance ({strandedCount})
          </button>
          <button type="button" className="btn" onClick={onQuickFix}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Quick Fix
          </button>
          <button type="button" className="incident__snooze" onClick={onSnooze}>
            Snooze 5m
          </button>
        </div>
      )}
    </div>
  );
}
