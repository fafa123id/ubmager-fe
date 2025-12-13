<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'default',
})

const { 
  products, 
  loading, 
  error, 
  maxPage, 
  currentPage,
  initialize, 
  fetchProducts,
  fetchMaxPage,
} = useProduct()

const {
  getFilterParams,
  resetFilters,
} = useProductFilter()

/**
 * Fetch ulang products dan max page dengan filter terbaru
 * Reset ke halaman 1
 */
const refetchWithFilters = async () => {
  try {
    const filterParams = getFilterParams()
    
    // Fetch ulang max page dan products secara parallel
    await Promise.all([
      fetchMaxPage(12, filterParams),
      fetchProducts(1, 12, filterParams),
    ])
    

  } catch (err) {
    console.error('Failed to refetch with filters:', err)
  }
}

// Fetch products saat page berubah
const handlePageChange = async (newPage) => {
  try {
    const filterParams = getFilterParams()
    await fetchProducts(newPage, 12, filterParams)
    

  } catch (err) {
    console.error('Failed to fetch products:', err)
  }
}

// Handle filter change (type/category filter)
const handleFilterChange = async () => {
  await refetchWithFilters()
}

// Handle search change
const handleSearchChange = async () => {
  await refetchWithFilters()
}

// Handle reset filters
const handleResetFilters = async () => {
  try {
    await resetFilters()
    await refetchWithFilters()
  } catch (err) {
    console.error('Failed to reset filters:', err)
  }
}

const handleViewProduct = (productId) => {
  navigateTo(`/produk/${productId}`)
}

const handleAddToCart = (productId) => {
  useSwal().showInfo('Fitur cart sedang dikembangkan')
}

onMounted(async () => {
  try {
    await initialize(1, 12)
  } catch (err) {
    console.error('Failed to initialize products:', err)
  }
})
</script>

<template>
  <div class="relative min-h-dvh text-slate-100 overflow-hidden">
    <!-- BG -->
    <div class="absolute inset-0 -z-20 bg-[radial-gradient(60%_60%_at_50%_10%,#0f172a_0%,#0b1220_50%,#0a0f1a_100%)]"></div>
    <div class="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,.25))]"></div>
    <div class="absolute inset-0 -z-10 opacity-15 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]">
      <div class="h-full w-full bg-[length:42px_42px] bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]"></div>
    </div>
    <div class="pointer-events-none absolute -top-20 -left-24 h-72 w-72 rounded-full bg-sky-500/15 blur-3xl"></div>
    <div class="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl"></div>

    <!-- Header Section -->
    <section class="relative mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
      <div class="py-8">
        <div class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 mb-4">
          <span class="h-2 w-2 rounded-full bg-sky-400"></span> Jelajahi Produk & Jasa
        </div>
        <h1 class="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
          Temukan <span class="text-transparent bg-clip-text bg-gradient-to-br from-sky-400 to-indigo-400">produk & jasa</span>
          <br />
          yang kamu butuhkan
        </h1>
        <p class="max-w-2xl text-pretty text-slate-300 mb-6">
          Ribuan produk dan jasa berkualitas dari para penjual terpercaya. Mulai dari makanan, merchandise, layanan desain, hingga event support.
        </p>

        <!-- Search Bar -->
        <div class="">
          <ProductSearch @search-changed="handleSearchChange" />
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid gap-8 lg:grid-cols-4">
        <!-- Filter Sidebar -->
        <div class="lg:col-span-1">
          <div class="sticky top-24 rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-lg font-bold text-slate-100">Filter</h2>
              <button
                @click="handleResetFilters"
                class="text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
              >
                Reset
              </button>
            </div>
            
            <!-- Filter Component -->
            <ProductFilterButton @filter-changed="handleFilterChange" />
          </div>
        </div>

        <!-- Products Section -->
        <div id="products-section" class="lg:col-span-3 space-y-8">
          <!-- Loading State -->
          <div v-if="loading && products.length === 0" class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div v-for="i in 5" :key="i" class="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl">
              <div class="mb-4 aspect-square w-full rounded-xl bg-slate-800/50 animate-pulse"></div>
              <div class="h-3 w-2/3 rounded bg-slate-700/50 mb-2 animate-pulse"></div>
              <div class="h-3 w-1/3 rounded bg-slate-700/50 mb-3 animate-pulse"></div>
              <div class="h-3 w-full rounded bg-slate-700/50 animate-pulse"></div>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="error && products.length === 0" class="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
            <svg class="h-12 w-12 mx-auto mb-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-red-300">{{ error }}</p>
          </div>

          <!-- Products Grid -->
          <div v-else-if="products.length > 0" class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <ProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
              @view-details="handleViewProduct"
              @add-to-cart="handleAddToCart"
            />
          </div>

          <!-- Empty State -->
          <div v-else class="rounded-2xl border border-white/10 bg-slate-900/60 p-12 text-center backdrop-blur-xl">
            <svg class="h-16 w-16 mx-auto mb-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 class="text-lg font-semibold text-slate-200 mb-2">Tidak ada produk</h3>
            <p class="text-slate-400">Belum ada produk yang sesuai dengan pencarian atau filter Anda.</p>
          </div>

          <!-- Pagination -->
          <div v-if="products.length > 0" class="flex justify-center pt-4">
            <ProductPagination
              :perPage="12"
              :maxPage="maxPage"
              :initialPage="currentPage"
              @page-changed="handlePageChange"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>