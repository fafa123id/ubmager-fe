// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const requiresAuth = to.meta.auth === true;
  const next = to.meta.redirectIfAuth || null;
  const { user, checkAuth } = useAuth();

  try {
    await checkAuth();
  } catch (error) {}

  // Belum login
  if (requiresAuth && !user.value) {
    return navigateTo(`/auth/login?next=${encodeURIComponent(to.fullPath)}`);
  }
  if (next && user.value) {
    return navigateTo(next);
  }
});
