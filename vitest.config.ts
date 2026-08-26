import { fileURLToPath } from "node:url";
import { defineVitestProject } from "@nuxt/test-utils/config";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      await defineVitestProject({
        test: {
          name: "nuxt",
          include: ["test/nuxt/*.{test,spec}.ts"],
          environment: "nuxt",
          environmentOptions: {
            nuxt: {
              rootDir: fileURLToPath(new URL(".", import.meta.url)),
              domEnvironment: "happy-dom",
              overrides: {
                i18n: {
                  baseUrl: "https://t7n.dev",
                },
                ogImage: {
                  enabled: false,
                },
              },
            },
          },
        },
      }),
    ],
    coverage: {
      provider: "v8",
      include: ["app/**/*.{ts,vue}"],
      reporter: ["text", "html"],
    },
  },
});
