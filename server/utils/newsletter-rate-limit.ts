import { createHmac, randomUUID } from "node:crypto";
import { isIP } from "node:net";
import type { H3Event } from "h3";
import { getRequestHeader, getRequestIP } from "h3";
import Redis from "ioredis";

const RATE_LIMIT_SCRIPT = `
local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
local member = ARGV[4]

redis.call("ZREMRANGEBYSCORE", key, 0, now - window)
local count = redis.call("ZCARD", key)

if count >= limit then
  local oldest = redis.call("ZRANGE", key, 0, 0, "WITHSCORES")
  local retry_after = window

  if oldest[2] then
    retry_after = math.max(1, tonumber(oldest[2]) + window - now)
  end

  redis.call("PEXPIRE", key, window)
  return { 0, count, retry_after }
end

redis.call("ZADD", key, now, member)
redis.call("PEXPIRE", key, window)
return { 1, count + 1, 0 }
`;

export interface RedisScriptClient {
  eval: (
    script: string,
    numberOfKeys: number,
    ...args: string[]
  ) => Promise<unknown>;
}

export interface RateLimitResult {
  allowed: boolean;
  count: number;
  retryAfterSeconds: number;
}

export interface NewsletterRateLimitOptions {
  client: RedisScriptClient;
  ip: string;
  hmacSecret: string;
  maxAttempts: number;
  windowSeconds: number;
  now?: number;
  member?: string;
}

function normalizeIp(ip: string): string | undefined {
  const candidate = ip.trim();
  const mappedIpv4 = candidate.startsWith("::ffff:")
    ? candidate.slice("::ffff:".length)
    : candidate;

  return isIP(mappedIpv4) ? mappedIpv4 : undefined;
}

export function getNewsletterClientIp(event: H3Event): string | undefined {
  const forwardedFor = getRequestHeader(event, "x-forwarded-for");
  const forwardedIp = forwardedFor?.split(",")[0];
  const fallbackIp = getRequestIP(event);

  return normalizeIp(forwardedIp || fallbackIp || "");
}

export function createNewsletterRateLimitKey(
  ip: string,
  hmacSecret: string,
): string {
  const digest = createHmac("sha256", hmacSecret).update(ip).digest("hex");

  return `t7n_website:newsletter:ip:${digest}`;
}

export async function consumeNewsletterRateLimit({
  client,
  ip,
  hmacSecret,
  maxAttempts,
  windowSeconds,
  now = Date.now(),
  member = randomUUID(),
}: NewsletterRateLimitOptions): Promise<RateLimitResult> {
  if (!hmacSecret || maxAttempts < 1 || windowSeconds < 1) {
    throw new Error("Invalid newsletter rate-limit configuration.");
  }

  const key = createNewsletterRateLimitKey(ip, hmacSecret);
  const result = await client.eval(
    RATE_LIMIT_SCRIPT,
    1,
    key,
    String(now),
    String(windowSeconds * 1000),
    String(maxAttempts),
    `${now}:${member}`,
  );

  if (!Array.isArray(result) || result.length !== 3) {
    throw new Error("Redis returned an invalid rate-limit result.");
  }

  const allowed = Number(result[0]);
  const count = Number(result[1]);
  const retryAfterMilliseconds = Number(result[2]);

  if (
    !Number.isFinite(allowed)
    || !Number.isFinite(count)
    || !Number.isFinite(retryAfterMilliseconds)
  ) {
    throw new Error("Redis returned a malformed rate-limit result.");
  }

  return {
    allowed: allowed === 1,
    count,
    retryAfterSeconds: Math.max(
      0,
      Math.ceil(retryAfterMilliseconds / 1000),
    ),
  };
}

export function createNewsletterRedisClient(url: string): Redis | undefined {
  if (!url) {
    return undefined;
  }

  return new Redis(url, {
    commandTimeout: 1_000,
    connectTimeout: 1_000,
    enableOfflineQueue: false,
    enableReadyCheck: false,
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    retryStrategy: (attempt) => Math.min(attempt * 250, 2_000),
  });
}
