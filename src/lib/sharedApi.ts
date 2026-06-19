import type { NextApiResponse } from "next";
import { SharedStorageUnavailableError } from "@/lib/redis";
import { ApiError } from "@/lib/sharedTasksServer";

export const sendApiError = (response: NextApiResponse, error: unknown) => {
  if (error instanceof ApiError) {
    return response.status(error.status).json({ error: error.message, code: error.code });
  }

  if (error instanceof SharedStorageUnavailableError) {
    return response.status(503).json({ error: "Shared storage unavailable", code: "SHARED_STORAGE_UNAVAILABLE" });
  }

  return response.status(500).json({ error: "Shared storage request failed.", code: "SHARED_STORAGE_ERROR" });
};

export const methodNotAllowed = (response: NextApiResponse, methods: string[]) => {
  response.setHeader("Allow", methods);
  return response.status(405).json({ error: "Method not allowed.", code: "METHOD_NOT_ALLOWED" });
};
