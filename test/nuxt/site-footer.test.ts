import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import SiteFooter from "../../app/components/SiteFooter.vue";

describe("SiteFooter", () => {
  it("renders the copyright and reCAPTCHA disclosure", async () => {
    const component = await mountSuspended(SiteFooter);
    const currentYear = new Date().getFullYear();
    const links = component.findAll("a");

    expect(component.text()).toContain("Made with");
    expect(component.text()).toContain("by T7n.");
    expect(component.text()).toContain(
      `© 2024–${currentYear}. All rights reserved.`,
    );
    expect(component.text()).toContain("This site is protected by reCAPTCHA");
    expect(links.map(link => link.attributes("href"))).toEqual([
      "https://policies.google.com/privacy",
      "https://policies.google.com/terms",
    ]);
  });
});
