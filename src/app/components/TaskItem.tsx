"use client";

import { Task, TeamMember } from "../data/mockData";

const STATUS_TONE: Record<Task["status"], { tone: string; toneSoft: string; label: string }> = {
  Overdue: { tone: "var(--overdue)", toneSoft: "var(--overdue-soft)", label: "Overdue" },
  Critical: { tone: "var(--overdue)", toneSoft: "var(--overdue-soft)", label: "Critical" },
  DueSoon: { tone: "var(--warning)", toneSoft: "var(--warning-soft)", label: "Due Soon" },
  Blocked: { tone: "var(--blocked)", toneSoft: "var(--blocked-soft)", label: "Blocked" },
  Queued: { tone: "var(--ink-lo)", toneSoft: "var(--panel-hover)", label: "Queued" },
};

function statusText(task: Task) {
  if (task.status === "Critical") return `CRITICAL · +${task.overdueMinutes}M`;
  if (task.status === "Overdue") return `OVERDUE +${task.overdueMinutes}M`;
  return STATUS_TONE[task.status].label.toUpperCase();
}

export default function TaskItem({
  task,
  assignee,
  strandedFromMember,
  onDragStart,
  onDragEnd,
  onMarkUrgent,
  onUnblock,
  onOpenAssign,
  quickAssignTarget,
}: {
  task: Task;
  assignee?: TeamMember;
  strandedFromMember?: TeamMember;
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
  onMarkUrgent: (taskId: string) => void;
  onUnblock: (taskId: string) => void;
  onOpenAssign: (taskId: string) => void;
  quickAssignTarget?: TeamMember;
}) {
  const tone = STATUS_TONE[task.status];
  const isStranded = !!strandedFromMember;
  const isUnassigned = !task.assignedTo;

  return (
    <div
      className="task"
      style={{ ["--tone" as string]: tone.tone, ["--tone-soft" as string]: tone.toneSoft }}
      draggable={isUnassigned}
      onDragStart={() => onDragStart(task.id)}
      onDragEnd={onDragEnd}
      aria-grabbed={isUnassigned}
    >
      <div className="task__main">
        <div className="task__top">
          <span className="status-pill">{statusText(task)}</span>
          <span className="chip-outline">{task.station}</span>
          {isStranded && (
            <span className="task__flag is-stranded">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
              </svg>
              Stranded ({strandedFromMember!.name})
            </span>
          )}
          {task.dependency && !isStranded && (
            <span className="task__flag is-dep">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="4" y="10" width="16" height="10" rx="2" />
                <path d="M8 10V7a4 4 0 018 0v3" />
              </svg>
              {task.dependency}
            </span>
          )}
          <span className="task__spacer" />
          <span className="task__est mono">{task.dueLabel}</span>
        </div>

        <div className="task__name">{task.name}</div>

        {task.blocking ? (
          <div className="task__detail is-blocking">{task.blocking}</div>
        ) : assignee ? (
          <div className="task__detail">
            {task.status === "Blocked" ? "Waiting on dependency · " : "Lead: "}
            {assignee.name}
          </div>
        ) : (
          <div className="task__detail">Unassigned — needs a cook</div>
        )}
      </div>

      <div className="task__side">
        {task.quantityLabel && <span className="task__pax mono">{task.quantityLabel}</span>}
        <div className="task__actions">
          {task.status === "Blocked" ? (
            <button type="button" className="btn btn-sm" onClick={() => onUnblock(task.id)}>
              Unblock
            </button>
          ) : isUnassigned ? (
            <button
              type="button"
              className={`btn btn-sm ${task.status === "Critical" || task.status === "Overdue" ? "btn-danger" : "btn-accent"}`}
              onClick={() => onOpenAssign(task.id)}
              disabled={!quickAssignTarget}
            >
              Assign
            </button>
          ) : (
            <button type="button" className="btn btn-sm" onClick={() => onOpenAssign(task.id)} disabled={!quickAssignTarget}>
              Reassign
            </button>
          )}
          {task.priority !== "Urgent" && (
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => onMarkUrgent(task.id)}>
              Mark Urgent
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
