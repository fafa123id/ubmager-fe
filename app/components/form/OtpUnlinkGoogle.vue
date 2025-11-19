<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["close"]);

const loading = ref(false);
const otp = ref("");

const canSave = computed(() => {
  return !!otp.value;
});
const saveOtp = async () => {
  try {
    if (!canSave.value) {
      return;
    }
    loading.value = true;
    await useAuth().unlinkGoogle({
      otp: otp.value,
    });
    emit("close");
    otp.value = "";
  } catch (e) {
    useSwal().showError(
      e.response?.data?.message || "Gagal melepaskan akun Google."
    );
  } finally {
    useSwal().close();
    loading.value = false;
  }
};
const closeAndReset = async () => {
  const result = await useSwal().confirmAction(
    "Apakah Anda yakin ingin membatalkan pelepasan akun Google?"
  );
  if (!result.isConfirmed) return;

  emit("close");
  otp.value = "";
};
</script>
<template>
  <MyModal id="unlink-google-modal" :show="props.show" @close="closeAndReset">
    <div class="p-6">
      <form @submit.prevent="saveOtp">
        <h2 class="text-lg font-medium text-white">
          Masukkan OTP yang dikirimkan ke email kamu
        </h2>

        <div class="mt-6">
          <label class="mb-1 block text-xs text-slate-300">OTP</label>
          <input
            v-model="otp"
            type="text"
            class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 outline-none ring-1 ring-transparent focus:ring-sky-400 disabled:opacity-60"
            :disabled="loading"
            placeholder="OTP"
            autocomplete="one-time-code"
          />
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
            Verifikasi
          </button>
        </div>
      </form>
    </div>
  </MyModal>
</template>
