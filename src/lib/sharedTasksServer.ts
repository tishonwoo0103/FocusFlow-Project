import { randomUUID } from "node:crypto";
import { getRedis } from "@/lib/redis";
import { summerBuildTasks } from "@/lib/summerSchedule";
import {
  collaboratorIds,
  taskCategories,
  type ActivityItem,
  type CollaboratorId,
  type SharedTask,
  type Task,
  type TaskCategory,
  type TaskStatus
} from "@/types";

export const SHARED_TASKS_KEY = "focusflow:shared:v1:tasks";
export const SHARED_ACTIVITY_KEY = "focusflow:shared:v1:activity";
export const SHARED_INITIALIZED_KEY = "focusflow:shared:v1:initialized";

type JsonRecord = Record<string, unknown>;

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const isRecord = (value: unknown): value is JsonRecord => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const requiredString = (value: unknown, field: string, maxLength: number) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ApiError(400, "INVALID_FIELD", `${field} is required.`);
  }

  const nextValue = value.trim();
  if (nextValue.length > maxLength) {
    throw new ApiError(400, "INVALID_FIELD", `${field} must be ${maxLength} characters or fewer.`);
  }

  return nextValue;
};

const optionalString = (value: unknown, field: string, maxLength: number, fallback = "") => {
  if (value === undefined || value === null) {
    return fallback;
  }

  if (typeof value !== "string") {
    throw new ApiError(400, "INVALID_FIELD", `${field} must be text.`);
  }

  const nextValue = value.trim();
  if (nextValue.length > maxLength) {
    throw new ApiError(400, "INVALID_FIELD", `${field} must be ${maxLength} characters or fewer.`);
  }

  return nextValue;
};

const isValidIsoDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const dateString = (value: unknown, field: string) => {
  const nextValue = requiredString(value, field, 10);
  if (!isValidIsoDate(nextValue)) {
    throw new ApiError(400, "INVALID_DATE", `${field} must use YYYY-MM-DD.`);
  }

  return nextValue;
};

const stringList = (value: unknown, field: string, fallback: string[] = []) => {
  if (value === undefined) {
    return fallback;
  }

  if (!Array.isArray(value) || value.length > 20) {
    throw new ApiError(400, "INVALID_FIELD", `${field} must contain no more than 20 items.`);
  }

  return value.map((item, index) => requiredString(item, `${field}[${index}]`, 200));
};

export const validateActor = (value: unknown): CollaboratorId => {
  if (typeof value !== "string" || !collaboratorIds.includes(value as CollaboratorId)) {
    throw new ApiError(400, "INVALID_ACTOR", "actor must be tishon or mia.");
  }

  return value as CollaboratorId;
};

export const validateTaskId = (value: unknown) => {
  const id = requiredString(value, "task ID", 100);
  if (!/^[a-zA-Z0-9:_-]+$/.test(id)) {
    throw new ApiError(400, "INVALID_TASK_ID", "task ID contains unsupported characters.");
  }

  return id;
};

const taskCategory = (value: unknown, fallback: TaskCategory = "Planning") => {
  if (value === undefined) {
    return fallback;
  }

  if (typeof value !== "string" || !taskCategories.includes(value as TaskCategory)) {
    throw new ApiError(400, "INVALID_FIELD", "category is not supported.");
  }

  return value as TaskCategory;
};

export const deriveTaskStatus = (completedBy: SharedTask["completedBy"]): TaskStatus => {
  if (completedBy.tishon && completedBy.mia) {
    return "Completed";
  }

  if (completedBy.tishon || completedBy.mia) {
    return "In Progress";
  }

  return "Next Up";
};

const parseStoredTask = (value: unknown): SharedTask => {
  const parsed = typeof value === "string" ? JSON.parse(value) : value;
  if (!isRecord(parsed)) {
    throw new Error("Invalid shared task record");
  }

  return parsed as SharedTask;
};

const parseStoredActivity = (value: unknown): ActivityItem => {
  const parsed = typeof value === "string" ? JSON.parse(value) : value;
  if (!isRecord(parsed)) {
    throw new Error("Invalid shared activity record");
  }

  return parsed as ActivityItem;
};

const sortTasks = (tasks: SharedTask[]) => {
  return tasks.sort((a, b) => a.dueDate.localeCompare(b.dueDate) || a.title.localeCompare(b.title));
};

