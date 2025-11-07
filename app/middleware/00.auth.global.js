export default defineNuxtRouteMiddleware(async (to) => {
  const { user, checkAuth } = useAuth();
  const requiresAuth = to.meta.auth === true
  // If user already loaded, allow immediately
  const { isLoggedIn } = useAuth();
  if (isLoggedIn.value === true) {
    return;
  }
  if (requiresAuth && !user.value) {
    return navigateTo(`/auth/login?next=${encodeURIComponent(to.fullPath)}`, {
      replace: true,
    });
  }   
});
