import {
  collaboratorNames,
  curriculumStatuses,
  resourceTypes,
  reviewStates,
  taskCategories,
  taskStatuses,
  workspaceStates,
  type CollaborationBoard,
  type CollaboratorItem,
  type CollaboratorName,
  type ChecklistItem,
  type CurriculumStage,
  type CurriculumStatus,
  type EvidenceItem,
  type LearningResource,
  type ResearchDomain,
  type ResourceType,
  type Task,
  type TaskCategory,
  type TaskStatus,
  type VibeCodingItem,
  type WixDevelopmentItem,
  type ReviewState,
  type WorkspaceState
} from "@/types";

type SavedRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is SavedRecord => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const text = (value: unknown, defaultValue = "") => {
  return typeof value === "string" ? value : defaultValue;
};

const numberValue = (value: unknown, defaultValue: number) => {
  return typeof value === "number" && Number.isFinite(value) ? value : defaultValue;
};

const percentValue = (value: unknown, defaultValue: number) => {
  const nextValue = numberValue(value, defaultValue);
  return Math.min(100, Math.max(0, Math.round(nextValue)));
};

const textList = (value: unknown, defaultValue: string[]) => {
  if (!Array.isArray(value)) {
    return defaultValue;
  }

  const list = value.filter((item): item is string => typeof item === "string");
  return list.length > 0 ? list : defaultValue;
};

const isOneOf = <T extends readonly string[]>(value: unknown, options: T): value is T[number] => {
  return typeof value === "string" && options.includes(value as T[number]);
};

const taskStatus = (value: unknown, defaultValue: TaskStatus): TaskStatus => {
  if (isOneOf(value, taskStatuses)) {
    return value;
  }

  if (value === "Done") {
    return "Completed";
  }

  if (value === "Doing" || value === "Building") {
    return "In Progress";
  }

  return defaultValue;
};

const taskCategory = (value: unknown, defaultValue: TaskCategory): TaskCategory => {
  return isOneOf(value, taskCategories) ? value : defaultValue;
};

const curriculumStatus = (value: unknown, defaultValue: CurriculumStatus): CurriculumStatus => {
  if (isOneOf(value, curriculumStatuses)) {
    return value;
  }

  if (value === "Done" || value === "Ready") {
    return "Complete";
  }

  if (value === "Doing" || value === "Building") {
    return "Learning";
  }

  return defaultValue;
};

const resourceType = (value: unknown, defaultValue: ResourceType): ResourceType => {
  return isOneOf(value, resourceTypes) ? value : defaultValue;
};

const workspaceStatus = (value: unknown, defaultValue: WorkspaceState): WorkspaceState => {
  if (isOneOf(value, workspaceStates)) {
    return value;
  }

  if (value === "Done" || value === "Completed") {
    return "Ready";
  }

  if (value === "Doing" || value === "In Progress") {
    return "Building";
  }

  return defaultValue;
};

const collaboratorName = (value: unknown, defaultValue: CollaboratorName): CollaboratorName => {
  return isOneOf(value, collaboratorNames) ? value : defaultValue;
};

const reviewState = (value: unknown, defaultValue: ReviewState): ReviewState => {
  if (isOneOf(value, reviewStates)) {
    return value;
  }

  if (value === "Review" || value === "Ready For Review") {
    return "Needs Review";
  }

  if (value === "Done" || value === "Complete") {
    return "Reviewed";
  }

  return defaultValue;
};

const savedRecords = (value: unknown) => {
  return Array.isArray(value) ? value.filter(isRecord) : [];
};

const matchByFields = (records: SavedRecord[], values: string[]) => {
  return records.find((record) =>
    values.some((value) => text(record.id) === value || text(record.title) === value || text(record.name) === value)
  );
};

const normalizeResource = (value: unknown, defaultValue: LearningResource): LearningResource => {
  const record = isRecord(value) ? value : {};

  return {
    id: text(record.id, defaultValue.id),
    type: resourceType(record.type, defaultValue.type),
    label: text(record.label ?? record.title, defaultValue.label),
    url: text(record.url ?? record.link, defaultValue.url)
  };
};

const normalizeChecklist = (value: unknown, defaultValue: ChecklistItem[]) => {
  const records = savedRecords(value);

  return defaultValue.map((item, index) => {
    const record = records.find((savedItem) => text(savedItem.id) === item.id || text(savedItem.label) === item.label) ?? records[index];

    if (!record) {
      return item;
    }

    return {
      id: text(record.id, item.id),
      label: text(record.label ?? record.title, item.label),
      done: typeof record.done === "boolean" ? record.done : item.done
    };
  });
};

