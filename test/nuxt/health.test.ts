import type { H3Event } from "h3";
import { describe, expect, it } from "vitest";
import healthHandler from "../../server/routes/up.get";

describe("health route", () => {
  it("returns the deployment health response", async () => {
    const response = await healthHandler({} as H3Event);

    expect(response).toEqual({ status: "ok" });
  });
});
