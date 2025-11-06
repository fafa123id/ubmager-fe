<template>
  <div>
    <NuxtLayout />
    <NuxtPage />
  </div>
</template>

<script setup>
import Navbar from './layouts/navbar.vue';

const { user, checkAuth } = useAuth();

// Only check auth on client side and if user not already loaded
if (process.client && !user.value) {
  // Non-blocking auth check
  checkAuth().catch((error) => {
    console.log('Background auth check failed:', error);
  });
}
</script>