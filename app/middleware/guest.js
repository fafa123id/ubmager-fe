import { useAuth } from '~/composables/useAuth'; 

export default defineNuxtRouteMiddleware(async (to) => {
  
  const { user, checkAuth } = useAuth();

  if (user.value) {
    console.log('Middleware [guest]: User detected in state. Redirecting to home.');
    return navigateTo('/'); 
  }

  const isAuthed = await checkAuth();

  if (isAuthed) {
    console.log('Middleware [guest]: User validated via token. Redirecting to home.');
    return navigateTo('/'); 
  }
});