import { useMemo, useState, type FormEvent } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Badge } from "@/components/Badge";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { SharedStorageState } from "@/components/SharedStorageState";
import { SharedTaskCard } from "@/components/SharedTaskCard";
import { useSharedTasks } from "@/hooks/useSharedTasks";
import { formatShortDate } from "@/lib/format";
import { todayIso } from "@/lib/initialData";
import { sortTasksByDate } from "@/lib/selectors";
import type { SharedTask } from "@/types";

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

export default function TasksPage() {
  const shared = useSharedTasks();
  const [selectedDate, setSelectedDate] = useState(todayIso());
  const [visibleMonth, setVisibleMonth] = useState(() => parseLocalDate(todayIso()));
  const [showCreate, setShowCreate] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: todayIso(),
    estimatedTime: "30 minutes"
  });

  const calendarDays = useMemo(() => buildCalendarDays(visibleMonth), [visibleMonth]);
  const tasksByDate = useMemo(() => {
    return shared.tasks.reduce<Record<string, SharedTask[]>>((groups, task) => {
      const date = task.dueDate || todayIso();
      groups[date] = [...(groups[date] ?? []), task];
      return groups;
    }, {});
  }, [shared.tasks]);
  const selectedTasks = sortTasksByDate(tasksByDate[selectedDate] ?? []);

  const moveMonth = (amount: number) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  };

  const toggleCreateForm = () => {
    setNewTask((current) => ({ ...current, dueDate: selectedDate < todayIso() ? todayIso() : selectedDate }));
    setShowCreate((value) => !value);
  };

  const createTask = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await shared.createTask(newTask);
      setSelectedDate(newTask.dueDate);
      setVisibleMonth(parseLocalDate(newTask.dueDate));
      setNewTask({ title: "", description: "", dueDate: newTask.dueDate, estimatedTime: "30 minutes" });
      setShowCreate(false);
    } catch {
      // The shared storage banner reports the failed creation and keeps the form open.
    }
  };

  return (
    <Layout title="Calendar">
      <PageHeader title="Calendar" eyebrow="Task Management">
        <button aria-label="Previous month" className="icon-button hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 focus:ring-brand-100" title="Previous month" onClick={() => moveMonth(-1)}>
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
        </button>
        <button aria-label="Next month" className="icon-button hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 focus:ring-brand-100" title="Next month" onClick={() => moveMonth(1)}>
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </button>
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

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
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

        <Panel
          title={formatShortDate(selectedDate)}
          actions={
            <button className="btn" disabled={shared.needsBootstrap} onClick={toggleCreateForm}>
              <Plus aria-hidden="true" className="h-4 w-4" />
              New Task
            </button>
          }
        >
          {showCreate ? (
            <form className="mb-5 grid gap-3 rounded-lg border border-brand-200 bg-brand-50 p-4" onSubmit={(event) => void createTask(event)}>
              <label className="grid gap-2">
                <span className="label">Task Title</span>
                <input className="input" required maxLength={120} value={newTask.title} onChange={(event) => setNewTask((current) => ({ ...current, title: event.target.value }))} />
              </label>
              <label className="grid gap-2">
                <span className="label">Description</span>
                <textarea className="textarea" maxLength={1000} value={newTask.description} onChange={(event) => setNewTask((current) => ({ ...current, description: event.target.value }))} />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="label">Date</span>
                  <input className="input" type="date" required min={todayIso()} value={newTask.dueDate} onChange={(event) => setNewTask((current) => ({ ...current, dueDate: event.target.value }))} />
                </label>
                <label className="grid gap-2">
                  <span className="label">Estimated Time</span>
                  <input className="input" required maxLength={60} value={newTask.estimatedTime} onChange={(event) => setNewTask((current) => ({ ...current, estimatedTime: event.target.value }))} />
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" className="btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
                <button type="submit" className="btn" disabled={shared.pendingKeys.has("create")}>
                  {shared.pendingKeys.has("create") ? "Creating..." : "Create Shared Task"}
                </button>
              </div>
            </form>
          ) : null}

          {selectedTasks.length === 0 ? (
            <div className="rounded-md border border-dashed border-slate-200 p-5 text-sm text-slate-500">No tasks scheduled.</div>
          ) : (
            <div className="space-y-4">
              {selectedTasks.map((task) => (
                <SharedTaskCard
                  key={task.id}
                  task={task}
                  actor={shared.actor}
                  pending={shared.pendingKeys.has(task.id)}
                  onCompletion={shared.setCompletion}
                  onEdit={shared.editTask}
                  onDelete={shared.deleteTask}
                />
              ))}
            </div>
          )}
        </Panel>
      </div>
    </Layout>
  );
}
