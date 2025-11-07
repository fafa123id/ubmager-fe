<template>
  <div class="loading-screen">
    <p>Mengarahkan Anda...</p>
  </div>
</template>
<script setup>
import { onMounted } from "vue";

definePageMeta({ middleware: ['guest'] });
onMounted(async () => {
  const route = useRoute();

  const { loginWithToken } = useAuth();

  const token = useCookie("auth_token");

  if (token) {

    await loginWithToken(token); 
  }

  let destination = "/";

  if (route.query.next) {
    destination = route.query.next;
  }

  setTimeout(() => {
    navigateTo(destination);
  }, 500);
});
</script>
