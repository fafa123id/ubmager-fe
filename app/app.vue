<template>
  <div>
    <NuxtLayout />
  </div>
</template>

<script setup>
const { fetchUser } = useAuth();
import { onMounted } from 'vue';
onMounted(async () => {
  await fetchUser();
});
</script>
