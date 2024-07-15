export default defineNuxtConfig({
  devServer: {
    port: 3001,
  },
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    'nuxt-highcharts',
    "@nuxt/image"
  ],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL,
    },
  },
});
