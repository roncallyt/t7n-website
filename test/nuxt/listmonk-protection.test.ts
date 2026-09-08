import type { H3Event } from "h3";
import { createError } from "h3";
import { describe, expect, it, vi } from "vitest";
import { createListmonkProtectionHandler } from "../../server/utils/listmonk-protection";

const config = {
  recaptchaSecretKey: "secret",
  recaptchaAllowedHostname: "t7n.dev",
  recaptchaScoreThreshold: 0.5,
  rateLimitHmacSecret: "hmac-secret",
  rateLimitMaxAttempts: 5,
  rateLimitWindowSeconds: 600,
};

function createContext() {
  const setHeader = vi.fn();
  const event = {
    node: {
      req: {
        headers: { "x-forwarded-for": "203.0.113.10" },
        socket: { remoteAddress: "172.18.0.3" },
      },
      res: { setHeader },
    },
    context: {},
  } as unknown as H3Event;

  return {
    context: {
      event,
      body: { email: "reader@example.com", recaptchaToken: "token" },
      subscriber: { email: "reader@example.com", name: "" },
    },
    setHeader,
  };
}

describe("Listmonk subscription protection", () => {
  it("runs the rate limiter before reCAPTCHA", async () => {
    const calls: string[] = [];
    const redis = {
      status: "ready",
      eval: vi.fn(async () => {
        calls.push("rate-limit");
        return [1, 1, 0];
      }),
    };
    const verify = vi.fn(async () => {
      calls.push("recaptcha");
    });
    const { context } = createContext();
    const handler = createListmonkProtectionHandler(config, { redis, verify });

    await handler(context);

    expect(calls).toEqual(["rate-limit", "recaptcha"]);
    expect(verify).toHaveBeenCalledWith(expect.objectContaining({
      token: "token",
      remoteIp: "203.0.113.10",
      expectedAction: "newsletter_subscribe",
    }));
  });

  it("fails open when Redis is unavailable", async () => {
    const redis = {
      status: "ready",
      eval: vi.fn(async () => {
        throw new Error("Redis unavailable");
      }),
    };
    const verify = vi.fn(async () => undefined);
    const warn = vi.fn();
    const { context } = createContext();
    const handler = createListmonkProtectionHandler(config, {
      redis,
      verify,
      warn,
    });

    await handler(context);

    expect(warn).toHaveBeenCalledOnce();
    expect(verify).toHaveBeenCalledOnce();
  });

  it("returns 429 without invoking reCAPTCHA after the limit", async () => {
    const redis = {
      status: "ready",
      eval: vi.fn(async () => [0, 5, 600_000]),
    };
    const verify = vi.fn(async () => undefined);
    const { context, setHeader } = createContext();
    const handler = createListmonkProtectionHandler(config, { redis, verify });

    await expect(handler(context)).rejects.toMatchObject({ statusCode: 429 });
    expect(setHeader).toHaveBeenCalledWith("Retry-After", 600);
    expect(verify).not.toHaveBeenCalled();
  });

  it("propagates reCAPTCHA rejection to stop the Listmonk request", async () => {
    const redis = {
      status: "ready",
      eval: vi.fn(async () => [1, 1, 0]),
    };
    const verify = vi.fn(async () => {
      throw createError({ statusCode: 403 });
    });
    const { context } = createContext();
    const handler = createListmonkProtectionHandler(config, { redis, verify });

    await expect(handler(context)).rejects.toMatchObject({ statusCode: 403 });
  });
});
