import { todayIso } from "@/lib/initialData";
import { summerBuildStages, summerBuildTasks } from "@/lib/summerSchedule";
import type { CurriculumStage, Task, WixDevelopmentItem } from "@/types";

const summerTaskIds = new Set(summerBuildTasks.map((task) => task.id));

const parseDate = (value: string) => {
  if (!value) {
    return Number.POSITIVE_INFINITY;
  }

  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).getTime();
};

const daysUntil = (value: string) => {
  if (!value) {
    return Number.POSITIVE_INFINITY;
  }

  const today = parseDate(todayIso());
  const target = parseDate(value);
  return Math.ceil((target - today) / 86_400_000);
};

export const getOpenTasks = (tasks: Task[]) => {
  return tasks.filter((task) => task.status !== "Completed");
};

export const sortTasksByDate = (tasks: Task[]) => {
  return [...tasks].sort((a, b) => parseDate(a.dueDate) - parseDate(b.dueDate));
};

export const getTodaysTasks = (tasks: Task[]) => {
  const today = todayIso();
  return sortTasksByDate(tasks.filter((task) => task.dueDate === today));
};

export const getUpcomingTasks = (tasks: Task[]) => {
  return sortTasksByDate(
    getOpenTasks(tasks).filter((task) => {
      const days = daysUntil(task.dueDate);
      return days >= 0 && days <= 14;
    })
  );
};

export const getFutureScheduledTasks = (tasks: Task[]) => {
  return sortTasksByDate(
    tasks.filter((task) => {
      const days = daysUntil(task.dueDate);
      return days >= 1 && days <= 14;
    })
  );
};

export const groupTasksByDate = (tasks: Task[]) => {
  return sortTasksByDate(tasks).reduce<Array<{ date: string; tasks: Task[] }>>((groups, task) => {
    const group = groups.find((item) => item.date === task.dueDate);

    if (group) {
      group.tasks.push(task);
    } else {
      groups.push({ date: task.dueDate, tasks: [task] });
    }

    return groups;
  }, []);
};

export const getActiveBuildStage = (date = todayIso()) => {
  const currentDate = parseDate(date);
  const firstStage = summerBuildStages[0];
  const finalStage = summerBuildStages[summerBuildStages.length - 1];

  if (currentDate < parseDate(firstStage.startDate)) {
    return firstStage;
  }

  if (currentDate > parseDate(finalStage.endDate)) {
    return finalStage;
  }

  return (
    summerBuildStages.find((stage) => currentDate >= parseDate(stage.startDate) && currentDate <= parseDate(stage.endDate)) ??
    firstStage
  );
};

export const getNextBuildStage = (stageNumber: number) => {
  return summerBuildStages.find((stage) => stage.stageNumber === stageNumber + 1);
};

export const getScheduledSummerTasks = (tasks: Task[]) => {
  return tasks.filter((task) => summerTaskIds.has(task.id));
};

export const getSummerTaskProgress = (tasks: Task[]) => {
  const scheduledTasks = getScheduledSummerTasks(tasks);
  const completedTasks = scheduledTasks.filter((task) => task.status === "Completed").length;

  return {
    completedTasks,
    totalTasks: summerBuildTasks.length,
    percentage: Math.round((completedTasks / summerBuildTasks.length) * 100)
  };
};

export const getNextActionTask = (tasks: Task[]) => {
  return sortTasksByDate(getOpenTasks(tasks)).find((task) => task.status === "In Progress") ?? sortTasksByDate(getOpenTasks(tasks))[0];
};

export const getNextCurriculumStage = (stages: CurriculumStage[]) => {
  return stages.find((stage) => stage.status === "Learning") ?? stages.find((stage) => stage.status !== "Complete");
};

export const getSuggestedNextAction = (tasks: Task[], stages: CurriculumStage[]) => {
  const task = getNextActionTask(tasks);

  if (task) {
    return `Work on "${task.title}" and update its state before ending the session.`;
  }

  const stage = getNextCurriculumStage(stages);

  if (stage) {
    return `Advance "${stage.title}" by completing its next step.`;
  }

  return "Review the roadmap and choose one concrete build action.";
};

export const getWixAverageCompletion = (items: WixDevelopmentItem[]) => {
  if (items.length === 0) {
    return 0;
  }

  const total = items.reduce((sum, item) => sum + item.completion, 0);
  return Math.round(total / items.length);
};
