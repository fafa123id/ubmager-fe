import { useAuth } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, checkAuth } = useAuth();
  const route = useRoute();
  const next = route.query.next || "/";
  // If user already in state, redirect immediately
  if (user.value) {
    console.log(
      "Middleware [guest]: User detected in state. Redirecting to home."
    );
    return navigateTo(next);
  }
});
