export default defineNuxtRouteMiddleware(async (to) => {
  // Skip auth check for auth routes
  if (to.path.startsWith("/auth")) {
    return;
  }

  const { user, checkAuth } = useAuth();
  const nuxtApp = useNuxtApp();

  if (process.client && nuxtApp.isHydrating) {
    await nuxtApp.hooks.callHook("app:mounted");
  }
  try {
    const isAuthed = await checkAuth();
    console.log(`Middleware [auth]: Auth check result: ${isAuthed}`);

    if (isAuthed) {
      // ✅ Explicit return untuk kasus sukses
      console.log(
        "Middleware [auth]: User authenticated. Allowing navigation."
      );
      return; // atau return true;
    }

    // Jika sampai sini, berarti NOT authenticated
    console.log(
      "Middleware [auth]: User not authenticated. Redirecting to login."
    );

    if (!to.path.startsWith("/auth")) {
      nextTick(() => {
        useSwal().showError(
          "Silakan masuk terlebih dahulu untuk mengakses halaman ini."
        );
      });
    }

    return navigateTo(`/auth/login?next=${encodeURIComponent(to.fullPath)}`, {
      replace: true,
    });
  } catch (error) {
    console.error("Middleware [auth]: Error checking auth:", error);
    return navigateTo(`/auth/login?next=${encodeURIComponent(to.fullPath)}`, {
      replace: true,
    });
  }
});
