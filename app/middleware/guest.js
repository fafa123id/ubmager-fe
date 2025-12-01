export default defineNuxtRouteMiddleware((to, from) => {

  const { user, isLoggedIn } = useAuth();
  const next = to.query.next || "/";
  // Convert cookie string → boolean
  const loggedIn = isLoggedIn.value === "true" || isLoggedIn.value === true;

  if (loggedIn || user.value) {
    const resetCookie = useCookie("reset_password_token");
    resetCookie.value = null;
    console.log("Middleware [guest]: User detected in state. Redirecting to home.");
    return navigateTo( next, { replace: true });
  }
});
  