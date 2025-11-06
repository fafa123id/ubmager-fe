import { useAuth } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, checkAuth, authCheckPromise } = useAuth();

  // If user already in state, redirect immediately
  if (user.value) {
    console.log(
      "Middleware [guest]: User detected in state. Redirecting to home."
    );
    return navigateTo("/");
  }

  // If there's an auth check in progress, wait for it instead of starting a new one
  if (authCheckPromise.value) {
    console.log("Middleware [guest]: Auth check in progress, waiting...");
    try {
      const isAuthed = await authCheckPromise.value;
      if (isAuthed) {
        console.log("Middleware [guest]: User validated. Redirecting to home.");
        return navigateTo("/");
      }
    } catch (error) {
      console.error("Middleware [guest]: Error in ongoing auth check:", error);
    }
    return; // Allow guest access
  }

  try {
    const isAuthed = await checkAuth();
    if (isAuthed) {
      console.log(
        "Middleware [guest]: User validated via token. Redirecting to home."
      );
      return navigateTo("/");
    }
  } catch (error) {
    console.error("Middleware [guest]: Error checking auth:", error);
  }
});
