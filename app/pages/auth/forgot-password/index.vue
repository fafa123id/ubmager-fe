<!-- pages/login.vue -->
<script setup>
definePageMeta({
  auth: "guest",
});
import { ref, computed } from "vue";
const { forgotPassword } = useAuth();
const email = ref("");
const loading = ref(false);
const errorMsg = ref("");
const successMsg = ref("");
const canSubmit = computed(() => email.value.trim());

const submit = async () => {
  console.log(email.value);
  errorMsg.value = "";
  successMsg.value = "";
  if (!canSubmit.value || loading.value) return;

  loading.value = true;
  try {
    await forgotPassword({
      email: email.value,
    });
    successMsg.value =
      "Email reset kata sandi telah dikirim. Periksa inbox Anda.";
  } catch (e) {
    errorMsg.value = errorMsg.value =
      e.response.data.message || "Gagal mengirim email reset kata sandi.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <main class="relative overflow-hidden min-h-dvh text-slate-100">
    <!-- BG gelap elegan (konsisten) -->
    <div
      class="absolute inset-0 -z-20 bg-[radial-gradient(60%_60%_at_50%_10%,#0f172a_0%,#0b1220_50%,#0a0f1a_100%)]"
    ></div>
    <div
      class="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,.25))]"
    ></div>
    <div
      class="absolute inset-0 -z-10 opacity-15 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
    >
      <div
        class="h-full w-full bg-[length:42px_42px] bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]"
      ></div>
    </div>
    <div
      class="pointer-events-none absolute -top-20 -left-24 h-72 w-72 rounded-full bg-sky-500/15 blur-3xl"
    ></div>
    <div
      class="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl"
    ></div>

    <!-- Card Login -->
    <section
      class="mx-auto grid max-w-7xl place-items-center px-4 py-12 sm:px-6 lg:px-8"
    >
      <div
        class="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl"
      >
        <div class="mb-6 flex items-center gap-3">
          <span
            class="h-10 w-10 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 ring-1 ring-white/20"
          ></span>
          <div>
            <h1 class="text-lg font-bold leading-tight">UBMager</h1>
            <p class="text-xs text-slate-300">Belanja & jualan makin gampang</p>
          </div>
        </div>
        <h2 class="text-lg font-bold leading-tight mb-4">Lupa Kata Sandi</h2>
        <form @submit.prevent="submit" class="space-y-4">
          <!-- Email -->
          <div>
            <label for="email" class="mb-1 block text-xs text-slate-300"
              >Email</label
            >
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              required
              class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 outline-none ring-1 ring-transparent transition focus:ring-sky-400"
              placeholder="nama@kampus.ac.id"
            />
          </div>

          <!-- Error / Success -->
          <p
            v-if="errorMsg"
            class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200"
          >
            {{ errorMsg }}
          </p>
          <p
            v-if="successMsg"
            class="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200"
          >
            {{ successMsg }}
          </p>

          <!-- Submit -->
          <button
            :disabled="!canSubmit || loading"
            type="submit"
            class="cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/15 transition-colors hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg
              v-if="loading"
              class="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="3"
              ></circle>
              <path
                class="opacity-75"
                d="M12 2a10 10 0 0110 10h-3A7 7 0 0012 5V2z"
                fill="currentColor"
              ></path>
            </svg>
            Kirim Email Reset Kata Sandi
          </button>
        </form>

        <!-- Footer kecil -->
        <p class="mt-6 text-center text-xs text-slate-400">
          Belum punya akun?
          <NuxtLink
            to="/auth/register"
            class="font-semibold text-slate-200 underline-offset-4 hover:underline"
            >Daftar</NuxtLink
          >
        </p>
      </div>
    </section>
  </main>
</template>
