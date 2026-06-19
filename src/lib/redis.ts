import { Redis } from "@upstash/redis";

let redis: Redis | undefined;

export class SharedStorageUnavailableError extends Error {
  constructor() {
    super("Shared storage unavailable");
    this.name = "SharedStorageUnavailableError";
  }
}

export const getRedis = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new SharedStorageUnavailableError();
  }

  if (!redis) {
    redis = new Redis({ url, token });
  }

  return redis;
};
