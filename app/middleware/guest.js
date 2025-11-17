export default defineNuxtRouteMiddleware((to, from) => {


  const { user, isLoggedIn } = useAuth();

  // Convert cookie string → boolean
  const loggedIn = isLoggedIn.value === "true" || isLoggedIn.value === true;

  if (loggedIn && user.value) {
    console.log("Middleware [guest]: User detected in state. Redirecting to home.");
    return navigateTo( "/", { replace: true });
  }
});
  