import { createError, setResponseHeader } from "h3";
import type { ListmonkSubscribeContext } from "nuxt-listmonk";
import {
  consumeNewsletterRateLimit,
  getNewsletterClientIp,
} from "./newsletter-rate-limit";
import type { RedisScriptClient } from "./newsletter-rate-limit";
import { verifyRecaptcha } from "./recaptcha";

const RECAPTCHA_ACTION = "newsletter_subscribe";

export interface NewsletterProtectionConfig {
  recaptchaSecretKey: string;
  recaptchaAllowedHostname: string;
  recaptchaScoreThreshold: number;
  rateLimitHmacSecret: string;
  rateLimitMaxAttempts: number;
  rateLimitWindowSeconds: number;
}

interface NewsletterProtectionDependencies {
  redis?: RedisScriptClient & { status: string };
  verify?: typeof verifyRecaptcha;
  warn?: () => void;
}

export function createListmonkProtectionHandler(
  config: NewsletterProtectionConfig,
  {
    redis,
    verify = verifyRecaptcha,
    warn = () => undefined,
  }: NewsletterProtectionDependencies = {},
) {
  return async ({ event, body }: ListmonkSubscribeContext) => {
    const clientIp = getNewsletterClientIp(event);

    if (
      redis?.status === "ready"
      && clientIp
      && config.rateLimitHmacSecret
    ) {
      try {
        const result = await consumeNewsletterRateLimit({
          client: redis,
          ip: clientIp,
          hmacSecret: config.rateLimitHmacSecret,
          maxAttempts: config.rateLimitMaxAttempts,
          windowSeconds: config.rateLimitWindowSeconds,
        });

        if (!result.allowed) {
          setResponseHeader(
            event,
            "Retry-After",
            result.retryAfterSeconds,
          );
          throw createError({
            statusCode: 429,
            statusMessage: "Too many subscription attempts.",
          });
        }
      } catch (error) {
        if (
          error
          && typeof error === "object"
          && "statusCode" in error
          && error.statusCode === 429
        ) {
          throw error;
        }

        warn();
      }
    } else {
      warn();
    }

    await verify({
      token: body.recaptchaToken,
      secretKey: config.recaptchaSecretKey,
      allowedHostname: config.recaptchaAllowedHostname,
      expectedAction: RECAPTCHA_ACTION,
      scoreThreshold: config.recaptchaScoreThreshold,
      remoteIp: clientIp,
    });
  };
}
