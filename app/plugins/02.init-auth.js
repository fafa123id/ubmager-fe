// plugin/02.init-auth.js
import { useAuth } from '~/composables/useAuth';

export default defineNuxtPlugin(async (nuxtApp) => {
  const { token, fetchUser, user } = useAuth();


  if (user.value) {
    return;
  }


  if (!token.value) {

    return;
  }

  if (process.server) {
    await fetchUser();
  } else {

    fetchUser();
  }
});