export const normalizeTasks = (value: unknown, defaultValue: Task[]): Task[] => {
  const records = savedRecords(value);

  if (records.length === 0) {
    return defaultValue;
  }

  const usedRecordIndexes = new Set<number>();
  const normalizeDefaultTask = (record: SavedRecord | undefined, defaultTask: Task): Task => ({
    id: defaultTask.id,
    title: defaultTask.title,
    description: text(record?.description ?? record?.whatToDo, defaultTask.description),
    category: defaultTask.category,
    status: taskStatus(record?.status, defaultTask.status),
    dueDate: defaultTask.dueDate,
    estimatedTime: text(record?.estimatedTime ?? record?.duration, defaultTask.estimatedTime),
    stage: defaultTask.stage,
    whatToDo: text(record?.whatToDo ?? record?.description, defaultTask.whatToDo),
    checklist: textList(record?.checklist ?? record?.subtasks, defaultTask.checklist),
    deliverable: text(record?.deliverable, defaultTask.deliverable)
  });

  const normalizeExtraTask = (record: SavedRecord | undefined, defaultTask: Task): Task => ({
    id: text(record?.id, defaultTask.id),
    title: text(record?.title, defaultTask.title),
    description: text(record?.description ?? record?.whatToDo, defaultTask.description),
    category: taskCategory(record?.category, defaultTask.category),
    status: taskStatus(record?.status, defaultTask.status),
    dueDate: text(record?.dueDate ?? record?.date, defaultTask.dueDate),
    estimatedTime: text(record?.estimatedTime ?? record?.duration, defaultTask.estimatedTime),
    stage: text(record?.stage, defaultTask.stage),
    whatToDo: text(record?.whatToDo ?? record?.description, defaultTask.whatToDo),
    checklist: textList(record?.checklist ?? record?.subtasks, defaultTask.checklist),
    deliverable: text(record?.deliverable, defaultTask.deliverable)
  });

  const normalizedDefaults = defaultValue.map((defaultTask) => {
    const recordIndex = records.findIndex(
      (record) =>
        text(record.id) === defaultTask.id ||
        (text(record.dueDate ?? record.date) === defaultTask.dueDate && text(record.title) === defaultTask.title) ||
        (text(record.title) === defaultTask.title &&
          (text(record.stage) === defaultTask.stage ||
            text(record.deliverable) === defaultTask.deliverable ||
            text(record.whatToDo ?? record.description) === defaultTask.whatToDo))
    );

    if (recordIndex >= 0) {
      usedRecordIndexes.add(recordIndex);
      return normalizeDefaultTask(records[recordIndex], defaultTask);
    }

    return defaultTask;
  });

  const extraTasks = records
    .filter((_, index) => !usedRecordIndexes.has(index))
    .map((record, index) =>
      normalizeExtraTask(record, {
        ...defaultValue[0],
        id: text(record.id, `task-${index + 1}`),
        title: text(record.title, "Untitled task"),
        description: text(record.description ?? record.whatToDo, ""),
        dueDate: text(record.dueDate ?? record.date, defaultValue[0].dueDate),
        stage: text(record.stage, defaultValue[0].stage),
        whatToDo: text(record.whatToDo ?? record.description, ""),
        checklist: textList(record.checklist ?? record.subtasks, ["Start task", "Complete task", "Review result"]),
        deliverable: text(record.deliverable, "Completed task notes")
      })
    );

  return [...normalizedDefaults, ...extraTasks];
};

export const normalizeCurriculumStages = (value: unknown, defaultValue: CurriculumStage[]): CurriculumStage[] => {
  const records = savedRecords(value);

  if (records.length === 0) {
    return defaultValue;
  }

  return defaultValue.map((stage) => {
    const record =
      matchByFields(records, [stage.id, stage.title]) ??
      records.find((savedStage) => numberValue(savedStage.stageNumber, -1) === stage.stageNumber || text(savedStage.stage) === stage.title);

    if (!record) {
      return stage;
    }

    const howToLearn = isRecord(record.howToLearn) ? record.howToLearn : {};
    const resourceRecords = savedRecords(record.resources);
    const resources =
      resourceRecords.length > 0
        ? stage.resources.map((resource, index) => normalizeResource(resourceRecords[index], resource))
        : stage.resources;

    return {
      id: stage.id,
      stageNumber: stage.stageNumber,
      title: text(record.title ?? record.stage, stage.title),
      description: text(record.description ?? record.outcome, stage.description),
      status: curriculumStatus(record.status ?? record.state, stage.status),
      howToLearn: {
        explanation: text(howToLearn.explanation, stage.howToLearn.explanation),
        workflow: text(howToLearn.workflow, stage.howToLearn.workflow),
        steps: textList(howToLearn.steps, stage.howToLearn.steps)
      },
      resources,
      notes: text(record.notes, stage.notes),
      nextStep: text(record.nextStep ?? record.nextAction, stage.nextStep)
    };
  });
};

