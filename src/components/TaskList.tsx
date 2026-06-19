import { SharedTaskCard } from "@/components/SharedTaskCard";
import type { EditSharedTaskInput } from "@/hooks/useSharedTasks";
import type { CollaboratorId, SharedTask } from "@/types";

type TaskListProps = {
  tasks: SharedTask[];
  emptyLabel: string;
  actor: CollaboratorId;
  pendingKeys: Set<string>;
  onCompletion: (taskId: string, completed: boolean) => Promise<void>;
  onEdit: (taskId: string, patch: EditSharedTaskInput) => Promise<void>;
};

export function TaskList({ tasks, emptyLabel, actor, pendingKeys, onCompletion, onEdit }: TaskListProps) {
  if (tasks.length === 0) {
    return <div className="rounded-md border border-dashed border-slate-200 p-5 text-sm text-slate-500">{emptyLabel}</div>;
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <SharedTaskCard
          key={task.id}
          task={task}
          actor={actor}
          pending={pendingKeys.has(task.id)}
          onCompletion={onCompletion}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
