<template>
  <div>
    <NuxtLayout />
    <Navbar />
    <NuxtPage />
  </div>
</template>

<script setup>
import Navbar from './layouts/navbar.vue';

const { user, checkAuth } = useAuth();

if (process.client && !user.value) {
  checkAuth().catch((error) => {
    console.log('Background auth check failed:', error);
  });
}
</script>