import { useAuth } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, checkAuth } = useAuth();
  const route = useRoute();
  const next = route.query.next || "/";
  const requiresAuth = to.meta.auth === "guest";
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) {
    return;
  }
  if (user.value && requiresAuth) {
    console.log(
      "Middleware [guest]: User detected in state. Redirecting to home."
    );
    return navigateTo(next);
  }
});
