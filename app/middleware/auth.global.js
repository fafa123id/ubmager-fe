// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const requiresAuth = to.meta.auth === true;
  const { user, checkAuth, fetchUser } = useAuth();

  try {
    await checkAuth();
  } catch (error) {}

  // Belum login
  if (requiresAuth && !user.value) {
    return navigateTo(`/auth/login?next=${encodeURIComponent(to.fullPath)}`);
  }
});
