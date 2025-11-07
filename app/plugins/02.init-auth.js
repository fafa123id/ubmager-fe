// plugins/auth-loader.js
export default defineNuxtPlugin(async (nuxtApp) => {
  const { fetchUser } = useAuth();
  const { setLoading } = useLoading();

  
  try {
    setLoading(true);
    await fetchUser();
  } catch (error) {
    console.error("Auth Plugin: Gagal fetchUser saat init:", error);
  } finally {
    setLoading(false);
  }
});
