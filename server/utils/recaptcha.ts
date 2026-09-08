import { createError } from "h3";

const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const RECAPTCHA_TIMEOUT_MS = 3_000;
const MAX_RECAPTCHA_TOKEN_LENGTH = 4_096;

interface RecaptchaResponse {
  success?: unknown;
  score?: unknown;
  action?: unknown;
  hostname?: unknown;
  "error-codes"?: unknown;
}

export interface VerifyRecaptchaOptions {
  token: unknown;
  secretKey: string;
  allowedHostname: string;
  expectedAction: string;
  scoreThreshold: number;
  remoteIp?: string;
  fetchImplementation?: typeof fetch;
}

function serviceUnavailable() {
  return createError({
    statusCode: 503,
    statusMessage: "Subscription verification is temporarily unavailable.",
  });
}

function verificationRejected() {
  return createError({
    statusCode: 403,
    statusMessage: "Subscription verification failed.",
  });
}

export async function verifyRecaptcha({
  token,
  secretKey,
  allowedHostname,
  expectedAction,
  scoreThreshold,
  remoteIp,
  fetchImplementation = fetch,
}: VerifyRecaptchaOptions): Promise<void> {
  if (
    typeof token !== "string"
    || !token
    || token.length > MAX_RECAPTCHA_TOKEN_LENGTH
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing or invalid reCAPTCHA token.",
    });
  }

  if (
    !secretKey
    || !allowedHostname
    || !expectedAction
    || !Number.isFinite(scoreThreshold)
    || scoreThreshold < 0
    || scoreThreshold > 1
  ) {
    throw serviceUnavailable();
  }

  const body = new URLSearchParams({
    secret: secretKey,
    response: token,
  });

  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  let response: Response;

  try {
    response = await fetchImplementation(RECAPTCHA_VERIFY_URL, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      signal: AbortSignal.timeout(RECAPTCHA_TIMEOUT_MS),
    });
  } catch {
    throw serviceUnavailable();
  }

  if (!response.ok) {
    throw serviceUnavailable();
  }

  let result: RecaptchaResponse;

  try {
    result = await response.json() as RecaptchaResponse;
  } catch {
    throw serviceUnavailable();
  }

  const errorCodes = Array.isArray(result["error-codes"])
    ? result["error-codes"]
    : [];

  if (
    errorCodes.includes("invalid-input-secret")
    || errorCodes.includes("missing-input-secret")
  ) {
    throw serviceUnavailable();
  }

  if (
    result.success !== true
    || typeof result.score !== "number"
    || result.score < scoreThreshold
    || result.action !== expectedAction
    || typeof result.hostname !== "string"
    || result.hostname.toLowerCase() !== allowedHostname.toLowerCase()
  ) {
    throw verificationRejected();
  }
}
