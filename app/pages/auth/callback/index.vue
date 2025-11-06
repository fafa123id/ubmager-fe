<template>
  <div class="loading-screen">
    <p>Mengarahkan Anda...</p>
  </div>
</template>
<script>
import { onMounted } from "vue";

definePageMeta({ auth: "guest" });
onMounted(async () => {
  const route = useRoute();
  const query = route.query;
  const { loginWithToken } = useAuth();
  if (query.token) {
    await loginWithToken(query.token);
  }
  let destination = "/";
  if (query.next) {
    destination = query.next;
  }
  setTimeout(() => {
    navigateTo(destination);
  }, 500);
});
</script>
