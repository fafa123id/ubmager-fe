export default defineNuxtRouteMiddleware(async (to) => {
  const { user, checkAuth } = useAuth();

  const { isLoggedIn } = useAuth();
  if (isLoggedIn.value === true) {
    return;
  }
  if (!user.value) {
    return navigateTo(`/auth/login?next=${encodeURIComponent(to.fullPath)}`, {
      replace: true,
    });
  }   
});
