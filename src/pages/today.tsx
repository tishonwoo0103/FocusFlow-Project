import { CalendarClock, Flag, MapPinned } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { SharedStorageState } from "@/components/SharedStorageState";
import { SharedTaskCard } from "@/components/SharedTaskCard";
import { formatShortDate } from "@/lib/format";
import { useSharedTasks } from "@/hooks/useSharedTasks";
import { getActiveBuildStage, getFutureScheduledTasks, getNextBuildStage, getTodaysTasks, groupTasksByDate } from "@/lib/selectors";

export default function TodayPage() {
  const shared = useSharedTasks();
  const currentStage = getActiveBuildStage();
  const nextStage = getNextBuildStage(currentStage.stageNumber);
  const todaysTasks = getTodaysTasks(shared.tasks);
  const futureTaskGroups = groupTasksByDate(getFutureScheduledTasks(shared.tasks));
  const todaysGoal = todaysTasks[0]?.deliverable ?? currentStage.goal;

  return (
    <Layout title="Today">
      <PageHeader title="Today" eyebrow="Daily Build Plan" />

      <SharedStorageState
        actor={shared.actor}
        setActor={shared.setActor}
        error={shared.error}
        needsBootstrap={shared.needsBootstrap}
        pendingKeys={shared.pendingKeys}
        retry={shared.refresh}
        bootstrap={shared.bootstrap}
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <section className="surface p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-brand-700">
            <Flag aria-hidden="true" className="h-4 w-4" />
            Today’s Goal
          </div>
          <p className="mt-3 text-lg font-bold leading-7 text-slate-950">{todaysGoal}</p>
        </section>

        <section className="surface p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-neural-600">
            <MapPinned aria-hidden="true" className="h-4 w-4" />
            Current Stage
          </div>
          <p className="mt-3 text-lg font-bold leading-7 text-slate-950">
            Stage {currentStage.stageNumber}: {currentStage.title}
          </p>
        </section>

        <section className="surface p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <CalendarClock aria-hidden="true" className="h-4 w-4" />
            Next Stage
          </div>
          <p className="mt-3 text-lg font-bold leading-7 text-slate-950">{nextStage ? nextStage.title : "Launch Prep"}</p>
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Panel title="Today’s Priorities">
          {todaysTasks.length === 0 ? (
            <div className="rounded-md border border-dashed border-slate-200 p-5 text-sm text-slate-500">No tasks scheduled for today.</div>
          ) : (
            <div className="space-y-4">
              {todaysTasks.map((task) => (
                <SharedTaskCard
                  key={task.id}
                  task={task}
                  actor={shared.actor}
                  pending={shared.pendingKeys.has(task.id)}
                  detailed
                  onCompletion={shared.setCompletion}
                  onEdit={shared.editTask}
                />
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Upcoming Schedule">
          {futureTaskGroups.length === 0 ? (
            <div className="rounded-md border border-dashed border-slate-200 p-5 text-sm text-slate-500">No future work scheduled.</div>
          ) : (
            <div className="space-y-5">
              {futureTaskGroups.map((group) => (
                <section key={group.date}>
                  <h2 className="mb-3 text-sm font-bold text-slate-950">{formatShortDate(group.date)}</h2>
                  <div className="space-y-3">
                    {group.tasks.map((task) => (
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
                </section>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </Layout>
  );
}
