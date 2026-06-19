import type { NextApiRequest, NextApiResponse } from "next";
import { methodNotAllowed, sendApiError } from "@/lib/sharedApi";
import { bootstrapSharedTasks, validateBootstrap } from "@/lib/sharedTasksServer";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    if (request.method !== "POST") {
      return methodNotAllowed(response, ["POST"]);
    }

    const { actor, localTasks } = validateBootstrap(request.body);
    const result = await bootstrapSharedTasks(actor, localTasks);
    return response.status(201).json(result);
  } catch (error) {
    return sendApiError(response, error);
  }
}