const normalizeEvidence = (value: unknown, defaultValue: EvidenceItem): EvidenceItem => {
  const record = isRecord(value) ? value : {};

  return {
    id: text(record.id, defaultValue.id),
    source: text(record.source, defaultValue.source),
    summary: text(record.summary, defaultValue.summary),
    establishes: text(record.establishes ?? record.whatItEstablishes, defaultValue.establishes)
  };
};

export const normalizeResearchDomains = (value: unknown, defaultValue: ResearchDomain[]): ResearchDomain[] => {
  const records = savedRecords(value);

  if (records.length === 0) {
    return defaultValue;
  }

  return defaultValue.map((domain) => {
    const record = matchByFields(records, [domain.id, domain.name]);

    if (!record) {
      return domain;
    }

    const evidenceRecords = savedRecords(record.evidence);

    return {
      id: domain.id,
      name: text(record.name, domain.name),
      evidence:
        evidenceRecords.length > 0
          ? domain.evidence.map((item, index) => normalizeEvidence(evidenceRecords[index], item))
          : domain.evidence
    };
  });
};

export const normalizeVibeCodingItems = (value: unknown, defaultValue: VibeCodingItem[]): VibeCodingItem[] => {
  const records = savedRecords(value);

  if (records.length === 0) {
    return defaultValue;
  }

  return defaultValue.map((item) => {
    const record = matchByFields(records, [item.id, item.feature]);

    if (!record) {
      return item;
    }

    return {
      id: item.id,
      feature: text(record.feature ?? record.title, item.feature),
      status: workspaceStatus(record.status ?? record.state, item.status),
      notes: text(record.notes, item.notes),
      checklist: normalizeChecklist(record.checklist, item.checklist),
      completion: percentValue(record.completion ?? record.progress, item.completion)
    };
  });
};

export const normalizeWixDevelopmentItems = (value: unknown, defaultValue: WixDevelopmentItem[]): WixDevelopmentItem[] => {
  const records = savedRecords(value);

  if (records.length === 0) {
    return defaultValue;
  }

  return defaultValue.map((page) => {
    const record = matchByFields(records, [page.id, page.page]);

    if (!record) {
      return page;
    }

    return {
      id: page.id,
      page: text(record.page ?? record.title, page.page),
      status: workspaceStatus(record.status ?? record.state, page.status),
      notes: text(record.notes, page.notes),
      checklist: normalizeChecklist(record.checklist, page.checklist),
      completion: percentValue(record.completion ?? record.progress, page.completion)
    };
  });
};

const normalizeCollaboratorItem = (value: unknown, defaultValue: CollaboratorItem): CollaboratorItem => {
  const record = isRecord(value) ? value : {};

  return {
    id: defaultValue.id,
    title: text(record.title, defaultValue.title),
    area: text(record.area, defaultValue.area),
    owner: collaboratorName(record.owner, defaultValue.owner),
    status: taskStatus(record.status, defaultValue.status),
    reviewState: reviewState(record.reviewState ?? record.reviewStatus, defaultValue.reviewState),
    githubBranch: text(record.githubBranch ?? record.branch, defaultValue.githubBranch),
    handoffNote: text(record.handoffNote ?? record.handoff, defaultValue.handoffNote),
    checkInNote: text(record.checkInNote ?? record.checkIn, defaultValue.checkInNote),
    checklist: normalizeChecklist(record.checklist, defaultValue.checklist)
  };
};

export const normalizeCollaborationBoard = (value: unknown, defaultValue: CollaborationBoard): CollaborationBoard => {
  const record = isRecord(value) ? value : {};
  const itemRecords = savedRecords(record.items);

  return {
    sharedGoal: text(record.sharedGoal, defaultValue.sharedGoal),
    nextCheckIn: text(record.nextCheckIn, defaultValue.nextCheckIn),
    githubBranch: text(record.githubBranch ?? record.branch, defaultValue.githubBranch),
    handoffNote: text(record.handoffNote ?? record.handoff, defaultValue.handoffNote),
    reviewFocus: text(record.reviewFocus, defaultValue.reviewFocus),
    items: defaultValue.items.map((item, index) => {
      const savedItem = matchByFields(itemRecords, [item.id, item.title]) ?? itemRecords[index];
      return normalizeCollaboratorItem(savedItem, item);
    })
  };
};