export const readSharedTasks = async () => {
  const redis = getRedis();
  const initialized = await redis.get<string>(SHARED_INITIALIZED_KEY);

  if (!initialized) {
    throw new ApiError(409, "SHARED_STORAGE_NOT_INITIALIZED", "Import Local Tasks before using shared tasks.");
  }

  const records = await redis.hgetall<Record<string, SharedTask | string>>(SHARED_TASKS_KEY);
  return sortTasks(Object.values(records ?? {}).map(parseStoredTask));
};

export const readSharedActivity = async () => {
  const redis = getRedis();
  const initialized = await redis.get<string>(SHARED_INITIALIZED_KEY);

  if (!initialized) {
    throw new ApiError(409, "SHARED_STORAGE_NOT_INITIALIZED", "Import Local Tasks before using shared activity.");
  }

  const records = await redis.lrange<ActivityItem | string>(SHARED_ACTIVITY_KEY, 0, -1);
  return records.map(parseStoredActivity).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
};

type CreateTaskInput = {
  title: string;
  description: string;
  dueDate: string;
  estimatedTime: string;
  category: TaskCategory;
  stage: string;
  whatToDo: string;
  checklist: string[];
  deliverable: string;
};

export const validateCreateTask = (value: unknown): { actor: CollaboratorId; task: CreateTaskInput } => {
  if (!isRecord(value)) {
    throw new ApiError(400, "INVALID_BODY", "A JSON request body is required.");
  }

  const actor = validateActor(value.actor);
  const title = requiredString(value.title, "title", 120);
  const description = optionalString(value.description, "description", 1000);
  const dueDate = dateString(value.dueDate, "dueDate");
  const today = new Date().toISOString().slice(0, 10);

  if (dueDate < today) {
    throw new ApiError(400, "PAST_DATE", "New tasks must be scheduled for today or later.");
  }

  const estimatedTime = requiredString(value.estimatedTime, "estimatedTime", 60);
  const whatToDo = optionalString(value.whatToDo, "whatToDo", 1000, description);

  return {
    actor,
    task: {
      title,
      description,
      dueDate,
      estimatedTime,
      category: taskCategory(value.category),
      stage: optionalString(value.stage, "stage", 100, "Planning") || "Planning",
      whatToDo: whatToDo || description,
      checklist: stringList(value.checklist, "checklist"),
      deliverable: optionalString(value.deliverable, "deliverable", 300, "Task completed") || "Task completed"
    }
  };
};

type TaskPatch = Partial<Pick<SharedTask, "title" | "description" | "dueDate" | "estimatedTime" | "stage" | "whatToDo" | "checklist" | "deliverable">> & {
  completed?: boolean;
};

export const validateTaskPatch = (value: unknown): { actor: CollaboratorId; patch: TaskPatch } => {
  if (!isRecord(value)) {
    throw new ApiError(400, "INVALID_BODY", "A JSON request body is required.");
  }

  const actor = validateActor(value.actor);
  const patch: TaskPatch = {};

  if (value.title !== undefined) patch.title = requiredString(value.title, "title", 120);
  if (value.description !== undefined) patch.description = optionalString(value.description, "description", 1000);
  if (value.dueDate !== undefined) patch.dueDate = dateString(value.dueDate, "dueDate");
  if (value.estimatedTime !== undefined) patch.estimatedTime = requiredString(value.estimatedTime, "estimatedTime", 60);
  if (value.stage !== undefined) patch.stage = requiredString(value.stage, "stage", 100);
  if (value.whatToDo !== undefined) patch.whatToDo = optionalString(value.whatToDo, "whatToDo", 1000);
  if (value.checklist !== undefined) patch.checklist = stringList(value.checklist, "checklist");
  if (value.deliverable !== undefined) patch.deliverable = optionalString(value.deliverable, "deliverable", 300);

  if (value.completed !== undefined) {
    if (typeof value.completed !== "boolean") {
      throw new ApiError(400, "INVALID_FIELD", "completed must be true or false.");
    }
    patch.completed = value.completed;
  }

  if (Object.keys(patch).length === 0) {
    throw new ApiError(400, "EMPTY_PATCH", "Provide at least one task field to update.");
  }

  return { actor, patch };
};

const appendActivityLua = `
redis.call("RPUSH", KEYS[2], ARGV[2])
redis.call("LTRIM", KEYS[2], -100, -1)
`;

