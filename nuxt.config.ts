// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  srcDir: '.',
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/'
  },
  css: ['~/assets/css/leaflet.css'],
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    public: {
      apiBase: 'https://rwapi.geoloogia.info/api/v1/public'
    }
  }
})
