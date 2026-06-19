import { useCallback, useEffect, useState } from "react";
import type { ActivityItem, CollaboratorId, SharedTask } from "@/types";

const collaboratorPreferenceKey = "focusflow:shared:v1:collaborator";
const migrationCompleteKey = "focusflow:shared:v1:migration-complete";
const legacyTaskKeys = ["focusflow:v5:tasks", "focusflow:v6:tasks", "focusflow:v7:tasks", "focusflow:v8:tasks"];

type ApiErrorBody = {
  error?: string;
  code?: string;
};

class ClientApiError extends Error {
  constructor(
    public status: number,
    public code: string
  ) {
    super(code === "SHARED_STORAGE_UNAVAILABLE" ? "Shared storage unavailable" : "Shared task request failed.");
  }
}

const requestJson = async <T,>(url: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(url, {
    ...init,
    headers: init?.body ? { "Content-Type": "application/json", ...init.headers } : init?.headers
  });
  const body = (await response.json().catch(() => ({}))) as T & ApiErrorBody;

  if (!response.ok) {
    const code = body.code ?? "SHARED_STORAGE_ERROR";
    const error = new ClientApiError(response.status, code);
    error.message = code === "SHARED_STORAGE_UNAVAILABLE" ? "Shared storage unavailable" : body.error ?? error.message;
    throw error;
  }

  return body;
};

const readLocalTasksForMigration = () => {
  const tasks: unknown[] = [];

  legacyTaskKeys.forEach((key) => {
    try {
      const value = window.localStorage.getItem(key);
      if (!value) return;

      const parsed = JSON.parse(value) as unknown;
      if (Array.isArray(parsed)) tasks.push(...parsed);
    } catch {
      // An unreadable legacy entry is skipped without affecting remote data.
    }
  });

  return tasks;
};

export type CreateSharedTaskInput = {
  title: string;
  description: string;
  dueDate: string;
  estimatedTime: string;
};

export type EditSharedTaskInput = Partial<Pick<SharedTask, "title" | "description" | "dueDate" | "estimatedTime">>;

export function useSharedTasks() {
  const [actor, setActorState] = useState<CollaboratorId>("tishon");
  const [tasks, setTasks] = useState<SharedTask[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsBootstrap, setNeedsBootstrap] = useState(false);
  const [pendingKeys, setPendingKeys] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const savedActor = window.localStorage.getItem(collaboratorPreferenceKey);
    if (savedActor === "tishon" || savedActor === "mia") setActorState(savedActor);
  }, []);

  const setActor = useCallback((nextActor: CollaboratorId) => {
    setActorState(nextActor);
    window.localStorage.setItem(collaboratorPreferenceKey, nextActor);
  }, []);

  const refresh = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);

    try {
      const taskResult = await requestJson<{ tasks: SharedTask[] }>("/api/shared/tasks");
      setTasks(taskResult.tasks);
      setNeedsBootstrap(false);
      const activityResult = await requestJson<{ activity: ActivityItem[] }>("/api/shared/activity");
      setActivity(activityResult.activity);
      setError(null);
    } catch (requestError) {
      if (requestError instanceof ClientApiError && requestError.code === "SHARED_STORAGE_NOT_INITIALIZED") {
        setNeedsBootstrap(true);
        setError(null);
      } else {
        setError(requestError instanceof Error ? requestError.message : "Shared storage unavailable");
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh(true);
    const interval = window.setInterval(() => void refresh(), 5_000);
    const handleFocus = () => void refresh();
    window.addEventListener("focus", handleFocus);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [refresh]);

  const withPending = useCallback(async (key: string, request: () => Promise<void>) => {
    setPendingKeys((current) => new Set(current).add(key));
    try {
      await request();
      await refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Shared storage unavailable");
      throw requestError;
    } finally {
      setPendingKeys((current) => {
        const next = new Set(current);
        next.delete(key);
        return next;
      });
    }
  }, [refresh]);

  const createTask = useCallback((input: CreateSharedTaskInput) => withPending("create", async () => {
    await requestJson("/api/shared/tasks", {
      method: "POST",
      body: JSON.stringify({ actor, ...input })
    });
  }), [actor, withPending]);

  const editTask = useCallback((taskId: string, patch: EditSharedTaskInput) => withPending(taskId, async () => {
    await requestJson(`/api/shared/tasks/${encodeURIComponent(taskId)}`, {
      method: "PATCH",
      body: JSON.stringify({ actor, ...patch })
    });
  }), [actor, withPending]);

  const deleteTask = useCallback((taskId: string) => withPending(taskId, async () => {
    await requestJson(`/api/shared/tasks/${encodeURIComponent(taskId)}`, {
      method: "DELETE",
      body: JSON.stringify({ actor })
    });
  }), [actor, withPending]);

  const setCompletion = useCallback((taskId: string, completed: boolean) => withPending(taskId, async () => {
    await requestJson(`/api/shared/tasks/${encodeURIComponent(taskId)}`, {
      method: "PATCH",
      body: JSON.stringify({ actor, completed })
    });
  }), [actor, withPending]);

  const bootstrap = useCallback(() => withPending("bootstrap", async () => {
    try {
      await requestJson("/api/shared/bootstrap", {
        method: "POST",
        body: JSON.stringify({ actor, localTasks: readLocalTasksForMigration() })
      });
    } catch (requestError) {
      if (!(requestError instanceof ClientApiError) || requestError.code !== "ALREADY_INITIALIZED") throw requestError;
    }

    window.localStorage.setItem(migrationCompleteKey, new Date().toISOString());
    setNeedsBootstrap(false);
  }), [actor, withPending]);

  return {
    actor,
    setActor,
    tasks,
    activity,
    loading,
    error,
    needsBootstrap,
    pendingKeys,
    refresh: () => refresh(true),
    createTask,
    editTask,
    deleteTask,
    setCompletion,
    bootstrap
  };
}
