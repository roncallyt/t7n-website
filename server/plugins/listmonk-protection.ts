import { createListmonkProtectionHandler } from "../utils/listmonk-protection";
import { createNewsletterRedisClient } from "../utils/newsletter-rate-limit";

const WARNING_INTERVAL_MS = 60_000;

let lastRateLimitWarningAt = 0;

function warnRateLimitUnavailable() {
  const now = Date.now();

  if (now - lastRateLimitWarningAt < WARNING_INTERVAL_MS) {
    return;
  }

  lastRateLimitWarningAt = now;
  console.warn(
    "[newsletter] Redis rate limiting is unavailable; continuing with reCAPTCHA protection.",
  );
}

export default defineNitroPlugin((nitroApp) => {
  const config = useRuntimeConfig();
  const redis = createNewsletterRedisClient(String(config.redisUrl || ""));

  if (redis) {
    redis.on("error", warnRateLimitUnavailable);
    void redis.connect().catch(warnRateLimitUnavailable);
  }

  nitroApp.hooks.hook("listmonk:subscribe:before", createListmonkProtectionHandler({
    recaptchaSecretKey: String(config.recaptchaSecretKey || ""),
    recaptchaAllowedHostname: String(config.recaptchaAllowedHostname || ""),
    recaptchaScoreThreshold: Number(config.recaptchaScoreThreshold),
    rateLimitHmacSecret: String(config.rateLimitHmacSecret || ""),
    rateLimitMaxAttempts: Number(config.rateLimitMaxAttempts),
    rateLimitWindowSeconds: Number(config.rateLimitWindowSeconds),
  }, { redis, warn: warnRateLimitUnavailable }));

  nitroApp.hooks.hook("close", () => {
    redis?.disconnect();
  });
});
