// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  modules: ["@nuxtjs/tailwindcss"],
  css: ["@/assets/css/common.scss"],
  runtimeConfig: {
    public: {
      ENV: process.env[process.env.NODE_ENV + "_" + "ENV"],
      apiKey: process.env[process.env.NODE_ENV + "_" + "apiKey"],
      authDomain: process.env[process.env.NODE_ENV + "_" + "authDomain"],
      projectId: process.env[process.env.NODE_ENV + "_" + "projectId"],
      storageBucket: process.env[process.env.NODE_ENV + "_" + "storageBucket"],
      databaseURL: process.env[process.env.NODE_ENV + "_" + "databaseURL"],
      SENTRY_KEY: process.env.SENTRY_KEY,
      GOOGLE_MAPS_API_KEY: process.env.NUXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    },
  },
})
