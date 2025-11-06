

export default defineNuxtRouteMiddleware(async (to) => {
  const { user, checkAuth, } = useAuth();

  // If user already loaded, allow immediately
  if (user.value) {
    return;
  }

  // Wait for any ongoing auth check to complete
  try {
    const isAuthed = await checkAuth();
    console.log(`Middleware [auth]: Auth check result: ${isAuthed}`);
    if (!isAuthed) {
      console.log("Middleware [auth]: User not authenticated. Redirecting to login.");

      // Don't show error if already on an auth page
      if (!to.path.startsWith("/auth")) {
        // Use nextTick to ensure navigation happens before showing error
        nextTick(() => {
          useSwal().showError("Silakan masuk terlebih dahulu untuk mengakses halaman ini.");
        });
      }

      return navigateTo(`/auth/login?next=${encodeURIComponent(to.fullPath)}`, { replace: true });
    }
  } catch (error) {
    console.error('Middleware [auth]: Error checking auth:', error);
    return navigateTo(`/auth/login?next=${encodeURIComponent(to.fullPath)}`, { replace: true });
  }
});