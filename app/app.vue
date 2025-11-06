<!-- app.vue -->
<template>
  <div>
    <NuxtLayout />
    <Navbar />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import Navbar from './layouts/navbar.vue'
import { onMounted } from 'vue'

const { user, authReady, ensureAuth } = useAuth()

// Optional: bootstrap santai di client, tapi tidak perlu kalau middleware sdh cover
onMounted(() => {
  if (!user.value && !authReady.value) {
    ensureAuth().catch(() => {})
  }
})
</script>
