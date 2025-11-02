import { useAuth } from '~/composables/useAuth'; 

export default defineNuxtRouteMiddleware(async (to) => {
  const requiresAuth = to.meta.auth === true;

  if (!requiresAuth) {
    return;
  }

  if (to.path.startsWith('/auth')) {
    return;
  }

  const { user, checkAuth } = useAuth();

  if (user.value) {
    return;
  }

  const isAuthed = await checkAuth();

  if (!isAuthed) {
    console.log('Middleware [auth]: Not authenticated. Redirecting to login.');
    return navigateTo(`/auth/login?next=${encodeURIComponent(to.fullPath)}`);
  }
});