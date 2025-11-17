<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup>
import { onMounted } from "vue";

onMounted(() => {
  const error = useRoute().query.error;
  if (error) {
    useSwal().showError(decodeURIComponent(error));
  }
  const success = useRoute().query.success;
  if (success) {
    useSwal().showSuccess(decodeURIComponent(success));
  }
});
</script>
