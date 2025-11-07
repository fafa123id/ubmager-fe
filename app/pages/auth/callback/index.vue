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

  const { fetchUser } = useAuth();

  await fetchUser();

  let destination = "/";

  if (route.query.next) {
    destination = route.query.next;
  }

  setTimeout(() => {
    navigateTo(destination);
  }, 500);
});
</script>
