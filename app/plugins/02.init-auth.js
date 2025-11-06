// plugins/auth-loader.js
export default defineNuxtPlugin(async (nuxtApp) => {
  const { user, checkAuth } = useAuth();
  
  // ✅ Set flag loading TRUE di awal
  const authInitialized = useState('auth_initialized', () => false);

  if (process.server || !user.value) {
    console.log("Auth Plugin: Menjalankan checkAuth saat inisialisasi...");
    
    try {
      await checkAuth();
    } catch (error) {
      console.error("Auth Plugin: Gagal checkAuth saat init:", error);
    }
  }

  // ✅ Set initialized TRUE setelah selesai
  authInitialized.value = true;
  console.log("Auth Plugin: Selesai. Auth initialized.");
});