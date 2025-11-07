// plugins/auth-loader.js
export default defineNuxtPlugin(async (nuxtApp) => {
  const { fetchUser } = useAuth();

  try {
    await fetchUser();
  } catch (error) {
    console.error("Auth Plugin: Gagal fetchUser saat init:", error);
  }
});
