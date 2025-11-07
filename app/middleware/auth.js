export default defineNuxtRouteMiddleware(async (to) => {
  const { user, checkAuth } = useAuth();
  const { loadingState } = useLoading();
  while (loadingState.value) {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  // If user already loaded, allow immediately
  if (user.value) {
    return;
  }

  return navigateTo(`/auth/login?next=${encodeURIComponent(to.fullPath)}`, {
    replace: true,
  });
});
