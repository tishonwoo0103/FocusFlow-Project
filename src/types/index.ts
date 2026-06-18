export const taskCategories = [
  "Blueprint",
  "Program",
  "Evidence",
  "Wix Development",
  "Survey Design",
  "Dashboard Design",
  "Resources",
  "Launch Prep",
  "Content Creation",
  "Testing",
  "Vibe Coding",
  "Planning"
] as const;

export const taskStatuses = ["Next Up", "In Progress", "Completed"] as const;
export const curriculumStatuses = ["Not Started", "Learning", "Practicing", "Complete"] as const;
export const resourceTypes = ["YouTube", "Documentation", "Article"] as const;
export const workspaceStates = ["Planned", "Drafting", "Building", "Review", "Ready"] as const;
export const collaboratorNames = ["Tishon", "Mia", "Both"] as const;
export const reviewStates = ["Draft", "Needs Review", "Reviewed"] as const;

export type TaskCategory = (typeof taskCategories)[number];
export type TaskStatus = (typeof taskStatuses)[number];
export type CurriculumStatus = (typeof curriculumStatuses)[number];
export type ResourceType = (typeof resourceTypes)[number];
export type WorkspaceState = (typeof workspaceStates)[number];
export type CollaboratorName = (typeof collaboratorNames)[number];
export type ReviewState = (typeof reviewStates)[number];

export type ProjectStatus = {
  currentObjective: string;
  currentFocus: string;
  currentStage: number;
  progressPercentage: number;
};

export type BuildStage = {
  id: string;
  stageNumber: number;
  title: string;
  goal: string;
  startDate: string;
  endDate: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  status: TaskStatus;
  dueDate: string;
  estimatedTime: string;
  stage: string;
  whatToDo: string;
  checklist: string[];
  deliverable: string;
};

export type LearningResource = {
  id: string;
  type: ResourceType;
  label: string;
  url: string;
};

export type HowToLearn = {
  explanation: string;
  workflow: string;
  steps: string[];
};

export type CurriculumStage = {
  id: string;
  stageNumber: number;
  title: string;
  description: string;
  status: CurriculumStatus;
  howToLearn: HowToLearn;
  resources: LearningResource[];
  notes: string;
  nextStep: string;
};

export type EvidenceItem = {
  id: string;
  source: string;
  summary: string;
  establishes: string;
};

export type ResearchDomain = {
  id: string;
  name: string;
  evidence: EvidenceItem[];
};

export type ChecklistItem = {
  id: string;
  label: string;
  done: boolean;
};

export type VibeCodingItem = {
  id: string;
  feature: string;
  status: WorkspaceState;
  notes: string;
  checklist: ChecklistItem[];
  completion: number;
};

export type WixDevelopmentItem = {
  id: string;
  page: string;
  status: WorkspaceState;
  notes: string;
  checklist: ChecklistItem[];
  completion: number;
};

export type CollaboratorItem = {
  id: string;
  title: string;
  area: string;
  owner: CollaboratorName;
  status: TaskStatus;
  reviewState: ReviewState;
  githubBranch: string;
  handoffNote: string;
  checkInNote: string;
  checklist: ChecklistItem[];
};

export type CollaborationBoard = {
  sharedGoal: string;
  nextCheckIn: string;
  githubBranch: string;
  handoffNote: string;
  reviewFocus: string;
  items: CollaboratorItem[];
};
