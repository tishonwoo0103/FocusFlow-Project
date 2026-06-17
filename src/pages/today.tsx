import { CalendarClock, Flag, MapPinned } from "lucide-react";
import { Badge, statusTone } from "@/components/Badge";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { formatShortDate } from "@/lib/format";
import { useOperatingSystemState } from "@/lib/operatingSystem";
import { getActiveBuildStage, getFutureScheduledTasks, getNextBuildStage, getTodaysTasks, groupTasksByDate } from "@/lib/selectors";
import type { Task, TaskStatus } from "@/types";

export default function TodayPage() {
  const { tasks, setTasks } = useOperatingSystemState();
  const currentStage = getActiveBuildStage();
  const nextStage = getNextBuildStage(currentStage.stageNumber);
  const todaysTasks = getTodaysTasks(tasks);
  const futureTaskGroups = groupTasksByDate(getFutureScheduledTasks(tasks));
  const todaysGoal = todaysTasks[0]?.deliverable ?? currentStage.goal;

  const setTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks((current) => current.map((task) => (task.id === taskId ? { ...task, status } : task)));
  };

  const toggleTask = (task: Task) => {
    setTaskStatus(task.id, task.status === "Completed" ? "Next Up" : "Completed");
  };

  return (
    <Layout title="Today">
      <PageHeader title="Today" eyebrow="Daily Build Plan" />

      <div className="grid gap-4 lg:grid-cols-3">
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
              {todaysTasks.map((task) => {
                const completed = task.status === "Completed";

                return (
                  <article
                    key={task.id}
                    className={`rounded-lg border p-4 ${
                      completed ? "border-emerald-200 bg-emerald-50/70" : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        className="mt-1 h-5 w-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                        aria-label={`Complete ${task.title}`}
                        checked={completed}
                        onChange={() => toggleTask(task)}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className={`text-lg font-bold ${completed ? "text-slate-500 line-through" : "text-slate-950"}`}>{task.title}</h2>
                          <Badge tone={statusTone(task.status)}>{task.status}</Badge>
                          <Badge>{task.estimatedTime || "30 minutes"}</Badge>
                          <Badge tone="blue">{task.stage}</Badge>
                        </div>
                        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                          <h3 className="text-sm font-bold text-slate-950">What To Do</h3>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{task.whatToDo}</p>
                        </div>
                        <ul className="mt-4 space-y-2">
                          {task.checklist.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm leading-6 text-slate-700">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                          <h3 className="text-sm font-bold text-emerald-900">Deliverable</h3>
                          <p className="mt-2 text-sm leading-6 text-emerald-900">{task.deliverable}</p>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
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
                      <article key={task.id} className="rounded-lg border border-slate-200 bg-white p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-bold text-slate-950">{task.title}</h3>
                            <p className="mt-1 text-sm leading-6 text-slate-600">{task.whatToDo}</p>
                          </div>
                          <Badge tone={statusTone(task.status)}>{task.status}</Badge>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge>{task.estimatedTime || "30 minutes"}</Badge>
                          <Badge tone="blue">{task.stage}</Badge>
                          <Badge>{task.deliverable}</Badge>
                        </div>
                      </article>
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
