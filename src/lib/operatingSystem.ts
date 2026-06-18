import {
  defaultProjectStatus,
  getDefaultCollaborationBoard,
  getDefaultCurriculumStages,
  getDefaultResearchDomains,
  getDefaultTasks,
  getDefaultVibeCodingItems,
  getDefaultWixDevelopmentItems
} from "@/lib/initialData";
import {
  normalizeCollaborationBoard,
  normalizeCurriculumStages,
  normalizeResearchDomains,
  normalizeTasks,
  normalizeVibeCodingItems,
  normalizeWixDevelopmentItems
} from "@/lib/normalizers";
import { useLocalStorage } from "@/lib/storage";
import type {
  CollaborationBoard,
  CurriculumStage,
  ProjectStatus,
  ResearchDomain,
  Task,
  VibeCodingItem,
  WixDevelopmentItem
} from "@/types";

const currentStorageVersion = "v8";
const previousStorageVersions = ["v7", "v6", "v5"] as const;

const storageKey = (name: string, version = currentStorageVersion) => `focusflow:${version}:${name}`;
const fallbackStorageKeys = (name: string) => previousStorageVersions.map((version) => storageKey(name, version));

const projectStatusFallbackKeys = fallbackStorageKeys("project-status");
const taskFallbackKeys = fallbackStorageKeys("tasks");
const curriculumStageFallbackKeys = fallbackStorageKeys("curriculum-stages");
const researchDomainFallbackKeys = fallbackStorageKeys("research-domains");
const vibeCodingFallbackKeys = fallbackStorageKeys("vibe-coding-items");
const wixDevelopmentFallbackKeys = fallbackStorageKeys("wix-development-items");
const collaborationBoardFallbackKeys = fallbackStorageKeys("collaboration-board");

export function useOperatingSystemState() {
  const [projectStatus, setProjectStatus] = useLocalStorage<ProjectStatus>(
    storageKey("project-status"),
    defaultProjectStatus,
    undefined,
    projectStatusFallbackKeys
  );
  const [tasks, setTasks] = useLocalStorage<Task[]>(storageKey("tasks"), getDefaultTasks, normalizeTasks, taskFallbackKeys);
  const [curriculumStages, setCurriculumStages] = useLocalStorage<CurriculumStage[]>(
    storageKey("curriculum-stages"),
    getDefaultCurriculumStages,
    normalizeCurriculumStages,
    curriculumStageFallbackKeys
  );
  const [researchDomains, setResearchDomains] = useLocalStorage<ResearchDomain[]>(
    storageKey("research-domains"),
    getDefaultResearchDomains,
    normalizeResearchDomains,
    researchDomainFallbackKeys
  );
  const [vibeCodingItems, setVibeCodingItems] = useLocalStorage<VibeCodingItem[]>(
    storageKey("vibe-coding-items"),
    getDefaultVibeCodingItems,
    normalizeVibeCodingItems,
    vibeCodingFallbackKeys
  );
  const [wixDevelopmentItems, setWixDevelopmentItems] = useLocalStorage<WixDevelopmentItem[]>(
    storageKey("wix-development-items"),
    getDefaultWixDevelopmentItems,
    normalizeWixDevelopmentItems,
    wixDevelopmentFallbackKeys
  );
  const [collaborationBoard, setCollaborationBoard] = useLocalStorage<CollaborationBoard>(
    storageKey("collaboration-board"),
    getDefaultCollaborationBoard,
    normalizeCollaborationBoard,
    collaborationBoardFallbackKeys
  );

  return {
    projectStatus,
    setProjectStatus,
    tasks,
    setTasks,
    curriculumStages,
    setCurriculumStages,
    researchDomains,
    setResearchDomains,
    vibeCodingItems,
    setVibeCodingItems,
    wixDevelopmentItems,
    setWixDevelopmentItems,
    collaborationBoard,
    setCollaborationBoard
  };
}
