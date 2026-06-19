import assert from "node:assert/strict";
import test from "node:test";
import type { NextApiRequest, NextApiResponse } from "next";
import tasksHandler from "../src/pages/api/shared/tasks";
import {
  ApiError,
  buildBootstrapTasks,
  deriveTaskStatus,
  validateCreateTask,
  validateTaskPatch
} from "../src/lib/sharedTasksServer";
import { summerBuildTasks } from "../src/lib/summerSchedule";

const migrationTime = "2026-06-19T08:00:00.000Z";

test("derives the three allowed statuses from both completion values", () => {
  assert.equal(deriveTaskStatus({ tishon: false, mia: false }), "Next Up");
  assert.equal(deriveTaskStatus({ tishon: true, mia: false }), "In Progress");
  assert.equal(deriveTaskStatus({ tishon: false, mia: true }), "In Progress");
  assert.equal(deriveTaskStatus({ tishon: true, mia: true }), "Completed");
});

test("bootstraps the complete 66-day schedule in date order", () => {
  const tasks = buildBootstrapTasks("tishon", [], migrationTime);

  assert.equal(tasks.length, 66);
  assert.equal(tasks[0].dueDate, "2026-06-21");
  assert.equal(tasks[65].dueDate, "2026-08-25");
  assert.equal(new Set(tasks.map((task) => task.id)).size, 66);
  assert.ok(tasks.every((task) => task.createdAt === migrationTime));
});

test("migrates completed local progress to both collaborators without duplicating the schedule", () => {
  const firstTask = summerBuildTasks[0];
  const tasks = buildBootstrapTasks(
    "tishon",
    [{ ...firstTask, status: "Completed", description: "Saved browser progress" }],
    migrationTime
  );
  const migrated = tasks.find((task) => task.id === firstTask.id);

  assert.equal(tasks.length, 66);
  assert.deepEqual(migrated?.completedBy, { tishon: true, mia: true });
  assert.equal(migrated?.status, "Completed");
  assert.equal(migrated?.description, "Saved browser progress");
});

test("completed legacy status wins over a partial old checkbox object", () => {
  const firstTask = summerBuildTasks[0];
  const tasks = buildBootstrapTasks(
    "tishon",
    [{ ...firstTask, status: "Completed", completedBy: { tishon: true, mia: false } }],
    migrationTime
  );
  const migrated = tasks.find((task) => task.id === firstTask.id);

  assert.deepEqual(migrated?.completedBy, { tishon: true, mia: true });
  assert.equal(migrated?.status, "Completed");
});

test("maps an old date-based schedule record to the current stable task ID and date", () => {
  const firstTask = summerBuildTasks[0];
  const tasks = buildBootstrapTasks(
    "tishon",
    [{ ...firstTask, id: "summer-2026-06-17", dueDate: "2026-06-17", status: "Completed" }],
    migrationTime
  );
  const migrated = tasks.find((task) => task.title === firstTask.title);

  assert.equal(tasks.length, 66);
  assert.equal(migrated?.id, firstTask.id);
  assert.equal(migrated?.dueDate, "2026-06-21");
  assert.deepEqual(migrated?.completedBy, { tishon: true, mia: true });
});

test("preserves a valid extra local team task", () => {
  const tasks = buildBootstrapTasks(
    "tishon",
    [{
      id: "task-local-extra",
      title: "Pilot feedback review",
      description: "Review the pilot comments together.",
      category: "Planning",
      status: "In Progress",
      dueDate: "2026-08-26",
      estimatedTime: "30 minutes",
      stage: "Launch Prep",
      whatToDo: "Review the comments.",
      checklist: ["Read comments", "Choose changes"],
      deliverable: "Feedback decisions"
    }],
    migrationTime
  );
  const imported = tasks.find((task) => task.id === "task-local-extra");

  assert.equal(tasks.length, 67);
  assert.deepEqual(imported?.completedBy, { tishon: false, mia: false });
  assert.equal(imported?.status, "Next Up");
});

test("accepts valid shared task creation and ignores browser-submitted status", () => {
  const result = validateCreateTask({
    actor: "mia",
    title: "Review shared roadmap",
    description: "Check the next stage together.",
    dueDate: "2099-01-01",
    estimatedTime: "25 minutes",
    status: "Completed"
  });

  assert.equal(result.actor, "mia");
  assert.equal(result.task.title, "Review shared roadmap");
  assert.equal("status" in result.task, false);
});

test("rejects invalid actors and direct status-only patches", () => {
  assert.throws(
    () => validateCreateTask({ actor: "anyone", title: "Task", dueDate: "2099-01-01", estimatedTime: "10 minutes" }),
    (error) => error instanceof ApiError && error.status === 400 && error.code === "INVALID_ACTOR"
  );
  assert.throws(
    () => validateTaskPatch({ actor: "tishon", status: "Completed" }),
    (error) => error instanceof ApiError && error.status === 400 && error.code === "EMPTY_PATCH"
  );
});

const mockResponse = () => {
  const state: { status?: number; body?: unknown; headers: Record<string, string[]> } = { headers: {} };
  const response = {
    status(code: number) {
      state.status = code;
      return response;
    },
    json(body: unknown) {
      state.body = body;
      return response;
    },
    setHeader(name: string, value: string[]) {
      state.headers[name] = value;
      return response;
    }
  } as unknown as NextApiResponse;

  return { response, state };
};

test("shared task API returns a clear unavailable error when Redis is not configured", async () => {
  const previousUrl = process.env.UPSTASH_REDIS_REST_URL;
  const previousToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;

  try {
    const { response, state } = mockResponse();
    await tasksHandler({ method: "GET" } as NextApiRequest, response);
    assert.equal(state.status, 503);
    assert.deepEqual(state.body, { error: "Shared storage unavailable", code: "SHARED_STORAGE_UNAVAILABLE" });
  } finally {
    if (previousUrl) process.env.UPSTASH_REDIS_REST_URL = previousUrl;
    if (previousToken) process.env.UPSTASH_REDIS_REST_TOKEN = previousToken;
  }
});
