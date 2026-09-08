import type { H3Event } from "h3";
import { describe, expect, it } from "vitest";
import {
  consumeNewsletterRateLimit,
  createNewsletterRateLimitKey,
  getNewsletterClientIp,
} from "../../server/utils/newsletter-rate-limit";

class InMemoryRedisScriptClient {
  readonly scores = new Map<string, number[]>();

  async eval(
    _script: string,
    _numberOfKeys: number,
    key: string,
    nowValue: string,
    windowValue: string,
    limitValue: string,
  ): Promise<[number, number, number]> {
    const now = Number(nowValue);
    const window = Number(windowValue);
    const limit = Number(limitValue);
    const scores = (this.scores.get(key) || []).filter(
      score => score > now - window,
    );

    if (scores.length >= limit) {
      this.scores.set(key, scores);
      return [0, scores.length, Math.max(1, scores[0]! + window - now)];
    }

    scores.push(now);
    scores.sort((a, b) => a - b);
    this.scores.set(key, scores);
    return [1, scores.length, 0];
  }
}

describe("newsletter rate limiting", () => {
  it("allows five attempts in a rolling window and rejects the sixth", async () => {
    const client = new InMemoryRedisScriptClient();
    const options = {
      client,
      ip: "203.0.113.10",
      hmacSecret: "test-hmac-secret",
      maxAttempts: 5,
      windowSeconds: 600,
      now: 1_000_000,
    };

    for (let attempt = 1; attempt <= 5; attempt += 1) {
      await expect(consumeNewsletterRateLimit({
        ...options,
        member: String(attempt),
      })).resolves.toMatchObject({ allowed: true, count: attempt });
    }

    await expect(consumeNewsletterRateLimit({
      ...options,
      member: "sixth",
    })).resolves.toEqual({
      allowed: false,
      count: 5,
      retryAfterSeconds: 600,
    });
  });

  it("keeps IP limits independent and expires old attempts", async () => {
    const client = new InMemoryRedisScriptClient();
    const base = {
      client,
      hmacSecret: "test-hmac-secret",
      maxAttempts: 1,
      windowSeconds: 10,
    };

    await consumeNewsletterRateLimit({ ...base, ip: "203.0.113.10", now: 1_000 });

    await expect(consumeNewsletterRateLimit({
      ...base,
      ip: "203.0.113.11",
      now: 1_000,
    })).resolves.toMatchObject({ allowed: true });

    await expect(consumeNewsletterRateLimit({
      ...base,
      ip: "203.0.113.10",
      now: 11_001,
    })).resolves.toMatchObject({ allowed: true });
  });

  it("does not expose the raw IP in Redis keys", () => {
    const key = createNewsletterRateLimitKey(
      "203.0.113.10",
      "test-hmac-secret",
    );

    expect(key).toMatch(/^t7n_website:newsletter:ip:[a-f0-9]{64}$/);
    expect(key).not.toContain("203.0.113.10");
  });

  it("uses the trusted forwarded client address and normalizes mapped IPv4", () => {
    const event = {
      node: {
        req: {
          headers: { "x-forwarded-for": "::ffff:203.0.113.10, 172.18.0.2" },
          socket: { remoteAddress: "172.18.0.3" },
        },
      },
      context: {},
    } as unknown as H3Event;

    expect(getNewsletterClientIp(event)).toBe("203.0.113.10");
  });
});
