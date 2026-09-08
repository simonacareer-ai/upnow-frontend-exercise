"use client";

import { useEffect, useState } from "react";
import { Task, TeamMember } from "../data/mockData";

function statusPillClass(status: TeamMember["status"]) {
  if (status === "Overloaded") return "staff-option__status is-overload";
  if (status === "Busy") return "staff-option__status is-busy";
  return "staff-option__status";
}

function statusLabel(status: TeamMember["status"]) {
  if (status === "Overloaded") return "Overloaded";
  if (status === "Busy") return "Busy";
  if (status === "Ready") return "Ready";
  return "Free";
}

export default function AssignModal({
  task,
  candidates,
  taskCountByMember,
  onCancel,
  onConfirm,
}: {
  task: Task;
  candidates: TeamMember[];
  taskCountByMember: Record<string, number>;
  onCancel: () => void;
  onConfirm: (memberId: string) => void;
}) {
  const isCritical = task.status === "Critical" || task.status === "Overdue";
  const tone = isCritical ? "var(--overdue)" : "var(--accent)";
  const toneSoft = isCritical ? "var(--overdue-soft)" : "var(--accent-soft)";

  const preselected = candidates.find((c) => c.status === "Ready" || c.status === "Free") ?? candidates[0];
  const [selectedId, setSelectedId] = useState<string | undefined>(preselected?.id);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const selectedMember = candidates.find((c) => c.id === selectedId);
  const willOverload = selectedMember ? selectedMember.load + Math.round(task.estMinutes * 1.4) > 100 : false;

  return (
    <div
      className="modal-overlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="assign-modal-title"
        style={{ ["--tone" as string]: tone, ["--tone-soft" as string]: toneSoft }}
      >
        <div className="modal__body">
          <div>
            <div className="modal__title" id="assign-modal-title">
              Assign task
            </div>
            <div className="modal__subtitle">
              Choose available staff for {isCritical ? "the critical task" : "this task"}.
            </div>
          </div>

          <div className="modal__task-card">
            <div className="modal__task-top">
              <span className="modal__task-name">{task.name}</span>
              <span className="modal__task-due" style={{ ["--tone" as string]: tone }}>
                {task.dueLabel}
              </span>
            </div>
            <div>
              <span className="status-pill" style={{ ["--tone" as string]: tone, ["--tone-soft" as string]: toneSoft }}>
                {task.status === "Blocked" ? "Blocked" : task.status === "Critical" ? "Blocked · Critical" : task.status}
              </span>
            </div>
            {(task.blocking || task.dependency) && (
              <div className="modal__task-detail">{task.blocking ?? task.dependency}</div>
            )}
          </div>

          <div>
            <div className="modal__section-label" style={{ marginBottom: 10 }}>
              Available staff
            </div>
            <div className="staff-list">
              {candidates.length === 0 && <div className="empty-note">No one else is free to take this right now.</div>}
              {candidates.map((member) => {
                const selected = member.id === selectedId;
                const overloaded = member.status === "Overloaded";
                return (
                  <button
                    key={member.id}
                    type="button"
                    className={`staff-option${selected ? " is-selected" : ""}`}
                    onClick={() => setSelectedId(member.id)}
                    aria-pressed={selected}
                    style={overloaded ? { opacity: 0.55 } : undefined}
                  >
                    <span className="staff-option__radio">{selected && <span className="staff-option__radio-dot" />}</span>
                    <span className="staff-option__id">
                      <span className="staff-option__name">{member.name}</span>
                      <span className="staff-option__meta">
                        {member.role.split(" ·")[0]} · {taskCountByMember[member.id] ?? 0} task
                        {(taskCountByMember[member.id] ?? 0) === 1 ? "" : "s"} assigned
                      </span>
                    </span>
                    <span className={statusPillClass(member.status)}>{statusLabel(member.status)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {task.blocking && (
            <div className="risk-banner">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L1 21h22L12 2z" />
                <path d="M12 9v5M12 17.5h.01" />
              </svg>
              <span>
                Assigning this task is necessary to protect the{" "}
                {task.blocking.replace("Blocks ", "").replace(/\s*\(#\d+\)/, "")}.
              </span>
            </div>
          )}

          {!task.blocking && willOverload && selectedMember && (
            <div className="risk-banner">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L1 21h22L12 2z" />
                <path d="M12 9v5M12 17.5h.01" />
              </svg>
              <span>
                {selectedMember.name.split(" ")[0]} is already at {selectedMember.load}% load — this will push them over
                capacity.
              </span>
            </div>
          )}
        </div>

        <div className="modal__footer">
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className={isCritical ? "btn btn-danger" : "btn btn-accent"}
            disabled={!selectedId}
            onClick={() => selectedId && onConfirm(selectedId)}
          >
            Assign task
          </button>
        </div>
      </div>
    </div>
  );
}
