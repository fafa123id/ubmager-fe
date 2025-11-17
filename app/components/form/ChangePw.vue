<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["close"]);
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
const canSave = computed(() => {
  return (
    !!oldPasswordInput.value &&
    !!passwordInput.value &&
    !!passwordConfirmationInput.value
  );
});
const saveChangePassword = async () => {
  try {
    if (!canSave.value) {
      return;
    }
    loading.value = true;
    await useNuxtApp().$api.post(
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
  } catch (e) {
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
  errorMsg.value = {};
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
        <div class="mt-6 flex justify-end gap-3 rounded-xl">
          <SecondaryButton @click="closeAndReset"> Cancel </SecondaryButton>
          <button
            type="submit"
            :disabled="!canSave || loading"
            class="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/15 transition-colors hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg
              v-if="loading"
              class="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="3"
                class="opacity-25"
              ></circle>
              <path
                d="M12 2a10 10 0 0110 10h-3A7 7 0 0012 5V2z"
                fill="currentColor"
                class="opacity-75"
              ></path>
            </svg>
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  </MyModal>
</template>
