// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const requiresAuth = to.meta.auth === "guest";
  const { user, fetchUser} = useAuth();

  try {
    await fetchUser();
  } catch (error) {}

  // Sudah Login
  if (requiresAuth && user.value) {
    return navigateTo(`/`);
  }
});
