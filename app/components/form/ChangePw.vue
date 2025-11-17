<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});
const errorMsg = ref({});
const clearError = (fieldName) => {
  if (errorMsg.value[fieldName]) {
    errorMsg.value[fieldName] = null; // Menjadikannya 'falsy'
  }
};
const loading = ref(false);
const oldPasswordInput = ref("");
const passwordInput = ref("");
const passwordConfirmationInput = ref("");
const saveChangePassword = async () => {
  try {
    loading.value = true;
    await $api.post(
      "/api/new-password",
      {
        old_password: oldPasswordInput.value,
        password: passwordInput.value,
        password_confirmation: passwordConfirmationInput.value,
      },
      { withCredentials: true }
    );
    useSwal().showSuccess("Password berhasil diubah.");
    closeAndReset();
  } catch (error) {
    if (e?.response?.status === 422 && e?.response?.data?.errors) {
      errorMsg.value = e.response.data.errors;
    } else {
      useSwal().showError(
        e?.response?.data?.message ||
          "Terjadi kesalahan saat mengubah password."
      );
    }
  } finally {
    loading.value = false;
  }
};
const closeAndReset = () => {
  emit("close");
  oldPasswordInput.value = "";
  passwordInput.value = "";
  passwordConfirmationInput.value = "";
};
</script>
<template>
  <MyModal id="change-password-modal" :show="props.show" @close="closeAndReset">
    <div class="p-6">
      <form @submit.prevent="saveChangePassword">
        <h2 class="text-lg font-medium text-white">Masukkan Password Baru</h2>

        <div class="mt-6">
          <label class="mb-1 block text-xs text-slate-300">Password Lama</label>
          <input
            v-model="oldPasswordInput"
            type="password"
            class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 outline-none ring-1 ring-transparent focus:ring-sky-400 disabled:opacity-60"
            :disabled="loading"
            placeholder="Password Lama"
            @focus="clearError('old_password')"
            autocomplete="current-old-password"
          />
          <p
            v-if="errorMsg?.old_password"
            class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200 mt-2"
          >
            {{ errorMsg.old_password[0] }}
          </p>
          <label class="mb-1 block text-xs text-slate-300">Password</label>
          <input
            v-model="passwordInput"
            type="password"
            class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 outline-none ring-1 ring-transparent focus:ring-sky-400 disabled:opacity-60"
            :disabled="loading"
            placeholder="Password"
            @focus="clearError('password')"
            autocomplete="current-password"
          />
          <p
            v-if="errorMsg?.password"
            class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200 mt-2"
          >
            {{ errorMsg.password[0] }}
          </p>
          <label class="mb-1 block text-xs text-slate-300"
            >Password Confirmation</label
          >
          <input
            v-model="passwordConfirmationInput"
            type="password"
            class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 outline-none ring-1 ring-transparent focus:ring-sky-400 disabled:opacity-60"
            :disabled="loading"
            placeholder="Password Confirmation"
            @focus="clearError('password_confirmation')"
            autocomplete="current-password_confirmation"
          />
          <p
            v-if="errorMsg?.password_confirmation"
            class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200 mt-2"
          >
            {{ errorMsg.password_confirmation[0] }}
          </p>
        </div>
        <div class="mt-6 flex justify-end">
          <SecondaryButton @click="closeAndReset"> Cancel </SecondaryButton>
          <PrimaryButton
            class="ms-3"
            :class="{ 'opacity-25': loading }"
            :disabled="loading"
          >
            Save Password
          </PrimaryButton>
        </div>
      </form>
    </div>
  </MyModal>
</template>
