<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
const { user, checkAuth } = useAuth();
if (!user.value) {
  checkAuth().catch(() => {
    console.log('Background auth check failed (user not logged in).');
  });
}
</script>
