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
      allowedHosts: [".ubmager.shop", ".bornhub.cloud"],
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
      link: [
        { rel: "manifest", href: "/manifest.webmanifest" },
        { rel: "apple-touch-icon", href: "/icons/icon-192.png" },
      ],
      title: "UBMager Frontend",
      meta: [
        { name: "description", content: "Frontend SSR untuk UBMager" },
        { name: "theme-color", content: "#0f172a" },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "black" },
      ],
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },
});
