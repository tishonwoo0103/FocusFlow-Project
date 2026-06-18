import Link from "next/link";
import { ArrowDown, ArrowRight, Crosshair, GitBranch, Target, Users } from "lucide-react";
import { Badge } from "@/components/Badge";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { ProgressBar } from "@/components/ProgressBar";
import { TaskList } from "@/components/TaskList";
import { formatShortDate } from "@/lib/format";
import { useOperatingSystemState } from "@/lib/operatingSystem";
import { getActiveBuildStage, getSummerTaskProgress, getUpcomingTasks, groupTasksByDate } from "@/lib/selectors";
import { summerBuildStages } from "@/lib/summerSchedule";

function RoadmapTimeline({
  activeStageNumber,
  progressPercentage,
  completedTasks,
  totalTasks
}: {
  activeStageNumber: number;
  progressPercentage: number;
  completedTasks: number;
  totalTasks: number;
}) {
  return (
    <section className="surface p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-brand-600">FocusFlow Project Building Space</div>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">66-Day Summer Roadmap</h2>
        </div>
        <Badge tone="blue">Current Stage {activeStageNumber}</Badge>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between gap-3 text-sm">
          <span className="font-semibold text-slate-600">Progress Percentage</span>
          <span className="font-bold text-slate-950">
            {progressPercentage}% ({completedTasks}/{totalTasks})
          </span>
        </div>
        <ProgressBar value={progressPercentage} />
      </div>

      <div className="relative mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="absolute left-[10%] right-[10%] top-7 hidden h-2 rounded-full bg-gradient-to-r from-brand-600 via-emerald-500 to-neural-600 md:block" />
        {summerBuildStages.map((stage) => {
          const isActive = stage.stageNumber === activeStageNumber;
          const isPast = stage.stageNumber < activeStageNumber;

          return (
            <div
              key={stage.id}
              className={`relative rounded-lg border p-4 ${
                isActive
                  ? "border-brand-300 bg-brand-50"
                  : isPast
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-slate-200 bg-white"
              }`}
            >
              {isActive ? (
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-brand-700 md:absolute md:-top-7 md:left-1/2 md:mb-0 md:-translate-x-1/2">
                  <ArrowDown aria-hidden="true" className="hidden h-5 w-5 md:block" />
                  <ArrowRight aria-hidden="true" className="h-5 w-5 md:hidden" />
                  Active
                </div>
              ) : null}
              <div
                className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white ${
                  isPast ? "bg-emerald-600" : isActive ? "bg-brand-600" : "bg-slate-400"
                }`}
              >
                {stage.stageNumber}
              </div>
              <div className="mt-4 text-xs font-semibold uppercase text-slate-500">Stage {stage.stageNumber}</div>
              <h3 className="mt-1 text-base font-bold leading-6 text-slate-950">{stage.title}</h3>
              <p className="mt-1 text-xs font-bold text-brand-700">
                {formatShortDate(stage.startDate)} - {formatShortDate(stage.endDate)}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{stage.goal}</p>
              {isActive ? <div className="mt-3 text-sm font-semibold text-brand-700">Current stage indicator</div> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function DashboardPage() {
  const { collaborationBoard, projectStatus, setProjectStatus, tasks, setTasks } = useOperatingSystemState();
  const activeStage = getActiveBuildStage();
  const progress = getSummerTaskProgress(tasks);
  const upcomingTaskGroups = groupTasksByDate(getUpcomingTasks(tasks));
  const miaItems = collaborationBoard.items.filter((item) => item.owner === "Mia" || item.owner === "Both");
  const activeMiaItems = miaItems.filter((item) => item.status !== "Completed");

  return (
    <Layout title="Dashboard">
      <PageHeader title="Dashboard" eyebrow="FocusFlow" />

      <RoadmapTimeline
        activeStageNumber={activeStage.stageNumber}
        progressPercentage={progress.percentage}
        completedTasks={progress.completedTasks}
        totalTasks={progress.totalTasks}
      />

      <section className="surface mt-6 p-5">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-brand-700">
              <Users aria-hidden="true" className="h-4 w-4" />
              Collaborator Mode
            </div>
            <h2 className="mt-2 text-xl font-bold text-slate-950">Tishon + Mia build lane</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{collaborationBoard.sharedGoal}</p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="label">Mia Active Items</div>
              <div className="mt-2 text-2xl font-bold text-slate-950">{activeMiaItems.length}</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="label">Next Check-In</div>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">{collaborationBoard.nextCheckIn}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <GitBranch aria-hidden="true" className="h-4 w-4" />
                Branch
              </div>
              <p className="mt-2 break-words text-sm font-semibold leading-6 text-slate-800">{collaborationBoard.githubBranch}</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Link href="/collaborator" className="btn-secondary">
            Open Collaborator Mode
          </Link>
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel title="Current Build State">
          <div className="grid gap-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-brand-700">
                  <Target aria-hidden="true" className="h-4 w-4" />
                  Current Objective
                </div>
                <p className="mt-2 text-base font-semibold leading-7 text-slate-800">{projectStatus.currentObjective}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-neural-600">
                  <Crosshair aria-hidden="true" className="h-4 w-4" />
                  Current Focus
                </div>
                <p className="mt-2 text-base font-semibold leading-7 text-slate-800">{projectStatus.currentFocus}</p>
              </div>
            </div>

            <label className="grid gap-2">
              <span className="label">Current Objective</span>
              <input
                className="input"
                value={projectStatus.currentObjective}
                onChange={(event) => setProjectStatus((current) => ({ ...current, currentObjective: event.target.value }))}
              />
            </label>
            <label className="grid gap-2">
              <span className="label">Current Focus</span>
              <input
                className="input"
                value={projectStatus.currentFocus}
                onChange={(event) => setProjectStatus((current) => ({ ...current, currentFocus: event.target.value }))}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <span className="label">Current Stage</span>
                <div className="text-lg font-bold text-slate-950">
                  Stage {activeStage.stageNumber}: {activeStage.title}
                </div>
                <p className="text-sm leading-6 text-slate-600">{activeStage.goal}</p>
              </div>
              <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <span className="label">Progress Percentage: {progress.percentage}%</span>
                <ProgressBar value={progress.percentage} />
                <p className="text-sm font-semibold text-slate-600">
                  {progress.completedTasks} of {progress.totalTasks} scheduled tasks completed
                </p>
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Upcoming Tasks By Date">
          {upcomingTaskGroups.length === 0 ? (
            <div className="rounded-md border border-dashed border-slate-200 p-5 text-sm text-slate-500">No upcoming tasks.</div>
          ) : (
            <div className="space-y-5">
              {upcomingTaskGroups.map((group) => (
                <section key={group.date}>
                  <h3 className="mb-3 text-sm font-bold text-slate-950">{formatShortDate(group.date)}</h3>
                  <TaskList
                    tasks={group.tasks}
                    emptyLabel="No tasks for this date."
                    onStatusChange={(taskId, status) =>
                      setTasks((current) => current.map((task) => (task.id === taskId ? { ...task, status } : task)))
                    }
                  />
                </section>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </Layout>
  );
}
