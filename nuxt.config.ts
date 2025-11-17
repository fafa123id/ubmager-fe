import tailwindcss from "@tailwindcss/vite";
import axios from "axios";
export default defineNuxtConfig({
  routeRules: {
    // Homepage pre-rendered at build time
    "/": { prerender: true },
    "/auth/**": { ssr: false },
  },
  compatibilityDate: "2025-07-15",
  css: ["./app/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: [".bornhub.cloud"],
    },
  },
  build: {
    transpile: ["@fortawesome/vue-fontawesome"],
  },
  ssr: true,
  nitro: {
    externals: { inline: [] },
    preset: "node-server",
  },
  app: {
    pageTransition: {
      name: "fade",
      mode: "out-in", // biar halaman lama keluar dulu, baru masuk yang baru
    },
    layoutTransition: { name: "layout", mode: "out-in" },
    head: {
      title: "UBMager Frontend",
      meta: [{ name: "description", content: "Frontend SSR untuk UBMager" }],
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },
});
