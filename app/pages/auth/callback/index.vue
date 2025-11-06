<template>
  <div class="loading-screen">
    <p>Mengarahkan Anda...</p>
  </div>
</template>
<script setup>
import { onMounted } from "vue";

definePageMeta({ auth: "guest" });
onMounted(async () => {
  const route = useRoute();
  const { loginWithToken } = useAuth();

  const hash = route.hash.substring(1);

  const params = new URLSearchParams(hash);
  const token = params.get('token');

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
