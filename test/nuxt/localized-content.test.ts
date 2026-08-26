import { mountSuspended } from "@nuxt/test-utils/runtime";
import { defineComponent } from "vue";
import { describe, expect, it } from "vitest";
import { useLocalizedCollection } from "../../app/composables/useLocalizedContent";

const LocaleProbe = defineComponent({
  setup() {
    const { locale } = useI18n();
    const articles = useLocalizedCollection("articles");
    const projects = useLocalizedCollection("projects");

    return { articles, locale, projects };
  },
  template: `
    <div>
      <button data-locale="en" @click="locale = 'en'">English</button>
      <button data-locale="pt-br" @click="locale = 'pt-br'">Português</button>
      <span data-articles>{{ articles }}</span>
      <span data-projects>{{ projects }}</span>
    </div>
  `,
});

describe("useLocalizedCollection", () => {
  it.each([
    ["en", "articles_en", "projects_en"],
    ["pt-br", "articles_pt_br", "projects_pt_br"],
  ] as const)(
    "selects the %s content collections",
    async (locale, expectedArticles, expectedProjects) => {
      const component = await mountSuspended(LocaleProbe);

      await component.get(`[data-locale="${locale}"]`).trigger("click");

      expect(component.get("[data-articles]").text()).toBe(expectedArticles);
      expect(component.get("[data-projects]").text()).toBe(expectedProjects);
    },
  );
});
