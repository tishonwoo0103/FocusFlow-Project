import { RefreshCw, Users } from "lucide-react";
import { Badge } from "@/components/Badge";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { SharedStorageState } from "@/components/SharedStorageState";
import { SharedTaskCard } from "@/components/SharedTaskCard";
import { useSharedTasks } from "@/hooks/useSharedTasks";
import { sortTasksByDate } from "@/lib/selectors";

const actorLabel = (value: string) => value === "tishon" ? "Tishon" : "Mia";

const activityTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
};

export default function CollaboratorPage() {
  const shared = useSharedTasks();
  const activeTasks = sortTasksByDate(shared.tasks.filter((task) => task.status !== "Completed")).slice(0, 8);
  const completedTasks = shared.tasks.filter((task) => task.status === "Completed").length;

  return (
    <Layout title="Collaborator Mode">
      <PageHeader title="Collaborator Mode" eyebrow="Truly Shared Team Tasks">
        <Badge tone="blue">Tishon + Mia</Badge>
        <Badge tone="green">Shared</Badge>
      </PageHeader>

      <SharedStorageState
        actor={shared.actor}
        setActor={shared.setActor}
        error={shared.error}
        needsBootstrap={shared.needsBootstrap}
        pendingKeys={shared.pendingKeys}
        retry={shared.refresh}
        bootstrap={shared.bootstrap}
      />

      <section className="surface mt-6 p-5">
        <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-brand-700">
              <Users aria-hidden="true" className="h-4 w-4" />
              Shared Build Lane
            </div>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">One task list, two completion signals</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Every task belongs to the FocusFlow team. The selector records who made each update; it does not create ownership or permissions.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="label">Shared Tasks</div>
              <div className="mt-2 text-2xl font-bold text-slate-950">{shared.tasks.length}</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="label">In Progress</div>
              <div className="mt-2 text-2xl font-bold text-slate-950">{shared.tasks.filter((task) => task.status === "In Progress").length}</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="label">Completed Together</div>
              <div className="mt-2 text-2xl font-bold text-slate-950">{completedTasks}</div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Shared Team Tasks">
          {activeTasks.length === 0 ? (
            <div className="rounded-md border border-dashed border-slate-200 p-5 text-sm text-slate-500">
              {shared.loading ? "Loading shared tasks..." : "No active shared tasks."}
            </div>
          ) : (
            <div className="space-y-3">
              {activeTasks.map((task) => (
                <SharedTaskCard
                  key={task.id}
                  task={task}
                  actor={shared.actor}
                  pending={shared.pendingKeys.has(task.id)}
                  onCompletion={shared.setCompletion}
                  onEdit={shared.editTask}
                />
              ))}
            </div>
          )}
        </Panel>

        <Panel
          title="Shared Activity"
          actions={
            <button aria-label="Refresh activity" className="icon-button hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 focus:ring-brand-100" title="Refresh activity" onClick={shared.refresh}>
              <RefreshCw aria-hidden="true" className="h-4 w-4" />
            </button>
          }
        >
          {shared.activity.length === 0 ? (
            <div className="rounded-md border border-dashed border-slate-200 p-5 text-sm text-slate-500">No shared activity yet.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {shared.activity.slice(0, 20).map((item) => (
                <div key={item.id} className="py-3">
                  <p className="text-sm text-slate-700">
                    <span className="font-bold text-slate-950">{actorLabel(item.actor)}</span> {item.action}: {item.targetTitle}
                  </p>
                  <time className="mt-1 block text-xs font-semibold text-slate-500">{activityTime(item.timestamp)}</time>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </Layout>
  );
}
