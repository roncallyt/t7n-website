// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2026-01-01",
  devtools: { enabled: true },

  runtimeConfig: {
    recaptchaSecretKey: "",
    recaptchaAllowedHostname:
      process.env.NUXT_RECAPTCHA_ALLOWED_HOSTNAME ||
      new URL(process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000")
        .hostname,
    recaptchaScoreThreshold: 0.5,
    redisUrl: "",
    rateLimitHmacSecret: "",
    rateLimitMaxAttempts: 5,
    rateLimitWindowSeconds: 600,
    public: {
      recaptchaSiteKey: "",
    },
  },

  css: ["~/assets/css/main.css"],

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
    "nuxt-maintainer",
    "nuxt-listmonk",
  ],

  colorMode: {
    classSuffix: "",
  },

  fonts: {
    families: [
      {
        name: "JetBrains Mono",
        provider: "google",
        weights: [400, 600],
        styles: ["normal"],
        preload: true,
      },
    ],
  },

  maintainer: {
    exclude: ["/up", "/api/subscribe"],
  },

  listmonk: {
    host: process.env.NUXT_LISTMONK_HOST,
    listId: process.env.NUXT_LISTMONK_LIST_ID,
    apiUsername: process.env.NUXT_LISTMONK_API_USERNAME,
    apiToken: process.env.NUXT_LISTMONK_API_TOKEN,
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
