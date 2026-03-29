import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export function userKey(id: string) {
  return `user:${id}`;
}

export function planKey(userId: string, planId: string) {
  return `plan:${userId}:${planId}`;
}
