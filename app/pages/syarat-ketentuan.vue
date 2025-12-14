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
      "Syarat dan Ketentuan ini mengatur penggunaan layanan UBMager. Dengan mengakses atau menggunakan platform kami, Anda menyetujui untuk terikat oleh ketentuan-ketentuan ini.",
  },
  {
    id: "usage",
    title: "Penggunaan Layanan",
    subsections: [
      {
        subtitle: "Eligibilitas",
        text: "Untuk menggunakan UBMager, Anda harus:",
        items: [
          "Berusia minimal 18 tahun atau memiliki izin orang tua/wali",
          "Memberikan informasi yang akurat dan terkini",
          "Menjaga keamanan akun Anda",
          "Bertanggung jawab atas semua aktivitas di akun Anda",
        ],
      },
      {
        subtitle: "Larangan",
        text: "Anda tidak diperbolehkan untuk:",
        items: [
          "Menggunakan platform untuk aktivitas ilegal atau merugikan",
          "Mengirim spam, phishing, atau konten berbahaya",
          "Menggunakan bot atau script otomatis tanpa izin",
          "Mengakses atau mengganggu sistem keamanan platform",
          "Menjual akun atau menyalahgunakan identitas pihak lain",
          "Melakukan aktivitas yang melanggar hak cipta atau HAKI",
        ],
      },
    ],
  },
  {
    id: "transactions",
    title: "Transaksi dan Pembayaran",
    subsections: [
      {
        subtitle: "Tanggung Jawab Pembeli",
        text: "Sebagai pembeli, Anda bertanggung jawab untuk:",
        items: [
          "Memberikan informasi pengiriman yang akurat",
          "Melakukan pembayaran sesuai dengan harga yang disepakati",
          "Melaporkan masalah dalam jangka waktu yang ditentukan",
          "Menerima barang sesuai dengan deskripsi produk",
        ],
      },
      {
        subtitle: "Tanggung Jawab Penjual",
        text: "Sebagai penjual, Anda berkomitmen untuk:",
        items: [
          "Menyediakan deskripsi produk yang akurat dan jelas",
          "Mengirim barang tepat waktu sesuai jadwal yang disepakati",
          "Menangani keluhan pelanggan dengan profesional",
          "Mematuhi standar kualitas dan keamanan produk",
          "Memberikan informasi pengiriman yang jelas",
        ],
      },
      {
        subtitle: "Kebijakan Pengembalian",
        text: "Pembeli dapat melakukan pengembalian barang dalam kondisi berikut:",
        items: [
          "Barang tidak sesuai dengan deskripsi produk",
          "Barang rusak atau cacat saat diterima",
          "Pengembalian dilakukan dalam 7 hari setelah penerimaan",
        ],
      },
    ],
  },
  {
    id: "liability",
    title: "Batasan Tanggung Jawab",
    subsections: [
      {
        subtitle: "Disclaimer",
        text: "UBMager menyediakan layanan 'sebagaimana adanya'. Kami tidak memberikan jaminan apapun mengenai:",
        items: [
          "Ketersediaan atau fungsionalitas layanan yang tidak terputus",
          "Akurasi, kelengkapan, atau keamanan konten pengguna",
          "Kerugian yang timbul dari penggunaan platform",
        ],
      },
      {
        subtitle: "Batasan Kompensasi",
        text: "Dalam keadaan apapun, UBMager tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan menggunakan layanan.",
      },
    ],
  },
  {
    id: "intellectual",
    title: "Hak Kekayaan Intelektual",
    subsections: [
      {
        subtitle: "Kepemilikan Konten",
        text: "Semua konten di UBMager, termasuk logo, desain, dan teks, adalah milik UBMager atau lisensi pihak ketiga. Anda tidak boleh mereproduksi, mendistribusikan, atau menggunakan konten tanpa izin.",
      },
      {
        subtitle: "Konten Pengguna",
        text: "Anda mempertahankan kepemilikan atas konten yang Anda posting. Dengan memposting, Anda memberikan UBMager lisensi untuk menggunakan konten Anda untuk operasi platform.",
      },
    ],
  },
  {
    id: "termination",
    title: "Pemutusan Akun",
    subsections: [
      {
        subtitle: "Alasan Pemutusan",
        text: "UBMager dapat menangguhkan atau menutup akun Anda jika:",
        items: [
          "Anda melanggar Syarat dan Ketentuan ini",
          "Anda terlibat dalam aktivitas ilegal atau merugikan",
          "Akun Anda tidak aktif untuk periode yang panjang",
          "Atas kebijakan UBMager untuk alasan apapun",
        ],
      },
    ],
  },
  {
    id: "changes",
    title: "Perubahan Ketentuan",
    subsections: [
      {
        subtitle: "Pembaruan",
        text: "UBMager dapat memperbarui Syarat dan Ketentuan ini kapan saja. Perubahan signifikan akan diberitahukan kepada Anda melalui email atau notifikasi platform. Penggunaan berkelanjutan berarti penerimaan perubahan.",
      },
    ],
  },
  {
    id: "contact",
    title: "Hubungi Kami",
    content:
      "Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini, silakan hubungi tim customer service kami melalui email atau formulir kontak di platform.",
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
          Syarat dan Ketentuan
        </h1>
        <p class="max-w-2xl text-lg text-slate-300">
          Ketentuan penggunaan platform UBMager yang berlaku untuk semua
          pengguna. Silakan baca dengan seksama sebelum menggunakan layanan kami.
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