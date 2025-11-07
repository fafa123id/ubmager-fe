<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup>
const loadingState = useLoading();
if (loadingState.value == true) {
  useSwal().showLoading("Loading...");
}
</script>
