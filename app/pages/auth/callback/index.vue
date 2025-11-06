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
  await useAuth().checkAuth();
  let destination = "/";

  if (route.query.next) {
    destination = route.query.next;
  }

  setTimeout(() => {
    navigateTo(destination);
  }, 500);
});
</script>
