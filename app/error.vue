<script setup lang="ts">
const props = defineProps<{ error: { statusCode?: number; statusMessage?: string } }>()
const is404 = props.error?.statusCode === 404
const message = is404 ? 'Halaman tidak ditemukan' : (props.error?.statusMessage || 'Terjadi kesalahan')
const handleBack = () => window.history.back();

useHead({
  title: is404 ? '404 • UBMager' : `${props.error?.statusCode ?? 'Error'} • UBMager`,
  meta: [{ name: 'robots', content: 'noindex' }],
})
</script>

<template>
  <main class="relative min-h-dvh overflow-hidden text-slate-100">
    <!-- Background: dark slate gradient + vignette -->
    <div class="absolute inset-0 -z-20 bg-[radial-gradient(60%_60%_at_50%_10%,#0f172a_0%,#0b1220_50%,#0a0f1a_100%)]"></div>
    <div class="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,.25))]"></div>

    <!-- Subtle grid -->
    <div class="absolute inset-0 -z-10 opacity-15 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]">
      <div class="h-full w-full bg-[length:42px_42px] bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]"></div>
    </div>

    <!-- Ambient blobs (diredam) -->
    <div class="pointer-events-none absolute -top-20 -left-24 h-72 w-72 rounded-full bg-sky-500/15 blur-3xl motion-safe:animate-float-slow"></div>
    <div class="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl motion-safe:animate-float-slower"></div>

    <!-- Content -->
    <section class="relative z-10 mx-auto grid min-h-dvh max-w-3xl place-items-center p-6">
      <div
        class="w-full rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl backdrop-blur-xl"
      >
        <!-- Brand -->
        <div class="mb-4 flex items-center gap-3">
          <div class="h-8 w-8 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 shadow ring-1 ring-white/20"></div>
          <span class="select-none text-sm font-medium tracking-wide text-slate-200">UBMager</span>
        </div>

        <!-- Code + label -->
        <div class="mb-3 flex items-baseline gap-3">
          <h1 class="motion-safe:animate-rise text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-300">
            {{ is404 ? '404' : (props.error?.statusCode || 'Error') }}
          </h1>
          <span class="rounded-full bg-white/5 px-2 py-1 text-xs font-medium text-slate-300 ring-1 ring-white/10">
            {{ is404 ? 'Not Found' : 'Unexpected' }}
          </span>
        </div>

        <p class="mb-8 text-balance text-slate-300">
          {{ message }}
        </p>

        <!-- Actions -->
        <div class="flex flex-wrap gap-3">
          <button
            class="group inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white
                   ring-1 ring-white/15 transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            @click="handleBack"
            aria-label="Kembali ke beranda"
          >
            <svg viewBox="0 0 24 24" class="h-4 w-4 transition group-hover:-translate-x-0.5" fill="currentColor">
              <path d="M10.828 11H20a1 1 0 1 1 0 2h-9.172l3.536 3.536a1 1 0 1 1-1.414 1.414l-5.243-5.243a1 1 0 0 1 0-1.414l5.243-5.243a1 1 0 1 1 1.414 1.414L10.828 11Z"/>
            </svg>
            Kembali
          </button>

          <NuxtLink
            to="/"
            class="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor">
              <path d="M12 3.172 3.172 12H5v7a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1v-7h1.828L12 3.172Z"/>
            </svg>
            Halaman Utama
          </NuxtLink>
        </div>

        <div class="mt-8 flex items-center justify-between text-xs text-slate-400">
          <span>© {{ new Date().getFullYear() }} UBMager</span>
          <span class="motion-safe:animate-pulse-soft inline-flex items-center gap-1">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-400/80"></span>
            Online
          </span>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
@keyframes float-slow { 0%,100%{transform:translate3d(0,0,0)} 50%{transform:translate3d(0,-8px,0)} }
@keyframes float-slower { 0%,100%{transform:translate3d(0,0,0)} 50%{transform:translate3d(0,8px,0)} }
@keyframes rise { 0%{ transform:translateY(8px); opacity:0 } 100%{ transform:translateY(0); opacity:1 } }
@keyframes pulse-soft { 0%,100%{opacity:.55;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }

.motion-safe\:animate-float-slow { animation: float-slow 16s ease-in-out infinite; }
.motion-safe\:animate-float-slower { animation: float-slower 22s ease-in-out infinite; }
.motion-safe\:animate-rise { animation: rise .6s ease-out both; }
.motion-safe\:animate-pulse-soft { animation: pulse-soft 2.8s ease-in-out infinite; }
</style>
