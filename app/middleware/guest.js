import { useAuth } from '~/composables/useAuth'; 

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, checkAuth, lastAuthCheckFailed } = useAuth();

  // If user already in state, redirect immediately
  if (user.value) {
    console.log('Middleware [guest]: User detected in state. Redirecting to home.');
    return navigateTo('/'); 
  }

  // If coming from a protected route (auth redirect), don't check again
  // The auth middleware already tried and failed
  if (from && from.path && !from.path.startsWith('/auth') && lastAuthCheckFailed.value) {
    console.log('Middleware [guest]: Redirected from protected route, skipping auth check.');
    return; // Allow access to guest page
  }

  // Check auth status only if we have a refresh token
  if (useCookie("refresh_token").value) {
    try {
      const isAuthed = await checkAuth();

      if (isAuthed) {
        console.log('Middleware [guest]: User validated via token. Redirecting to home.');
        return navigateTo('/'); 
      }
    } catch (error) {
      console.error('Middleware [guest]: Error checking auth:', error);
      // Allow access to guest pages on error
    }
  }
});