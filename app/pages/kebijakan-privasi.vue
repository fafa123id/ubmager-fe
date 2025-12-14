<script setup>
import { ref } from "vue";

definePageMeta({
  layout: "default",
});

const sections = [
  {
    id: "intro",
    title: "Pengantar",
    content:
      "Kebijakan Privasi ini menjelaskan bagaimana UBMager mengumpulkan, menggunakan, dan melindungi data pribadi Anda. Kami berkomitmen untuk menjaga kerahasiaan informasi Anda dan mematuhi peraturan privasi yang berlaku.",
  },
  {
    id: "data-collection",
    title: "Pengumpulan Data",
    subsections: [
      {
        subtitle: "Data yang Kami Kumpulkan",
        text: "Kami mengumpulkan berbagai jenis data untuk memberikan layanan yang lebih baik, termasuk:",
        items: [
          "Informasi akun: nama, email, nomor telepon, alamat",
          "Data transaksi: riwayat pembelian, metode pembayaran",
          "Data perilaku: preferensi produk, riwayat browsing",
          "Informasi teknis: IP address, tipe perangkat, browser",
          "Cookie dan teknologi pelacakan serupa",
        ],
      },
      {
        subtitle: "Cara Kami Mengumpulkan Data",
        text: "Data dikumpulkan melalui:",
        items: [
          "Formulir pendaftaran dan profil pengguna",
          "Interaksi dengan platform (pencarian, klik, dll)",
          "Komunikasi dengan customer service",
          "Integrasi pihak ketiga (payment gateway, analytics)",
        ],
      },
    ],
  },
  {
    id: "data-usage",
    title: "Penggunaan Data",
    subsections: [
      {
        subtitle: "Untuk Apa Kami Menggunakan Data?",
        text: "Data Anda digunakan untuk:",
        items: [
          "Menyediakan dan meningkatkan layanan UBMager",
          "Memproses transaksi dan pengiriman",
          "Komunikasi tentang akun dan layanan",
          "Personalisasi pengalaman pengguna",
          "Analisis dan riset untuk meningkatkan platform",
          "Keamanan dan pencegahan fraud",
          "Kepatuhan terhadap hukum dan regulasi",
        ],
      },
    ],
  },
  {
    id: "data-protection",
    title: "Perlindungan Data",
    subsections: [
      {
        subtitle: "Keamanan",
        text: "Kami menggunakan teknologi enkripsi dan protokol keamanan industri untuk melindungi data Anda dari akses tidak sah. Namun, tidak ada sistem yang 100% aman, dan kami tidak dapat menjamin keamanan absolut.",
      },
      {
        subtitle: "Retensi Data",
        text: "Kami menyimpan data Anda selama akun Anda aktif dan sesuai kebutuhan hukum. Anda dapat meminta penghapusan data kapan saja.",
      },
    ],
  },
  {
    id: "user-rights",
    title: "Hak-Hak Pengguna",
    subsections: [
      {
        subtitle: "Hak Anda",
        text: "Anda memiliki hak untuk:",
        items: [
          "Mengakses data pribadi Anda",
          "Memperbaiki atau memperbarui data yang tidak akurat",
          "Meminta penghapusan data Anda",
          "Membatasi penggunaan data Anda",
          "Menolak penggunaan data untuk marketing",
          "Mengunduh salinan data Anda",
        ],
      },
    ],
  },
  {
    id: "contact",
    title: "Hubungi Kami",
    content:
      "Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini atau ingin menggunakan hak-hak Anda, silakan hubungi kami melalui email atau formulir kontak di platform.",
  },
];

const activeSection = ref("intro");
</script>

<template>
  <main class="relative min-h-dvh overflow-hidden text-slate-100">
    <!-- BG -->
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

    <!-- Header -->
    <section class="relative mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition-all duration-200 hover:bg-white/10 hover:border-white/25 mb-8"
      >
        <svg
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Kembali
      </NuxtLink>

      <div class="mb-12 space-y-4">
        <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">
          Kebijakan Privasi
        </h1>
        <p class="max-w-2xl text-lg text-slate-300">
          Kami menghormati privasi Anda dan berkomitmen untuk melindungi data
          pribadi Anda dengan serius.
        </p>
        <p class="text-sm text-slate-400">
          Terakhir diperbarui: {{ new Date().toLocaleDateString("id-ID") }}
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="relative mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <div class="grid gap-8 lg:grid-cols-4">
        <!-- Sidebar Navigation -->
        <aside class="lg:col-span-1">
          <div
            class="sticky top-8 rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl"
          >
            <h3 class="mb-3 text-sm font-semibold text-slate-200">
              Daftar Isi
            </h3>
            <nav class="space-y-1">
              <button
                v-for="section in sections"
                :key="section.id"
                @click="activeSection = section.id"
                :class="[
                  'block w-full text-left rounded-lg px-3 py-2 text-sm transition-all duration-200',
                  activeSection === section.id
                    ? 'bg-sky-500/20 text-sky-300 font-semibold ring-1 ring-sky-400/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5',
                ]"
              >
                {{ section.title }}
              </button>
            </nav>
          </div>
        </aside>

        <!-- Content -->
        <div class="lg:col-span-3">
          <Transition name="fadeSlide" mode="out-in">
            <div :key="activeSection">
              <div
                class="rounded-2xl border border-white/10 bg-slate-900/60 p-8 backdrop-blur-xl"
              >
                <template v-for="section in sections" :key="section.id">
                  <template v-if="section.id === activeSection">
                    <h2 class="mb-4 text-2xl font-bold">{{ section.title }}</h2>

                    <!-- Simple Content -->
                    <p
                      v-if="section.content"
                      class="text-slate-300 leading-relaxed"
                    >
                      {{ section.content }}
                    </p>

                    <!-- Subsections -->
                    <div v-else class="space-y-6">
                      <div
                        v-for="(sub, idx) in section.subsections"
                        :key="idx"
                        class="space-y-3"
                      >
                        <h3
                          v-if="sub.subtitle"
                          class="text-lg font-semibold"
                        >
                          {{ sub.subtitle }}
                        </h3>
                        <p
                          v-if="sub.text"
                          class="text-slate-300 leading-relaxed"
                        >
                          {{ sub.text }}
                        </p>
                        <ul v-if="sub.items" class="space-y-2 pl-4">
                          <li
                            v-for="(item, i) in sub.items"
                            :key="i"
                            class="flex gap-3 text-slate-300"
                          >
                            <span
                              class="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sky-400"
                            ></span>
                            <span>{{ item }}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </template>
                </template>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer
      class="mx-auto max-w-7xl px-4 pb-10 text-center text-xs text-slate-400 sm:px-6 lg:px-8"
    >
      © {{ new Date().getFullYear() }} UBMager • Semua hak dilindungi
    </footer>
  </main>
</template>

<style scoped>
.fadeSlide-enter-active,
.fadeSlide-leave-active {
  transition: all 0.3s ease-out;
}

.fadeSlide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fadeSlide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>