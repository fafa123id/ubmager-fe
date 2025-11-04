<!-- app.vue -->
<template>
  <div>
    <NuxtLayout />
    <Navbar />
    <NuxtPage />
  </div>
</template>

<script setup>
import Navbar from './layouts/navbar.vue';
const { fetchUser } = useAuth();
import { onMounted } from 'vue';
onMounted(() => {
  fetchUser() 
});
</script>
