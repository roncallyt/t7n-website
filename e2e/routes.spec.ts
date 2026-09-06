import { expect, test } from "@nuxt/test-utils/playwright";

test("reports that the application is healthy", async ({ request }) => {
  const response = await request.get("/up");

  expect(response.status()).toBe(200);
  await expect(response.json()).resolves.toEqual({ status: "ok" });
});

test.describe("localized homepages", () => {
  test("renders the Portuguese homepage by default", async ({ page, goto }) => {
    await goto("/", { waitUntil: "hydration" });

    await expect(
      page.getByRole("heading", { name: "Desenvolvedor Full Stack Senior" }),
    ).toBeVisible();
  });

  test("renders the English homepage", async ({ page, goto }) => {
    await goto("/en", { waitUntil: "hydration" });

    await expect(
      page.getByRole("heading", { name: "Senior Full Stack Developer" }),
    ).toBeVisible();
  });
});

test.describe("localized content", () => {
  const pages = [
    {
      path: "/projects/projeto-teste",
      title: "Projeto Teste | Thomerson Roncally",
      content: "Sobre o Projeto",
    },
    {
      path: "/en/projects/project-test",
      title: "Project Test | Thomerson Roncally",
      content: "About the Project",
    },
    {
      path: "/articles/artigo-teste",
      title: "Artigo Teste | Thomerson Roncally",
      content: "Título Teste",
    },
    {
      path: "/en/articles/article-test",
      title: "Article Test | Thomerson Roncally",
      content: "Title Test",
    },
  ] as const;

  for (const pageCase of pages) {
    test(`renders ${pageCase.path}`, async ({ page, goto }) => {
      await goto(pageCase.path, { waitUntil: "hydration" });

      await expect(page).toHaveTitle(pageCase.title);
      await expect(
        page.getByRole("heading", { name: pageCase.content }),
      ).toBeVisible();
    });
  }
});

test.describe("missing content", () => {
  const pages = [
    {
      path: "/projects/missing-project",
      message: "Project not found",
    },
    {
      path: "/articles/missing-article",
      message: "Article not found",
    },
  ] as const;

  for (const pageCase of pages) {
    test(`returns 404 for ${pageCase.path}`, async ({ page }) => {
      const response = await page.goto(pageCase.path);

      expect(response?.status()).toBe(404);
      await expect(page.locator("body")).toContainText(pageCase.message);
    });
  }
});
