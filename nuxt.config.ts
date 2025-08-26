// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  experimental: {
    viewTransition: true,
  },
  app: {
    head: {
      htmlAttrs: { lang: "en", class: "dark" },
      title: "Who Made the Best Banner?",
      titleTemplate: "%s · Best LinkedIn Banners",
      meta: [
        {
          name: "description",
          content:
            "Handpicked LinkedIn banners from top creators. Search by name, headline, or industry.",
        },
        { property: "og:title", content: "Who Made the Best Banner?" },
        {
          property: "og:description",
          content:
            "Handpicked LinkedIn banners from top creators. Search by name, headline, or industry.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Who Made the Best Banner?" },
        {
          name: "twitter:description",
          content:
            "Handpicked LinkedIn banners from top creators. Search by name, headline, or industry.",
        },
      ],
      // link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    },
  },
  modules: [
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "shadcn-nuxt",
    "nuxt-og-image",
    "nuxt-umami",
  ],
  css: ["~/assets/css/tailwind.css"],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./app/components/ui",
  },
  vite: {
    plugins: [tailwindcss()],
  },

  umami: {
    autoTrack: true,
    useDirective: true,
  },

  runtimeConfig: {
    tursoDatabaseUrl: process.env.TURSO_DATABASE_URL,
    tursoAuthToken: process.env.TURSO_AUTH_TOKEN,
  },
});
