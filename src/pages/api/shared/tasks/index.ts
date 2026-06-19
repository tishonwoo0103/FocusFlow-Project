import type { NextApiRequest, NextApiResponse } from "next";
import { methodNotAllowed, sendApiError } from "@/lib/sharedApi";
import { createSharedTask, readSharedTasks, validateCreateTask } from "@/lib/sharedTasksServer";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    if (request.method === "GET") {
      const tasks = await readSharedTasks();
      return response.status(200).json({ tasks });
    }

    if (request.method === "POST") {
      const { actor, task } = validateCreateTask(request.body);
      const createdTask = await createSharedTask(actor, task);
      return response.status(201).json({ task: createdTask });
    }

    return methodNotAllowed(response, ["GET", "POST"]);
  } catch (error) {
    return sendApiError(response, error);
  }
}
