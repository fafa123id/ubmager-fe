<script setup>
import { useAuth } from '~/composables/useAuth';

const isOpen = ref(false);
const links = [
  { to: "/", label: "Beranda" },
  { to: "/produk", label: "Produk" },
  { to: "/tentang", label: "Tentang" },
  { to: "/kontak", label: "Kontak" },
];
const route = useRoute();
const { checkAuth, logout } = useAuth();
const isActive = (to) => route.path === to;
</script>

<template>
  <header class="sticky top-0 z-50">
    <div
      class="mx-auto px-4 py-3 sm:px-6 lg:px-8 border border-white/10 bg-slate-900/70 backdrop-blur-xl shadow-lg shadow-black/30"
    >
      <nav class="flex items-center justify-between gap-3 text-slate-100">
        <!-- Brand -->
        <NuxtLink to="/" class="group flex items-center gap-3">
          <span
            class="h-8 w-8 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 shadow ring-1 ring-white/20"
          ></span>
          <span class="text-sm font-semibold tracking-wide">UBMager</span>
        </NuxtLink>

        <!-- Desktop nav -->
        <ul class="hidden items-center gap-1 md:flex">
          <li v-for="l in links" :key="l.to">
            <NuxtLink
              :to="l.to"
              class="relative block rounded-xl px-3 py-2 text-sm font-medium transition text-slate-200 hover:bg-white/10"
              :class="isActive(l.to) ? 'text-white' : ''"
            >
              <span class="relative z-10">{{ l.label }}</span>
              <span
                v-if="isActive(l.to)"
                class="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-sky-500/15 to-indigo-600/15 ring-1 ring-white/15"
              >
              </span>
            </NuxtLink>
          </li>
        </ul>

        <!-- CTA -->
        <div v-if="!checkAuth()" class="hidden items-center gap-2 md:flex">
          <NuxtLink
            to="/auth/login"
            class="group inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor">
              <path
                d="M10.828 11H3a1 1 0 1 0 0 2h7.828l-3.536 3.536a1 1 0 0 0 1.414 1.414l5.243-5.243a1 1 0 0 0 0-1.414L8.707 6.05a1 1 0 1 0-1.414 1.414L10.828 11Z"
              />
              <path
                d="M21 4a1 1 0 0 0-1-1h-7a1 1 0 1 0 0 2h6v14h-6a1 1 0 1 0 0 2h7a1 1 0 0 0 1-1V4Z"
              />
            </svg>
            Masuk
          </NuxtLink>
        </div>
        <div v-else class="hidden items-center gap-2 md:flex">
          <button
            @click="logout"
            class="group inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor">
              <path
                d="M10.828 11H3a1 1 0 1 0 0 2h7.828l-3.536 3.536a1 1 0 0 0 1.414 1.414l5.243-5.243a1 1 0 0 0 0-1.414L8.707 6.05a1 1 0 1 0-1.414 1.414L10.828 11Z"
              />
              <path
                d="M21 4a1 1 0 0 0-1-1h-7a1 1 0 1 0 0 2h6v14h-6a1 1 0 1 0 0 2h7a1 1 0 0 0 1-1V4Z"
              />
            </svg>
            Logout
          </button>
        </div>
        <!-- Mobile toggle -->
        <button
          class="md:hidden inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 p-2 text-slate-100 transition hover:bg-white/10"
          @click="isOpen = !isOpen"
          aria-label="Toggle menu"
        >
          <h1>{{ isOpen ? "Tutup menu" : "Buka menu" }}</h1>
        </button>
      </nav>

      <!-- Mobile menu -->
      <transition name="pop">
        <div v-if="isOpen" class="mt-3 grid gap-2 text-slate-100 md:hidden">
          <NuxtLink
            v-for="l in links"
            :key="l.to"
            :to="l.to"
            class="rounded-2xl px-4 py-3 text-sm font-medium hover:bg-white/10"
            :class="
              isActive(l.to)
                ? 'ring-1 ring-white/15 bg-gradient-to-br from-sky-500/15 to-indigo-600/15'
                : ''
            "
            @click="isOpen = false"
          >
            {{ l.label }}
          </NuxtLink>

          <NuxtLink
            v-if="!checkAuth()"
            to="/auth/login"
            class="mt-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15"
            @click="isOpen = false"
          >
            Masuk
          </NuxtLink>
          <button
            v-else
            @click="logout(); isOpen = false"
            class="mt-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15"
          >
            Logout
          </button>
        </div>
      </transition>
    </div>
  </header>
</template>

<style scoped>
.pop-enter-active,
.pop-leave-active {
  transition: opacity 0.15s ease, transform 0.2s ease;
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
</style>
