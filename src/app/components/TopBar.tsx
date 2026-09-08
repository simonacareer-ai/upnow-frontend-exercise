"use client";

import { useState } from "react";

export default function TopBar({ clock, phase }: { clock: string; phase: string }) {
  const [soundOn, setSoundOn] = useState(true);

  return (
    <header className="topbar">
      <div className="topbar__group">
        <span className="topbar__label">SITE</span>
        <button type="button" className="topbar__site">
          HUB-04: CENTRAL METRO
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      <div className="topbar__shift">
        <span className="dot dot-free" aria-hidden />
        Rush Shift <span className="mono">10:00–14:00</span>
      </div>

      <div className="topbar__clock" role="status" aria-label={`Current time ${clock}, ${phase}`}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </svg>
        <span className="topbar__clock-time">{clock}</span>
        <span className="topbar__clock-phase">{phase}</span>
      </div>

      <div className="topbar__spacer" />

      <button
        type="button"
        className={`sound-toggle${soundOn ? " is-on" : ""}`}
        aria-pressed={soundOn}
        onClick={() => setSoundOn((v) => !v)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          {soundOn && <path d="M19 5a13 13 0 010 14M15.5 8.5a7 7 0 010 7" />}
        </svg>
        SOUND {soundOn ? "ON" : "OFF"}
      </button>

      <div className="user-chip">
        <span className="user-chip__avatar">RM</span>
        <div>
          <div className="user-chip__name">Rania M.</div>
          <div className="user-chip__role">Shift Lead Supervisor</div>
        </div>
      </div>
    </header>
  );
}
