import { useAuth } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware((to, from) => {
  // Prevent SSR hydration mismatch
  if (process.server) return;

  const { user, isLoggedIn } = useAuth();

  // Convert cookie string → boolean
  const loggedIn = isLoggedIn.value === "true" || isLoggedIn.value === true;

  const next = to.query.next | undefined;

  if (loggedIn && user.value) {
    console.log("Middleware [guest]: User detected in state. Redirecting to home.");
    return navigateTo(next || "/", { replace: true });
  }
});
