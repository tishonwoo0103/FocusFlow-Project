import type { CurriculumStatus, TaskStatus, WorkspaceState } from "@/types";

type BadgeTone = "blue" | "purple" | "green" | "amber" | "slate";

const toneClasses: Record<BadgeTone, string> = {
  blue: "border-brand-200 bg-brand-50 text-brand-700",
  purple: "border-neural-200 bg-neural-50 text-neural-600",
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  slate: "border-slate-200 bg-slate-50 text-slate-600"
};

export const statusTone = (status: TaskStatus): BadgeTone => {
  if (status === "Completed") {
    return "green";
  }

  if (status === "In Progress") {
    return "blue";
  }

  return "slate";
};

export const curriculumTone = (status: CurriculumStatus): BadgeTone => {
  if (status === "Complete") {
    return "green";
  }

  if (status === "Learning") {
    return "blue";
  }

  if (status === "Practicing") {
    return "purple";
  }

  return "slate";
};

export const workspaceTone = (state: WorkspaceState): BadgeTone => {
  if (state === "Ready") {
    return "green";
  }

  if (state === "Building") {
    return "blue";
  }

  if (state === "Review") {
    return "purple";
  }

  if (state === "Drafting") {
    return "amber";
  }

  return "slate";
};

type BadgeProps = {
  children: React.ReactNode;
  tone?: BadgeTone;
};

export function Badge({ children, tone = "slate" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-semibold ${toneClasses[tone]}`}>
      {children}
    </span>
  );
}
