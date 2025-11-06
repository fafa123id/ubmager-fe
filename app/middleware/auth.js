import { useAuth } from '~/composables/useAuth'; 

export default defineNuxtRouteMiddleware(async (to) => {

  if (to.path.startsWith('/auth')) {
    return;
  }

  const { user, checkAuth } = useAuth();

  if (user.value) {
    return;
  }

  if (!user.value) {
    useSwal().showError('Silakan masuk terlebih dahulu untuk mengakses halaman ini.');
    return navigateTo(`/auth/login?next=${encodeURIComponent(to.fullPath)}`);
  }
});