// plugins/auth-loader.js

import { useAuth } from "~/composables/useAuth";

export default defineNuxtPlugin(async (nuxtApp) => {
  const { user, checkAuth } = useAuth();

  if (process.server || !user.value) {
    console.log("Auth Plugin: Menjalankan checkAuth saat inisialisasi...");
    
    try {
      await checkAuth();
    } catch (error) {
      console.error("Auth Plugin: Gagal checkAuth saat init:", error);
    }
  }

  console.log("Auth Plugin: Selesai.");
});