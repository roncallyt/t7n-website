import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import CoreButton from "../../app/components/Core/Button.vue";

describe("CoreButton", () => {
  it("renders a button with a safe default type", async () => {
    const component = await mountSuspended(CoreButton, {
      slots: { default: "Continue" },
    });

    expect(component.element.tagName).toBe("BUTTON");
    expect(component.attributes("type")).toBe("button");
    expect(component.text()).toBe("Continue");
  });

  it.each(["submit", "reset"] as const)(
    "forwards the %s button type",
    async (type) => {
      const component = await mountSuspended(CoreButton, {
        props: { type },
      });

      expect(component.attributes("type")).toBe(type);
    },
  );

  it("renders link mode with its navigation attributes", async () => {
    const component = await mountSuspended(CoreButton, {
      props: {
        link: true,
        href: "https://example.com",
        target: "_blank",
      },
      slots: { default: "External link" },
    });

    expect(component.element.tagName).toBe("A");
    expect(component.attributes("href")).toBe("https://example.com");
    expect(component.attributes("target")).toBe("_blank");
    expect(component.text()).toBe("External link");
  });
});
