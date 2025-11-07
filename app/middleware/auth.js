export default defineNuxtRouteMiddleware(async (to) => {
  const { user, checkAuth } = useAuth();

  // If user already loaded, allow immediately
  if (user.value) {
    return;
  }

  return navigateTo(`/auth/login?next=${encodeURIComponent(to.fullPath)}`, {
    replace: true,
  });
});
