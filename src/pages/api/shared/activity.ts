import type { NextApiRequest, NextApiResponse } from "next";
import { methodNotAllowed, sendApiError } from "@/lib/sharedApi";
import { readSharedActivity } from "@/lib/sharedTasksServer";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    if (request.method !== "GET") {
      return methodNotAllowed(response, ["GET"]);
    }

    const activity = await readSharedActivity();
    return response.status(200).json({ activity });
  } catch (error) {
    return sendApiError(response, error);
  }
}
