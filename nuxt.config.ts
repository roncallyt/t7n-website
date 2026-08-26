// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2026-01-01",
  devtools: { enabled: true },

  css: ["./app/assets/css/main.css"],

  site: {
    name: "Thomerson Roncally",
    url: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
  },

  modules: [
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxtjs/i18n",
    "@pinia/nuxt",
    "@nuxtjs/color-mode",
    "@nuxtjs/seo",
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
  ],

  colorMode: {
    classSuffix: "",
  },

  i18n: {
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
    strategy: "prefix_except_default",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
    locales: [
      {
        flag: "us",
        code: "en",
        language: "en-US",
        name: "English",
        isCatchallLocale: false,
      },
      {
        flag: "br",
        code: "pt-br",
        language: "pt-BR",
        name: "Português do Brasil",
        isCatchallLocale: true,
      },
    ],
    defaultLocale: "pt-br",
    vueI18n: "./i18n.config.ts",
  },

  vite: {
    optimizeDeps: {
      exclude: ["@nuxtjs/mdc"],
    },
  },
});
