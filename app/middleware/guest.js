import { useAuth } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, checkAuth } = useAuth();
  const route = useRoute();
  const next = route.query.next || "/";

  const { isLoggedIn } = useAuth();
  if (!isLoggedIn === true) {
    return;
  }
  if (user.value) {
    console.log(
      "Middleware [guest]: User detected in state. Redirecting to home."
    );
    return navigateTo(next, { replace: true });
  }
});
