// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const requiresAuth = to.meta.auth === "guest";
  const { checkAuth } = useAuth();

  // Belum login
  if (requiresAuth && checkAuth()) {
    return navigateTo(`/`);
  }
});
