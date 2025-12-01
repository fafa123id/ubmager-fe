<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup>
import { onMounted } from "vue";

const router = useRouter();
const route = useRoute();

onMounted(() => {
  const { error, success, need_refresh, info } = route.query;

  if (error) {
    useSwal().showError(error);
  }

  if (success) {
    useSwal().showSuccess(success);
  }

  if (need_refresh) {
    useAuth().fetchUser();
  }
  if (info) {
    useSwal().showInfo("Attention", info);
  }

  if (error || success || need_refresh || info) {
    router.replace({ query: {} });
  }
});
</script>
