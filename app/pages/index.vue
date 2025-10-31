<script setup>
const ctaScroll = (id) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <main class="relative overflow-hidden text-slate-100">
    <!-- BG gelap elegan -->
    <div class="absolute inset-0 -z-20 bg-[radial-gradient(60%_60%_at_50%_10%,#0f172a_0%,#0b1220_50%,#0a0f1a_100%)]"></div>
    <div class="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,.25))]"></div>
    <div class="absolute inset-0 -z-10 opacity-15 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]">
      <div class="h-full w-full bg-[length:42px_42px] bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]"></div>
    </div>
    <div class="pointer-events-none absolute -top-20 -left-24 h-72 w-72 rounded-full bg-sky-500/15 blur-3xl"></div>
    <div class="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl"></div>

    <!-- HERO -->
    <section class="reveal relative mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
      <div class="grid items-center gap-10 py-14 lg:grid-cols-2">
        <div>
          <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
            <span class="h-2 w-2 rounded-full bg-emerald-400"></span> UBMager — Beli & Jual Produk/Jasa
          </div>
          <h1 class="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
            Semua kebutuhan kampus & komunitas,<br />
            <span class="text-transparent bg-clip-text bg-gradient-to-br from-sky-400 to-indigo-400">dalam satu platform</span>
          </h1>
          <p class="mt-4 max-w-2xl text-pretty text-slate-300">
            UBMager memudahkan kamu untuk <strong>belanja</strong> dan <strong>jualan</strong> berbagai produk maupun jasa:
            makanan, merchandise, layanan desain, titip beli, hingga event support—cepat, aman, dan transparan.
          </p>

          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink
              to="/jelajah"
              class="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/15 transition-colors hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor"><path d="M3 4h18v2H3V4Zm0 6h18v2H3v-2Zm0 6h18v2H3v-2Z"/></svg>
              Mulai Belanja
            </NuxtLink>

            <button
              class="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              @click="ctaScroll('mitra')"
            >
              <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor"><path d="M12 2a5 5 0 0 1 5 5v1h1a3 3 0 0 1 3 3v8h-2v-8a1 1 0 0 0-1-1h-1v9H7V10H6a1 1 0 0 0-1 1v8H3v-8a3 3 0 0 1 3-3h1V7a5 5 0 0 1 5-5Zm-3 8h6v7H9v-7Z"/></svg>
              Tertarik jadi Mitra
            </button>
          </div>

          <div class="mt-6 flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <span class="inline-flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span> Pembayaran aman</span>
            <span class="inline-flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-sky-400"></span> Chat & tracking pesanan</span>
            <span class="inline-flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-indigo-400"></span> Komisi mitra transparan</span>
          </div>
        </div>

        <!-- mock preview card -->
        <div class="relative">
          <div class="reveal mx-auto w-full max-w-xl rounded-3xl border border-white/10 bg-slate-900/60 p-4 shadow-2xl backdrop-blur-xl" data-delay="80">
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div class="mb-3 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="h-7 w-7 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 ring-1 ring-white/20"></span>
                  <span class="text-sm text-slate-200">Produk Populer</span>
                </div>
                <span class="rounded-md bg-white/10 px-2 py-1 text-[11px] text-slate-300 ring-1 ring-white/10">Live</span>
              </div>
              <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div v-for="i in 6" :key="i" class="reveal rounded-xl border border-white/10 bg-white/5 p-3" :data-delay="i*60">
                  <div class="mb-2 aspect-square w-full rounded-lg bg-slate-800"></div>
                  <div class="h-3 w-2/3 rounded bg-white/10"></div>
                  <div class="mt-2 h-3 w-1/3 rounded bg-white/10"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="pointer-events-none absolute -right-6 -top-6 hidden h-24 w-24 rounded-2xl bg-sky-500/20 blur-2xl sm:block"></div>
          <div class="pointer-events-none absolute -bottom-8 -left-6 hidden h-24 w-24 rounded-2xl bg-indigo-500/20 blur-2xl sm:block"></div>
        </div>
      </div>
    </section>

    <!-- FITUR -->
    <section class="reveal relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h2 class="text-center text-2xl font-bold tracking-tight">Kenapa pilih UBMager?</h2>
      <p class="mx-auto mt-2 max-w-2xl text-center text-slate-300">
        Solusi end-to-end untuk belanja, jualan, dan kolaborasi layanan.
      </p>

      <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="reveal rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl" data-delay="0">
          <div class="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 ring-1 ring-white/10">
            <svg viewBox="0 0 24 24" class="h-5 w-5 text-sky-300" fill="currentColor"><path d="M7 4h10l1 2h3v2h-2l-2.6 9.1A2 2 0 0 1 14.5 19h-5a2 2 0 0 1-1.9-1.4L5 8H3V6h3l1-2Z"/></svg>
          </div>
          <h3 class="font-semibold">Belanja Cepat & Aman</h3>
          <p class="mt-1 text-sm text-slate-300">Checkout ringkas, notifikasi real-time, dan dukungan berbagai metode pembayaran.</p>
        </div>

        <div class="reveal rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl" data-delay="80">
          <div class="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 ring-1 ring-white/10">
            <svg viewBox="0 0 24 24" class="h-5 w-5 text-indigo-300" fill="currentColor"><path d="M4 4h16v2H4V4Zm0 4h10v2H4V8Zm0 4h16v2H4v-2Zm0 4h10v2H4v-2Z"/></svg>
          </div>
          <h3 class="font-semibold">Jual Produk & Jasa</h3>
          <p class="mt-1 text-sm text-slate-300">Listing fleksibel untuk barang fisik, digital, hingga layanan (desain, jastip, dll).</p>
        </div>

        <div class="reveal rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl" data-delay="160">
          <div class="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 ring-1 ring-white/10">
            <svg viewBox="0 0 24 24" class="h-5 w-5 text-emerald-300" fill="currentColor"><path d="M12 2 2 7l10 5 10-5-10-5Zm0 9L2 6v11l10 5 10-5V6l-10 5Z"/></svg>
          </div>
          <h3 class="font-semibold">Komunitas Kampus</h3>
          <p class="mt-1 text-sm text-slate-300">Dirancang untuk mahasiswa & UKM—event, pre-order, dan kolaborasi.</p>
        </div>

        <div class="reveal rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl" data-delay="240">
          <div class="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 ring-1 ring-white/10">
            <svg viewBox="0 0 24 24" class="h-5 w-5 text-amber-300" fill="currentColor"><path d="M12 1a5 5 0 0 1 5 5v3h3a3 3 0 0 1 3 3v6h-4v-6h-2v6H7v-6H5v6H1v-6a3 3 0 0 1 3-3h3V6a5 5 0 0 1 5-5Z"/></svg>
          </div>
          <h3 class="font-semibold">Skema Mitra Transparan</h3>
          <p class="mt-1 text-sm text-slate-300">Komisi jelas, dashboard penjualan, dan laporan dapat diunduh.</p>
        </div>
      </div>
    </section>

    <!-- KATEGORI -->
    <section class="reveal relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" data-reveal="repeat">
      <div class="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold tracking-tight">Kategori Populer</h2>
          <p class="mt-1 text-slate-300">Eksplor produk & jasa favorit di UBMager.</p>
        </div>
        <NuxtLink to="/jelajah" class="cursor-pointer rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">
          Lihat Semua
        </NuxtLink>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="(k,i) in [
            { name: 'Makanan & Minuman' },
            { name: 'Merch & Fashion' },
            { name: 'Jastip & Kurir' },
            { name: 'Desain & Kreatif' },
            { name: 'Foto & Video' },
            { name: 'Perawatan & Kebersihan' },
            { name: 'Kursus & Bimbingan' },
            { name: 'Event Support' },
          ]"
          :key="k.name"
          class="reveal group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl"
          :data-delay="(i % 4) * 80"
          data-reveal="repeat"
        >
          <div class="mb-10 h-28 w-full rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 ring-1 ring-white/5"></div>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">{{ k.name }}</h3>
            <span class="rounded-lg bg-white/10 px-2 py-1 text-xs text-slate-300 ring-1 ring-white/10">Explore</span>
          </div>
          <div class="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-xl bg-sky-500/10 blur-xl transition group-hover:bg-sky-500/20"></div>
        </div>
      </div>
    </section>

    <!-- JADI MITRA -->
    <section id="mitra" class="reveal relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="rounded-3xl border border-white/10 bg-slate-900/60 p-8 backdrop-blur-xl">
        <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 class="text-2xl font-bold tracking-tight">Tertarik Jadi Mitra?</h2>
            <p class="mt-1 max-w-2xl text-slate-300">Mulai jual produk atau jasa kamu di UBMager, dan jangkau komunitas kampus lebih luas.</p>
          </div>
          <NuxtLink to="/mitra/daftar" class="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/15 transition-colors hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">
            Daftar Mitra
          </NuxtLink>
        </div>

        <div class="grid gap-4 md:grid-cols-3">
          <div class="reveal rounded-2xl border border-white/10 bg-white/5 p-5" data-delay="0">
            <div class="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 ring-1 ring-white/10">
              <svg viewBox="0 0 24 24" class="h-5 w-5 text-sky-300" fill="currentColor"><path d="M4 6h16v2H4V6Zm0 4h16v2H4V8Zm0 4h16v2H4v-2Z"/></svg>
            </div>
            <h3 class="font-semibold">Buat Toko</h3>
            <p class="mt-1 text-sm text-slate-300">Lengkapi profil, alamat, dan preferensi layanan.</p>
          </div>
          <div class="reveal rounded-2xl border border-white/10 bg-white/5 p-5" data-delay="100">
            <div class="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 ring-1 ring-white/10">
              <svg viewBox="0 0 24 24" class="h-5 w-5 text-indigo-300" fill="currentColor"><path d="M4 4h16v2H4V4Zm0 4h12v2H4V8Zm0 4h16v2H4v-2Zm0 4h8v2H4v-2Z"/></svg>
            </div>
            <h3 class="font-semibold">Pasang Listing</h3>
            <p class="mt-1 text-sm text-slate-300">Produk fisik, digital, atau jasa—semuanya bisa.</p>
          </div>
          <div class="reveal rounded-2xl border border-white/10 bg-white/5 p-5" data-delay="200">
            <div class="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 ring-1 ring-white/10">
              <svg viewBox="0 0 24 24" class="h-5 w-5 text-emerald-300" fill="currentColor"><path d="M12 2a7 7 0 0 1 7 7v2h3v11H2V11h3V9a7 7 0 0 1 7-7Zm-1 14v2h2v-2h-2Z"/></svg>
            </div>
            <h3 class="font-semibold">Terima Pesanan</h3>
            <p class="mt-1 text-sm text-slate-300">Kelola pesanan, chat pelanggan, & tarik saldo kapan saja.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- STATS / TRUST -->
    <section class="reveal relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid gap-4 sm:grid-cols-3">
        <div class="reveal rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-center" data-delay="0">
          <div class="text-3xl font-extrabold">10K+</div>
          <div class="mt-1 text-sm text-slate-300">Transaksi aman</div>
        </div>
        <div class="reveal rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-center" data-delay="100">
          <div class="text-3xl font-extrabold">2K+</div>
          <div class="mt-1 text-sm text-slate-300">Mitra terdaftar</div>
        </div>
        <div class="reveal rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-center" data-delay="200">
          <div class="text-3xl font-extrabold">99.5%</div>
          <div class="mt-1 text-sm text-slate-300">Rating kepuasan</div>
        </div>
      </div>

      <div class="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
        <span>© {{ new Date().getFullYear() }} UBMager</span>
        <span>•</span>
        <NuxtLink to="/kebijakan-privasi" class="hover:underline">Privasi</NuxtLink>
        <span>•</span>
        <NuxtLink to="/syarat-ketentuan" class="hover:underline">S&K</NuxtLink>
      </div>
    </section>
  </main>
</template>
