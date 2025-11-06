import { useAuth } from '~/composables/useAuth'; 

export default defineNuxtRouteMiddleware(async (to) => {
  // Skip auth check for auth routes
  if (to.path.startsWith('/auth')) {
    return;
  }

  const { user, checkAuth, isAuthChecking } = useAuth();

  // If user already loaded, allow immediately
  if (user.value) {
    return;
  }

  // Wait for any ongoing auth check to complete
  try {
    const isAuthed = await checkAuth();

    if (!isAuthed) {
      console.log('Middleware [auth]: User not authenticated. Redirecting to login.');
      
      // Only show error if not already on login page
      if (to.path !== '/auth/login') {
        useSwal().showError('Silakan masuk terlebih dahulu untuk mengakses halaman ini.');
      }
      
      return navigateTo(`/auth/login?next=${encodeURIComponent(to.fullPath)}`);
    }
  } catch (error) {
    console.error('Middleware [auth]: Error checking auth:', error);
    return navigateTo(`/auth/login?next=${encodeURIComponent(to.fullPath)}`);
  }
});