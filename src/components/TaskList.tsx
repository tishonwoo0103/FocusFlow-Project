import { Badge, statusTone } from "@/components/Badge";
import { formatShortDate } from "@/lib/format";
import { taskStatuses, type Task, type TaskStatus } from "@/types";

type TaskListProps = {
  tasks: Task[];
  emptyLabel: string;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
};

export function TaskList({ tasks, emptyLabel, onStatusChange }: TaskListProps) {
  if (tasks.length === 0) {
    return <div className="rounded-md border border-dashed border-slate-200 p-5 text-sm text-slate-500">{emptyLabel}</div>;
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <article
          key={task.id}
          className={`rounded-lg border p-4 ${
            task.status === "Completed" ? "border-emerald-200 bg-emerald-50/70 text-slate-500" : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h3 className={`font-bold ${task.status === "Completed" ? "text-slate-500 line-through" : "text-slate-950"}`}>{task.title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">{task.whatToDo}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="blue">{task.stage}</Badge>
                <Badge tone={statusTone(task.status)}>{task.status}</Badge>
                <Badge>{task.estimatedTime || "30 minutes"}</Badge>
                <Badge>{formatShortDate(task.dueDate)}</Badge>
                <Badge>{task.deliverable}</Badge>
              </div>
            </div>
            {onStatusChange ? (
              <select
                aria-label={`Change state for ${task.title}`}
                className="select sm:w-40"
                value={task.status}
                onChange={(event) => onStatusChange(task.id, event.target.value as TaskStatus)}
              >
                {taskStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
