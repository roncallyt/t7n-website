import { flushPromises } from "@vue/test-utils";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MaintenanceSubscribeForm from "../../app/components/MaintenanceSubscribeForm.vue";

const mocks = vi.hoisted(() => ({
  execute: vi.fn(),
  load: vi.fn(),
  subscribe: vi.fn(),
}));

mockNuxtImport("useRecaptcha", () => () => ({
  execute: mocks.execute,
  load: mocks.load,
}));

mockNuxtImport("useSubscribe", () => mocks.subscribe);

describe("MaintenanceSubscribeForm", () => {
  beforeEach(() => {
    mocks.execute.mockReset().mockResolvedValue("recaptcha-token");
    mocks.load.mockReset().mockResolvedValue(undefined);
    mocks.subscribe.mockReset().mockResolvedValue({ message: "ok" });
  });

  it("submits the email with a fresh reCAPTCHA token and clears on success", async () => {
    const component = await mountSuspended(MaintenanceSubscribeForm);

    await component.get("input[type=email]").setValue("reader@example.com");
    await component.get("form").trigger("submit");
    await flushPromises();

    expect(mocks.execute).toHaveBeenCalledWith("newsletter_subscribe");
    expect(mocks.subscribe).toHaveBeenCalledWith({
      email: "reader@example.com",
      recaptchaToken: "recaptcha-token",
    });
    expect(component.get("input[type=email]").element).toHaveProperty("value", "");
    expect(component.get("[role=status]").text()).toContain("let you know");
  });

  it("keeps the email and displays rate-limit feedback", async () => {
    mocks.subscribe.mockRejectedValue({ statusCode: 429 });
    const component = await mountSuspended(MaintenanceSubscribeForm);

    await component.get("input[type=email]").setValue("reader@example.com");
    await component.get("form").trigger("submit");
    await flushPromises();

    expect(component.get("input[type=email]").element).toHaveProperty(
      "value",
      "reader@example.com",
    );
    expect(component.get("[role=status]").text()).toContain("Too many attempts");
  });

  it("does not duplicate the global reCAPTCHA disclosure", async () => {
    const component = await mountSuspended(MaintenanceSubscribeForm);

    expect(component.findAll("a")).toHaveLength(0);
    expect(component.text()).not.toContain("protected by reCAPTCHA");
  });
});
