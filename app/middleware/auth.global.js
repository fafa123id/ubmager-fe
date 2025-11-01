// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const requiresAuth = to.meta.auth === true;
  if (!requiresAuth) return;

  const { checkAuth } = useAuth();
  const isAuthed = await checkAuth(); // ✅ WAJIB await

  if (!isAuthed) {
    return navigateTo(`/auth/login?next=${encodeURIComponent(to.fullPath)}`);
  }
});
