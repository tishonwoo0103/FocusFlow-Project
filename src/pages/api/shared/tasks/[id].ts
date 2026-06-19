import type { NextApiRequest, NextApiResponse } from "next";
import { methodNotAllowed, sendApiError } from "@/lib/sharedApi";
import { deleteSharedTask, updateSharedTask, validateActor, validateTaskId, validateTaskPatch } from "@/lib/sharedTasksServer";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const id = validateTaskId(request.query.id);

    if (request.method === "PATCH") {
      const { actor, patch } = validateTaskPatch(request.body);
      const task = await updateSharedTask(id, actor, patch);
      return response.status(200).json({ task });
    }

    if (request.method === "DELETE") {
      const actor = validateActor(request.body?.actor);
      const task = await deleteSharedTask(id, actor);
      return response.status(200).json({ task });
    }

    return methodNotAllowed(response, ["PATCH", "DELETE"]);
  } catch (error) {
    return sendApiError(response, error);
  }
}
