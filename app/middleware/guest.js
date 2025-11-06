import { useAuth } from '~/composables/useAuth'; 

export default defineNuxtRouteMiddleware(async (to) => {
  const { user, checkAuth } = useAuth();
  await checkAuth();
  // If user already in state, redirect immediately
  if (user.value) {
    console.log('Middleware [guest]: User detected in state. Redirecting to home.');
    return navigateTo('/'); 
  }

});