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
    useSwal().showError('Silakan masuk terlebih dahulu untuk mengakses halaman ini.');
    return navigateTo(`/auth/login?next=${encodeURIComponent(to.fullPath)}`);
  }
});