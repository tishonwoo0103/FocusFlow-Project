import { useEffect, useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { Badge, statusTone } from "@/components/Badge";
import { formatShortDate } from "@/lib/format";
import type { EditSharedTaskInput } from "@/hooks/useSharedTasks";
import type { CollaboratorId, SharedTask } from "@/types";

const collaboratorLabel = (actor: CollaboratorId) => actor === "tishon" ? "Tishon" : "Mia";

const formatTimestamp = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
};

type SharedTaskCardProps = {
  task: SharedTask;
  actor: CollaboratorId;
  pending: boolean;
  detailed?: boolean;
  onCompletion: (taskId: string, completed: boolean) => Promise<void>;
  onEdit: (taskId: string, patch: EditSharedTaskInput) => Promise<void>;
  onDelete?: (taskId: string) => Promise<void>;
};

export function SharedTaskCard({ task, actor, pending, detailed = false, onCompletion, onEdit, onDelete }: SharedTaskCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<EditSharedTaskInput>({
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    estimatedTime: task.estimatedTime
  });

  useEffect(() => {
    if (!editing) {
      setDraft({ title: task.title, description: task.description, dueDate: task.dueDate, estimatedTime: task.estimatedTime });
    }
  }, [editing, task.description, task.dueDate, task.estimatedTime, task.title]);

  const saveEdit = async () => {
    try {
      await onEdit(task.id, draft);
      setEditing(false);
    } catch {
      // The shared storage banner reports the failed save and keeps the draft open.
    }
  };

  const removeTask = async () => {
    if (onDelete && window.confirm(`Delete "${task.title}" for both collaborators?`)) {
      try {
        await onDelete(task.id);
      } catch {
        // The shared storage banner reports the failed deletion.
      }
    }
  };

  return (
    <article className={`rounded-lg border p-4 ${task.status === "Completed" ? "border-emerald-200 bg-emerald-50/70" : "border-slate-200 bg-white"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className={`font-bold ${task.status === "Completed" ? "text-slate-500 line-through" : "text-slate-950"}`}>{task.title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{task.description || task.whatToDo}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button aria-label={editing ? "Close task editor" : "Edit task"} className="icon-button hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 focus:ring-brand-100" title={editing ? "Close task editor" : "Edit task"} disabled={pending} onClick={() => setEditing((value) => !value)}>
            {editing ? <X aria-hidden="true" className="h-4 w-4" /> : <Pencil aria-hidden="true" className="h-4 w-4" />}
          </button>
          {onDelete ? (
            <button aria-label="Delete task" className="icon-button" title="Delete task" disabled={pending} onClick={() => void removeTask()}>
              <Trash2 aria-hidden="true" className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Badge tone={statusTone(task.status)}>{task.status}</Badge>
        <Badge>{task.estimatedTime}</Badge>
        <Badge tone="blue">{task.stage}</Badge>
        <Badge>{formatShortDate(task.dueDate)}</Badge>
      </div>

      {detailed && task.checklist.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {task.checklist.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm leading-6 text-slate-700">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
              {item}
            </li>
          ))}
        </ul>
      ) : null}

      {detailed && task.deliverable ? (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
          <div className="text-xs font-bold text-emerald-800">Deliverable</div>
          <p className="mt-1 text-sm leading-6 text-emerald-900">{task.deliverable}</p>
        </div>
      ) : null}

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {(["tishon", "mia"] as const).map((collaborator) => (
          <label key={collaborator} className={`flex min-h-10 items-center gap-3 rounded-md border px-3 text-sm font-semibold ${task.completedBy[collaborator] ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-slate-50 text-slate-700"}`}>
            <input
              type="checkbox"
              checked={task.completedBy[collaborator]}
              disabled={pending || actor !== collaborator}
              onChange={(event) => void onCompletion(task.id, event.target.checked).catch(() => undefined)}
            />
            {collaboratorLabel(collaborator)} Completed
          </label>
        ))}
      </div>

      <div className="mt-3 text-xs leading-5 text-slate-500">
        Created by {collaboratorLabel(task.createdBy)} · {formatTimestamp(task.createdAt)}
        <span className="mx-2">|</span>
        Updated by {collaboratorLabel(task.lastUpdatedBy)} · {formatTimestamp(task.lastUpdatedAt)}
      </div>

      {editing ? (
        <div className="mt-4 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <label className="grid gap-2">
            <span className="label">Title</span>
            <input className="input" maxLength={120} value={draft.title ?? ""} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} />
          </label>
          <label className="grid gap-2">
            <span className="label">Description</span>
            <textarea className="textarea" maxLength={1000} value={draft.description ?? ""} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="label">Date</span>
              <input className="input" type="date" value={draft.dueDate ?? ""} onChange={(event) => setDraft((current) => ({ ...current, dueDate: event.target.value }))} />
            </label>
            <label className="grid gap-2">
              <span className="label">Estimated Time</span>
              <input className="input" maxLength={60} value={draft.estimatedTime ?? ""} onChange={(event) => setDraft((current) => ({ ...current, estimatedTime: event.target.value }))} />
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <button className="btn-secondary" disabled={pending} onClick={() => setEditing(false)}>Cancel</button>
            <button className="btn" disabled={pending || !draft.title?.trim() || !draft.dueDate || !draft.estimatedTime?.trim()} onClick={() => void saveEdit()}>
              {pending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      ) : null}
    </article>
  );
}
