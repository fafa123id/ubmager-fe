<!-- pages/login.vue -->
<script setup>
definePageMeta({ auth: true, redirectIfAuth: "/" });
import { ref, computed } from "vue";
const { login } = useAuth();
const email = ref("");
const password = ref("");
const remember = ref(false);
const showPass = ref(false);
const loading = ref(false);
const errorMsg = ref("");
const successMsg = ref("");
const canSubmit = computed(
  () => email.value.trim() && password.value.length >= 6
);

const toggleShow = () => (showPass.value = !showPass.value);

const submit = async () => {
  errorMsg.value = "";
  successMsg.value = "";
  if (!canSubmit.value || loading.value) return;

  loading.value = true;
  try {
    // ganti endpoint sesuai backend kamu
    // contoh: /api/auth/login (cookie-based) atau token-based
    console.log("Submitting login for", email.value);
    console.log("Password:", password.value);
    console.log(email);
    console.log(password);
    await login({
      email: email.value,
      password: password.value,
    });

    successMsg.value = "Berhasil masuk. Mengarahkan...";
    // arahkan ke dashboard / home
    setTimeout(() => {
      navigateTo("/");
    }, 600);
  } catch (e) {
    // tampilkan pesan ringkas
    errorMsg.value = e?.data?.message || "Email atau kata sandi salah.";
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
            <h1 class="text-lg font-bold leading-tight">Masuk ke UBMager</h1>
            <p class="text-xs text-slate-300">Belanja & jualan makin gampang</p>
          </div>
        </div>

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

          <!-- Password -->
          <div>
            <label for="password" class="mb-1 block text-xs text-slate-300"
              >Kata Sandi</label
            >
            <div class="relative">
              <input
                :type="showPass ? 'text' : 'password'"
                id="password"
                v-model="password"
                autocomplete="current-password"
                minlength="6"
                required
                class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 pr-10 text-sm text-slate-100 placeholder:text-slate-400 outline-none ring-1 ring-transparent transition focus:ring-indigo-400"
                placeholder="Minimal 6 karakter"
              />
              <button
                type="button"
                @click="toggleShow"
                class="cursor-pointer absolute inset-y-0 right-0 grid w-10 place-items-center text-slate-300 hover:text-white"
                aria-label="Tampilkan/sem­bunyikan sandi"
              >
                <svg
                  v-if="!showPass"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-width="1.5"
                    d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    stroke="currentColor"
                    stroke-width="1.5"
                    d="M3 3l18 18M10.6 10.6a3 3 0 104.2 4.2M6.1 6.1C3.8 7.7 2 12 2 12s3.5 7 10 7c2 0 3.7-.5 5.1-1.2M17.8 6.6C16.1 5.6 14.2 5 12 5"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Remember + Forgot -->
          <div class="flex items-center justify-between pt-1">
            <label
              class="inline-flex select-none items-center gap-2 text-xs text-slate-300"
            >
              <input
                type="checkbox"
                v-model="remember"
                class="h-4 w-4 cursor-pointer rounded border-white/20 bg-white/10 text-sky-500 focus:ring-0"
              />
              Ingat saya
            </label>

            <NuxtLink
              to="/forgot-password"
              class="text-xs text-slate-300 underline-offset-4 hover:underline"
            >
              Lupa sandi?
            </NuxtLink>
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
            Masuk
          </button>
        </form>

        <!-- Divider -->
        <div class="my-6 flex items-center gap-3">
          <div class="h-px flex-1 bg-white/10"></div>
          <span class="text-[11px] text-slate-400">atau</span>
          <div class="h-px flex-1 bg-white/10"></div>
        </div>

        <!-- OAuth placeholder -->
        <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            class="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            type="button"
          >
            <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor">
              <path
                d="M21.35 11.1h-9.18v2.96h5.31a4.54 4.54 0 0 1-1.97 2.99l3.19 2.48c1.86-1.72 2.93-4.26 2.93-7.34 0-.49-.04-.96-.12-1.43Z"
              />
            </svg>
            Google
          </button>
          <button
            class="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            type="button"
          >
            <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor">
              <path
                d="M13 3c-4.97 0-9 4.03-9 9 0 3.99 2.61 7.36 6.22 8.54.46.08.63-.2.63-.45v-1.58c-2.53.55-3.06-1.07-3.06-1.07-.42-1.07-1.03-1.36-1.03-1.36-.84-.57.06-.56.06-.56.93.07 1.42.95 1.42.95.83 1.42 2.18 1.01 2.71.77.08-.6.33-1.01.6-1.24-2-.23-4.1-1-4.1-4.49 0-.99.36-1.79.95-2.42-.1-.23-.41-1.17.09-2.45 0 0 .77-.25 2.52.93.73-.2 1.51-.3 2.29-.3.78 0 1.56.1 2.29.3 1.75-1.18 2.52-.93 2.52-.93.5 1.28.19 2.22.09 2.45.59.63.95 1.43.95 2.42 0 3.5-2.11 4.25-4.12 4.48.34.29.64.86.64 1.73v2.56c0 .25.17.54.64.45A9.01 9.01 0 0 0 22 12c0-4.97-4.03-9-9-9Z"
              />
            </svg>
            GitHub
          </button>
        </div>

        <!-- Footer kecil -->
        <p class="mt-6 text-center text-xs text-slate-400">
          Belum punya akun?
          <NuxtLink
            to="/register"
            class="font-semibold text-slate-200 underline-offset-4 hover:underline"
            >Daftar</NuxtLink
          >
        </p>
      </div>
    </section>
  </main>
</template>