export const createSharedTask = async (actor: CollaboratorId, input: CreateTaskInput) => {
  const redis = getRedis();
  const timestamp = new Date().toISOString();
  const id = `task-${randomUUID()}`;
  const task: SharedTask = {
    id,
    ...input,
    status: "Next Up",
    completedBy: { tishon: false, mia: false },
    createdBy: actor,
    createdAt: timestamp,
    lastUpdatedBy: actor,
    lastUpdatedAt: timestamp
  };
  const activity: ActivityItem = {
    id: `activity-${randomUUID()}`,
    actor,
    action: "created",
    targetType: "task",
    targetId: id,
    targetTitle: task.title,
    timestamp
  };
  const script = `
if redis.call("HEXISTS", KEYS[1], ARGV[1]) == 1 then return "" end
redis.call("HSET", KEYS[1], ARGV[1], ARGV[3])
${appendActivityLua}
return ARGV[3]
`;
  const result = await redis.eval<string[], SharedTask | string>(script, [SHARED_TASKS_KEY, SHARED_ACTIVITY_KEY], [id, JSON.stringify(activity), JSON.stringify(task)]);

  if (!result) {
    throw new ApiError(409, "TASK_EXISTS", "A task with this ID already exists.");
  }

  return parseStoredTask(result);
};

export const updateSharedTask = async (id: string, actor: CollaboratorId, patch: TaskPatch) => {
  const redis = getRedis();
  const timestamp = new Date().toISOString();
  const activityId = `activity-${randomUUID()}`;
  const script = `
local raw = redis.call("HGET", KEYS[1], ARGV[1])
if not raw then return "" end
local task = cjson.decode(raw)
local patch = cjson.decode(ARGV[3])
local action = "edited"
if patch.completed ~= nil then
  local wasCompleted = task.completedBy[ARGV[2]] == true
  task.completedBy[ARGV[2]] = patch.completed
  if patch.completed and not wasCompleted then action = "completed" end
  if not patch.completed and wasCompleted then action = "reopened" end
  patch.completed = nil
end
for key, value in pairs(patch) do task[key] = value end
if task.completedBy.tishon and task.completedBy.mia then
  task.status = "Completed"
elseif task.completedBy.tishon or task.completedBy.mia then
  task.status = "In Progress"
else
  task.status = "Next Up"
end
task.lastUpdatedBy = ARGV[2]
task.lastUpdatedAt = ARGV[4]
local updated = cjson.encode(task)
redis.call("HSET", KEYS[1], ARGV[1], updated)
local activity = cjson.encode({
  id = ARGV[5], actor = ARGV[2], action = action, targetType = "task",
  targetId = ARGV[1], targetTitle = task.title, timestamp = ARGV[4]
})
redis.call("RPUSH", KEYS[2], activity)
redis.call("LTRIM", KEYS[2], -100, -1)
return updated
`;
  const result = await redis.eval<string[], SharedTask | string>(script, [SHARED_TASKS_KEY, SHARED_ACTIVITY_KEY], [id, actor, JSON.stringify(patch), timestamp, activityId]);

  if (!result) {
    throw new ApiError(404, "TASK_NOT_FOUND", "Task not found.");
  }

  return parseStoredTask(result);
};

export const deleteSharedTask = async (id: string, actor: CollaboratorId) => {
  const redis = getRedis();
  const timestamp = new Date().toISOString();
  const activityId = `activity-${randomUUID()}`;
  const script = `
local raw = redis.call("HGET", KEYS[1], ARGV[1])
if not raw then return "" end
local task = cjson.decode(raw)
redis.call("HDEL", KEYS[1], ARGV[1])
local activity = cjson.encode({
  id = ARGV[3], actor = ARGV[2], action = "deleted", targetType = "task",
  targetId = ARGV[1], targetTitle = task.title, timestamp = ARGV[4]
})
redis.call("RPUSH", KEYS[2], activity)
redis.call("LTRIM", KEYS[2], -100, -1)
return raw
`;
  const result = await redis.eval<string[], SharedTask | string>(script, [SHARED_TASKS_KEY, SHARED_ACTIVITY_KEY], [id, actor, activityId, timestamp]);

  if (!result) {
    throw new ApiError(404, "TASK_NOT_FOUND", "Task not found.");
  }

  return parseStoredTask(result);
};

const migrationTask = (task: Task, actor: CollaboratorId, timestamp: string): SharedTask => {
  const completed = task.status === "Completed";
  const completedBy = { tishon: completed, mia: completed };

  return {
    ...task,
    status: deriveTaskStatus(completedBy),
    completedBy,
    createdBy: actor,
    createdAt: timestamp,
    lastUpdatedBy: actor,
    lastUpdatedAt: timestamp
  };
};

