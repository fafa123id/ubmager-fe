import { useAuth } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, checkAuth } = useAuth();

  // If user already in state, redirect immediately
  if (user.value) {
    console.log(
      "Middleware [guest]: User detected in state. Redirecting to home."
    );
    navigateTo(from?.fullPath || "/", { replace: true });
  }

  try {
    const isAuthed = await checkAuth();

    if (isAuthed) {
      console.log(
        "Middleware [guest]: User validated via token. Redirecting to home."
      );
      return navigateTo(from?.fullPath || "/", { replace: true });
    }
  } catch (error) {
    console.error("Middleware [guest]: Error checking auth:", error);
    // Allow access to guest pages on error
  }
});
