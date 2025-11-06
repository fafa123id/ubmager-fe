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

  try {
    const isAuthed = await checkAuth();

    if (isAuthed) {
      console.log(
        "Middleware [guest]: User validated via token. Redirecting to home."
      );
      return navigateTo(next);
    }
  } catch (error) {
    console.error("Middleware [guest]: Error checking auth:", error);
    // Allow access to guest pages on error
  }
});
