import { useMemo, useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { Badge, statusTone } from "@/components/Badge";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { formatShortDate } from "@/lib/format";
import { todayIso } from "@/lib/initialData";
import { useOperatingSystemState } from "@/lib/operatingSystem";
import { sortTasksByDate } from "@/lib/selectors";
import type { Task, TaskStatus } from "@/types";

const monthLabel = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric"
  }).format(date);

const isoDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const parseLocalDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const buildCalendarDays = (visibleMonth: Date) => {
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const firstGridDay = new Date(year, month, 1 - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(firstGridDay);
    date.setDate(firstGridDay.getDate() + index);
    return {
      iso: isoDate(date),
      dayNumber: date.getDate(),
      inMonth: date.getMonth() === month
    };
  });
};

const nextStatus = (task: Task): TaskStatus => (task.status === "Completed" ? "Next Up" : "Completed");

export default function TasksPage() {
  const { tasks, setTasks } = useOperatingSystemState();
  const [selectedDate, setSelectedDate] = useState(todayIso());
  const [visibleMonth, setVisibleMonth] = useState(() => parseLocalDate(todayIso()));

  const calendarDays = useMemo(() => buildCalendarDays(visibleMonth), [visibleMonth]);
  const tasksByDate = useMemo(() => {
    return tasks.reduce<Record<string, Task[]>>((groups, task) => {
      const date = task.dueDate || todayIso();
      groups[date] = [...(groups[date] ?? []), task];
      return groups;
    }, {});
  }, [tasks]);
  const selectedTasks = sortTasksByDate(tasksByDate[selectedDate] ?? []);

  const moveMonth = (amount: number) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks((current) => current.map((task) => (task.id === taskId ? { ...task, status } : task)));
  };

  return (
    <Layout title="Calendar">
      <PageHeader title="Calendar" eyebrow="Task Management">
        <button className="btn-secondary" onClick={() => moveMonth(-1)}>
          Previous
        </button>
        <button className="btn-secondary" onClick={() => moveMonth(1)}>
          Next
        </button>
      </PageHeader>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title={monthLabel(visibleMonth)}>
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-7 gap-2">
            {calendarDays.map((day) => {
              const dayTasks = tasksByDate[day.iso] ?? [];
              const completedCount = dayTasks.filter((task) => task.status === "Completed").length;
              const selected = day.iso === selectedDate;

              return (
                <button
                  key={day.iso}
                  className={`min-h-24 rounded-md border p-2 text-left transition ${
                    selected
                      ? "border-brand-300 bg-brand-50"
                      : day.inMonth
                        ? "border-slate-200 bg-white hover:border-brand-200"
                        : "border-slate-100 bg-slate-50 text-slate-400"
                  }`}
                  onClick={() => setSelectedDate(day.iso)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold">{day.dayNumber}</span>
                    {day.iso === todayIso() ? <Badge tone="blue">Today</Badge> : null}
                  </div>
                  {dayTasks.length > 0 ? (
                    <div className="mt-3 text-xs font-semibold text-slate-600">
                      {completedCount}/{dayTasks.length} done
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
        </Panel>

        <Panel title={formatShortDate(selectedDate)}>
          {selectedTasks.length === 0 ? (
            <div className="rounded-md border border-dashed border-slate-200 p-5 text-sm text-slate-500">No tasks scheduled.</div>
          ) : (
            <div className="space-y-4">
              {selectedTasks.map((task) => {
                const completed = task.status === "Completed";
                const Icon = completed ? CheckCircle2 : Circle;

                return (
                  <article
                    key={task.id}
                    className={`rounded-lg border p-4 ${
                      completed ? "border-emerald-200 bg-emerald-50 text-slate-500" : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        aria-label={`Toggle completion for ${task.title}`}
                        className="mt-1 text-brand-600"
                        onClick={() => updateTaskStatus(task.id, nextStatus(task))}
                      >
                        <Icon aria-hidden="true" className="h-5 w-5" />
                      </button>
                      <div className="min-w-0 flex-1">
                        <h2 className={`text-base font-bold ${completed ? "text-slate-500 line-through" : "text-slate-950"}`}>
                          {task.title}
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{task.description || task.whatToDo}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge tone={statusTone(task.status)}>{task.status}</Badge>
                          <Badge>{task.estimatedTime || "30 minutes"}</Badge>
                          <Badge tone="blue">{task.stage}</Badge>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </Panel>
      </div>
    </Layout>
  );
}
