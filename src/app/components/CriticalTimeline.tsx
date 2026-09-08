"use client";

import { criticalPath } from "../data/mockData";

const STATE_TONE: Record<string, { tone: string; toneSoft: string }> = {
  BLOCKER: { tone: "var(--overdue)", toneSoft: "var(--overdue-soft)" },
  WAITING: { tone: "var(--warning)", toneSoft: "var(--warning-soft)" },
  QUEUED: { tone: "var(--blocked)", toneSoft: "var(--blocked-soft)" },
  READY: { tone: "var(--free)", toneSoft: "var(--free-soft)" },
};

export default function CriticalTimeline({ onExpediteAll }: { onExpediteAll: () => void }) {
  const atRisk = criticalPath.riskMinutes < 0;

  return (
    <div className="panel timeline-panel">
      <div className="timeline-head">
        <div className="timeline-head__left">
          <span className="timeline-head__icon" aria-hidden>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="5" cy="6" r="2" />
              <circle cx="5" cy="18" r="2" />
              <circle cx="19" cy="12" r="2" />
              <path d="M7 6h6a4 4 0 014 4M7 18h6a4 4 0 004-4" />
            </svg>
          </span>
          <span className="timeline-head__title">
            Order #{criticalPath.orderRef} Critical Path ({criticalPath.label === "Corporate Lunch" ? "150 Bento" : criticalPath.label})
          </span>
          <span className={`risk-tag${atRisk ? "" : " on-track"}`}>
            {atRisk ? `RISK: ${criticalPath.riskMinutes}M` : "ON TRACK"}
          </span>
        </div>
        <div className="timeline-head__right">
          <span className="timeline-head__target">
            Target Departure: <span className="mono">{criticalPath.target}</span>
          </span>
          <button type="button" className="btn btn-accent" onClick={onExpediteAll}>
            Expedite All
          </button>
        </div>
      </div>

      <div className="steps">
        {criticalPath.steps.map((step) => {
          const tone = STATE_TONE[step.state];
          return (
            <div key={step.index} className="step" style={{ ["--tone" as string]: tone.tone }}>
              <div className="step__top">
                <span className="step__index">
                  {step.index} · {step.time}
                </span>
                <span
                  className="status-pill"
                  style={{ ["--tone" as string]: tone.tone, ["--tone-soft" as string]: tone.toneSoft }}
                >
                  {step.state}
                </span>
              </div>
              <span className="step__title">{step.title}</span>
              <span className="step__detail">{step.detail}</span>
              <div className="step__foot">
                <span className="step__minutes">{step.minutes}</span>
                {step.cta ? (
                  <button type="button" className="step__cta">
                    {step.cta}
                  </button>
                ) : (
                  <span className="step__tag">{step.tag}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
