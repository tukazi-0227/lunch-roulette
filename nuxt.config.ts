// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  css: ["~/assets/css/tailwind.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    public: {
      ENV: process.env[process.env.NODE_ENV + "_" + "ENV"],
      apiKey: process.env[process.env.NODE_ENV + "_" + "apiKey"],
      authDomain: process.env[process.env.NODE_ENV + "_" + "authDomain"],
      projectId: process.env[process.env.NODE_ENV + "_" + "projectId"],
      storageBucket: process.env[process.env.NODE_ENV + "_" + "storageBucket"],
      databaseURL: process.env[process.env.NODE_ENV + "_" + "databaseURL"],
      SENTRY_KEY: process.env.SENTRY_KEY,
    },
  },
})
