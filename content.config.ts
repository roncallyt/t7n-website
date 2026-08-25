import { defineCollection, defineContentConfig } from "@nuxt/content";
import { z } from "zod";

const projectSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  badges: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

const articleSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string().optional(),
  category: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const locales = ["en", "pt-br"];

function createLocalizedCollections(name: string, schema: z.ZodObject) {
  return Object.fromEntries(
    locales.map((locale) => {
      const key = `${name}_${locale.replace("-", "_")}`;

      return [
        key,
        defineCollection({
          type: "page",
          source: {
            include: `${locale}/${name}/**`,
            prefix: locale === "pt-br" ? `/${name}` : `/${locale}/${name}`,
          },
          schema,
        }),
      ];
    }),
  );
}

export default defineContentConfig({
  collections: {
    ...createLocalizedCollections("projects", projectSchema),
    ...createLocalizedCollections("articles", articleSchema),
  },
});