const migrateLocalTask = (value: unknown, index: number, actor: CollaboratorId, timestamp: string): SharedTask | undefined => {
  if (!isRecord(value)) {
    return undefined;
  }

  const matchingDefault = summerBuildTasks.find(
    (task) => task.id === value.id || (typeof value.title === "string" && task.title === value.title)
  );
  const fallback = matchingDefault ?? summerBuildTasks[0];

  try {
    const id = matchingDefault?.id ?? validateTaskId(value.id ?? `imported-${index + 1}`);
    const completedByRecord = isRecord(value.completedBy) ? value.completedBy : undefined;
    const completed = value.status === "Completed";
    const completedBy = completed
      ? { tishon: true, mia: true }
      : completedByRecord
        ? { tishon: completedByRecord.tishon === true, mia: completedByRecord.mia === true }
        : { tishon: false, mia: false };
    const dueDate = matchingDefault?.dueDate ?? dateString(value.dueDate ?? value.date, "dueDate");

    return {
      id,
      title: requiredString(value.title ?? fallback.title, "title", 120),
      description: optionalString(value.description ?? value.whatToDo, "description", 1000, fallback.description),
      category: taskCategory(value.category, fallback.category),
      status: deriveTaskStatus(completedBy),
      dueDate,
      estimatedTime: optionalString(value.estimatedTime ?? value.duration, "estimatedTime", 60, fallback.estimatedTime) || fallback.estimatedTime,
      stage: optionalString(value.stage, "stage", 100, fallback.stage) || fallback.stage,
      whatToDo: optionalString(value.whatToDo ?? value.description, "whatToDo", 1000, fallback.whatToDo),
      checklist: stringList(value.checklist ?? value.subtasks, "checklist", fallback.checklist),
      deliverable: optionalString(value.deliverable, "deliverable", 300, fallback.deliverable),
      completedBy,
      createdBy: actor,
      createdAt: timestamp,
      lastUpdatedBy: actor,
      lastUpdatedAt: timestamp
    };
  } catch {
    return undefined;
  }
};

export const validateBootstrap = (value: unknown) => {
  if (!isRecord(value)) {
    throw new ApiError(400, "INVALID_BODY", "A JSON request body is required.");
  }

  const actor = validateActor(value.actor);
  if (actor !== "tishon") {
    throw new ApiError(400, "TISHON_REQUIRED", "Tishon must run the first shared task import.");
  }

  if (value.localTasks !== undefined && !Array.isArray(value.localTasks)) {
    throw new ApiError(400, "INVALID_FIELD", "localTasks must be an array.");
  }

  if (Array.isArray(value.localTasks) && value.localTasks.length > 500) {
    throw new ApiError(400, "INVALID_FIELD", "localTasks cannot contain more than 500 tasks.");
  }

  return { actor, localTasks: (value.localTasks as unknown[] | undefined) ?? [] };
};

export const buildBootstrapTasks = (actor: CollaboratorId, localTasks: unknown[], timestamp: string) => {
  const merged = new Map<string, SharedTask>();

  summerBuildTasks.forEach((task) => merged.set(task.id, migrationTask(task, actor, timestamp)));
  localTasks.forEach((task, index) => {
    const migrated = migrateLocalTask(task, index, actor, timestamp);
    if (migrated) merged.set(migrated.id, migrated);
  });

  return sortTasks(Array.from(merged.values()));
};

export const bootstrapSharedTasks = async (actor: CollaboratorId, localTasks: unknown[]) => {
  const redis = getRedis();
  const timestamp = new Date().toISOString();
  const tasks = buildBootstrapTasks(actor, localTasks, timestamp);
  const script = `
if redis.call("GET", KEYS[2]) then return 0 end
local tasks = cjson.decode(ARGV[1])
for _, task in ipairs(tasks) do
  redis.call("HSETNX", KEYS[1], task.id, cjson.encode(task))
end
redis.call("SET", KEYS[2], ARGV[2])
return #tasks
`;
  const importedCount = await redis.eval<string[], number>(script, [SHARED_TASKS_KEY, SHARED_INITIALIZED_KEY], [JSON.stringify(tasks), timestamp]);

  if (importedCount === 0) {
    throw new ApiError(409, "ALREADY_INITIALIZED", "Shared tasks are already initialized; no remote data was changed.");
  }

  return { importedCount, initializedAt: timestamp, tasks };
};
