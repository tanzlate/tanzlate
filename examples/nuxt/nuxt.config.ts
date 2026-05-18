// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  build: {
    transpile: ['@tanzlate/vue', '@tanzlate/vanilla', '@tanzlate/core'],
  },
  components: [
    {
      pathPrefix: false,
      path: '~/components',
    },
  ],
});
