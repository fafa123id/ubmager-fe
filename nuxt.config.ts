import tailwindcss from "@tailwindcss/vite";
import axios from "axios";
export default defineNuxtConfig({
  modules: ["@vite-pwa/nuxt"],

  pwa: {
    registerType: "autoUpdate",

    workbox: {
    navigateFallback: undefined,   
    globPatterns: ['**/*.{js,css,css,html,png,svg,ico}'],

    runtimeCaching: [

      {
        urlPattern: /^https:\/\/dev\.ubmager\.shop\/$/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'html-cache',
          networkTimeoutSeconds: 3
        }
      },

      {
        urlPattern: /^https:\/\/dev-api\.ubmager\.shop\/api\/.*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          networkTimeoutSeconds: 5
        }
      }
    ]
  }

    manifest: {
      name: "UBMager",
      short_name: "UBMager",
      description: "UBMager Progressive Web App",
      theme_color: "#0f172a",
      background_color: "#0f172a",
      display: "standalone",
      start_url: "/",
      icons: [
        { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
    },
  },
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
