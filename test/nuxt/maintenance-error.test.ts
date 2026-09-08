import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it, vi } from "vitest";
import ApplicationError from "../../app/error.vue";

const mocks = vi.hoisted(() => ({
  execute: vi.fn(),
  load: vi.fn().mockResolvedValue(undefined),
}));

mockNuxtImport("useRecaptcha", () => () => ({
  execute: mocks.execute,
  load: mocks.load,
}));

describe("maintenance error page", () => {
  it("renders the protected subscription form", async () => {
    const component = await mountSuspended(ApplicationError, {
      props: {
        error: {
          statusCode: 503,
          data: {
            code: "NUXT_MAINTAINER",
            maintenance: {
              down: true,
              message: "Back soon.",
              since: "2026-09-07T12:00:00.000Z",
            },
          },
        },
      },
    });

    expect(component.get("input[type=email]").attributes("id"))
      .toBe("maintenance-subscribe-email");
    expect(component.get("button[type=submit]").attributes("aria-label"))
      .toBe("Notify me");
    expect(component.text()).toContain("This site is protected by reCAPTCHA");
    expect(component.text().match(/Made with/g)).toHaveLength(1);
  });
});
