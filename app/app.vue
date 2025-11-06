<template>
  <div>
    <NuxtLayout />
    <Navbar />
    <NuxtPage />
  </div>
</template>

<script setup>
import Navbar from './layouts/navbar.vue';

const { user, lastAuthCheckFailed } = useAuth();

// Only check auth on client side, if user not loaded, and last check didn't fail
if (process.client && !user.value && !lastAuthCheckFailed.value) {
  const { checkAuth } = useAuth();
  
  // Non-blocking auth check
  checkAuth().catch((error) => {
    console.log('Background auth check failed:', error);
  });
}
</script>