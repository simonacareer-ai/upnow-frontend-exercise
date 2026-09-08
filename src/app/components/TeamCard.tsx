"use client";

import { useState } from "react";
import { TeamMember } from "../data/mockData";

const STATUS_TONE: Record<TeamMember["status"], { tone: string; label: string }> = {
  Ready: { tone: "var(--free)", label: "READY" },
  Free: { tone: "var(--free)", label: "FREE" },
  Busy: { tone: "var(--warning)", label: "BUSY" },
  Overloaded: { tone: "var(--overload)", label: "OVERLOAD" },
  Absent: { tone: "var(--absent)", label: "ABSENT" },
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function TeamCard({
  member,
  isDragActive,
  wouldOverload,
  onDrop,
  onReassignTasks,
}: {
  member: TeamMember;
  isDragActive: boolean;
  wouldOverload: boolean;
  onDrop: (memberId: string) => void;
  onReassignTasks?: (memberId: string) => void;
}) {
  const [hover, setHover] = useState(false);
  const tone = STATUS_TONE[member.status];
  const isAbsent = member.status === "Absent";
  const isDropTarget = isDragActive && !isAbsent;

  return (
    <div
      className={[
        "member",
        isAbsent ? "is-absent" : "",
        isDropTarget ? "is-drop-target" : "",
        isDropTarget && hover ? "is-drop-hover" : "",
        wouldOverload ? "is-drop-risky" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onDragOver={(e) => {
        if (!isDropTarget) return;
        e.preventDefault();
        setHover(true);
      }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => {
        e.preventDefault();
        setHover(false);
        if (isDropTarget) onDrop(member.id);
      }}
    >
      <div className="member__top">
        <div className="member__id">
          <span className="avatar">{initials(member.name)}</span>
          <div className="member__name-wrap">
            <span className="member__name">{member.name}</span>
            <span className="member__role">{member.role}</span>
          </div>
        </div>
        {!isAbsent && (
          <span className="status-pill" style={{ ["--tone" as string]: tone.tone, ["--tone-soft" as string]: "transparent" }}>
            {tone.label}
          </span>
        )}
      </div>

      {!isAbsent && (
        <>
          <div className="load-bar">
            <div
              className="load-bar__fill"
              style={{ width: `${Math.min(member.load, 100)}%`, ["--tone" as string]: tone.tone }}
            />
          </div>
          <div className="member__foot">
            <span>{member.note ?? (member.status === "Overloaded" ? "Over shift capacity" : "On shift")}</span>
            <span className="member__load-pct" style={{ ["--tone" as string]: tone.tone }}>
              {member.load}% LOAD
            </span>
          </div>
          {member.status === "Overloaded" && (
            <div className="member__foot">
              <span />
              <button type="button" className="btn btn-sm btn-ghost" style={{ color: "var(--overdue)" }}>
                Offload
              </button>
            </div>
          )}
          {isDropTarget && (
            <div className="member__foot">
              <span className={wouldOverload ? "member__foot-tag is-danger" : "member__foot-tag"}>
                {wouldOverload ? "Will exceed capacity" : "Drop here to assign"}
              </span>
            </div>
          )}
        </>
      )}

      {isAbsent && (
        <div className="member__foot">
          <span>{member.strandedTaskIds?.length ?? 0} stranded tasks</span>
          {onReassignTasks && (member.strandedTaskIds?.length ?? 0) > 0 && (
            <button type="button" className="btn btn-sm btn-danger" onClick={() => onReassignTasks(member.id)}>
              Reassign ({member.strandedTaskIds!.length})
            </button>
          )}
        </div>
      )}
    </div>
  );
}
