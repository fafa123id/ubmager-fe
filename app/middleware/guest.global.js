// middleware/guest.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const requiresGuest = to.meta.auth === "guest";
  if (!requiresGuest) return;

  const { checkAuth } = useAuth();
  const isAuthed = await checkAuth(); // ✅ WAJIB await

  if (isAuthed) {
    return navigateTo(`/`);
  }
});
