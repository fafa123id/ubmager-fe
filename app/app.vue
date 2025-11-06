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
const { user, fetchUser } = useAuth();

if (!user.value) {
  fetchUser().catch(() => {
    console.log('Background auth check failed (user not logged in).');
  });
}
</script>
