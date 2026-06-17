import {
  defaultProjectStatus,
  getDefaultCurriculumStages,
  getDefaultResearchDomains,
  getDefaultTasks,
  getDefaultVibeCodingItems,
  getDefaultWixDevelopmentItems
} from "@/lib/initialData";
import {
  normalizeCurriculumStages,
  normalizeResearchDomains,
  normalizeTasks,
  normalizeVibeCodingItems,
  normalizeWixDevelopmentItems
} from "@/lib/normalizers";
import { useLocalStorage } from "@/lib/storage";
import type {
  CurriculumStage,
  ProjectStatus,
  ResearchDomain,
  Task,
  VibeCodingItem,
  WixDevelopmentItem
} from "@/types";

const currentStorageVersion = "v7";
const previousStorageVersions = ["v6", "v5"] as const;

const storageKey = (name: string, version = currentStorageVersion) => `focusflow:${version}:${name}`;
const fallbackStorageKeys = (name: string) => previousStorageVersions.map((version) => storageKey(name, version));

const projectStatusFallbackKeys = fallbackStorageKeys("project-status");
const taskFallbackKeys = fallbackStorageKeys("tasks");
const curriculumStageFallbackKeys = fallbackStorageKeys("curriculum-stages");
const researchDomainFallbackKeys = fallbackStorageKeys("research-domains");
const vibeCodingFallbackKeys = fallbackStorageKeys("vibe-coding-items");
const wixDevelopmentFallbackKeys = fallbackStorageKeys("wix-development-items");

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
    setWixDevelopmentItems
  };
}
