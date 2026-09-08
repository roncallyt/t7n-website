import { describe, expect, it, vi } from "vitest";
import { verifyRecaptcha } from "../../server/utils/recaptcha";

const validResponse = {
  success: true,
  score: 0.9,
  action: "newsletter_subscribe",
  hostname: "t7n.dev",
};

function responseWith(body: unknown, status = 200): typeof fetch {
  return vi.fn(async () => new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  })) as typeof fetch;
}

function verifyWith(
  body: unknown,
  overrides: Partial<Parameters<typeof verifyRecaptcha>[0]> = {},
) {
  return verifyRecaptcha({
    token: "token",
    secretKey: "secret",
    allowedHostname: "t7n.dev",
    expectedAction: "newsletter_subscribe",
    scoreThreshold: 0.5,
    remoteIp: "203.0.113.10",
    fetchImplementation: responseWith(body),
    ...overrides,
  });
}

describe("reCAPTCHA verification", () => {
  it("accepts a matching response and sends secrets in the request body", async () => {
    const fetchImplementation = responseWith(validResponse);

    await verifyWith(validResponse, { fetchImplementation });

    expect(fetchImplementation).toHaveBeenCalledOnce();
    const [url, request] = vi.mocked(fetchImplementation).mock.calls[0]!;
    const body = request?.body as URLSearchParams;

    expect(url).toBe("https://www.google.com/recaptcha/api/siteverify");
    expect(String(url)).not.toContain("secret");
    expect(body.get("secret")).toBe("secret");
    expect(body.get("response")).toBe("token");
    expect(body.get("remoteip")).toBe("203.0.113.10");
  });

  it.each([
    ["low score", { ...validResponse, score: 0.4 }],
    ["wrong action", { ...validResponse, action: "login" }],
    ["wrong hostname", { ...validResponse, hostname: "example.com" }],
    ["expired or duplicate token", { success: false, "error-codes": ["timeout-or-duplicate"] }],
  ])("rejects a %s response", async (_case, body) => {
    await expect(verifyWith(body)).rejects.toMatchObject({ statusCode: 403 });
  });

  it("rejects missing tokens as a bad request", async () => {
    await expect(verifyWith(validResponse, { token: "" })).rejects.toMatchObject({
      statusCode: 400,
    });
  });

  it.each([
    ["invalid secret", { success: false, "error-codes": ["invalid-input-secret"] }, 200],
    ["upstream error", {}, 500],
  ])("reports %s as unavailable", async (_case, body, status) => {
    await expect(verifyWith(body, {
      fetchImplementation: responseWith(body, status),
    })).rejects.toMatchObject({ statusCode: 503 });
  });

  it("reports network failures as unavailable", async () => {
    const fetchImplementation = vi.fn(async () => {
      throw new Error("network error");
    }) as typeof fetch;

    await expect(verifyWith(validResponse, { fetchImplementation })).rejects.toMatchObject({
      statusCode: 503,
    });
  });
});
