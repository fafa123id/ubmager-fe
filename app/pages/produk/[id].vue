<script setup>
import { ref, onMounted, computed } from 'vue'

const route = useRoute()
const { getProductById, loading, error } = useProduct()
const product = ref(null)
const selectedImage = ref(0)

const isAvailable = computed(() => {
  return product.value && product.value.quantity > 0
})

const formattedPrice = computed(() => {
  if (!product.value) return ''
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(product.value.price)
})

const productImages = computed(() => {
  if (!product.value) return []
  const images = []
  if (product.value.image1) images.push(product.value.image1)
  if (product.value.image2) images.push(product.value.image2)
  if (product.value.image3) images.push(product.value.image3)
  return images
})

const currentImage = computed(() => {
  return productImages.value[selectedImage.value] || productImages.value[0]
})

const handleAddToCart = () => {
  if (!isAvailable.value) {
    useSwal().showInfo('Maaf, produk ini sedang habis.')
    return
  }
  useSwal().showInfo('Fitur cart sedang dikembangkan')
}

const goBack = () => {
  navigateTo('/produk')
}

onMounted(async () => {
  try {
    const productId = route.params.id
    const data = await getProductById(productId)
    product.value = data.data || data
    
    // Jika product tidak available/tidak ada, redirect
    if (!product.value || !product.value.id) {
      useSwal().showInfo('Produk tidak ditemukan.')
      goBack()
    }
  } catch (err) {
    console.error('Failed to fetch product detail:', err)
    useSwal().showError('Gagal memuat detail produk.')
    goBack()
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

    <!-- Header with Back Button -->
    <section class="relative mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
      <button
        @click="goBack"
        class="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition-all duration-200 hover:bg-white/10 hover:border-white/25"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Kembali
      </button>
    </section>

    <!-- Loading State -->
    <section v-if="loading" class="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid gap-8 lg:grid-cols-2">
        <!-- Image Skeleton -->
        <div class="rounded-2xl border border-white/10 bg-slate-900/60 aspect-square animate-pulse"></div>
        
        <!-- Content Skeleton -->
        <div class="space-y-6">
          <div class="h-8 w-3/4 rounded-lg bg-slate-700/50 animate-pulse"></div>
          <div class="space-y-2">
            <div class="h-4 w-full rounded-lg bg-slate-700/50 animate-pulse"></div>
            <div class="h-4 w-5/6 rounded-lg bg-slate-700/50 animate-pulse"></div>
          </div>
          <div class="h-10 w-1/3 rounded-lg bg-slate-700/50 animate-pulse"></div>
        </div>
      </div>
    </section>

    <!-- Error State -->
    <section v-else-if="error" class="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
        <svg class="h-12 w-12 mx-auto mb-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-300 mb-4">{{ error }}</p>
        <button
          @click="goBack"
          class="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-500/90 to-indigo-600/90 px-4 py-2 text-sm font-semibold text-white"
        >
          Kembali ke Produk
        </button>
      </div>
    </section>

    <!-- Product Detail -->
    <section v-else-if="product" class="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid gap-8 lg:grid-cols-2">
        <!-- Image Section -->
        <div class="space-y-4">
          <!-- Main Image -->
          <div class="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl overflow-hidden">
            <img
              :src="currentImage"
              :alt="product.name"
              class="w-full aspect-square object-cover rounded-xl"
            />
          </div>

          <!-- Thumbnail Gallery -->
          <div v-if="productImages.length > 1" class="flex gap-3">
            <button
              v-for="(img, idx) in productImages"
              :key="idx"
              @click="selectedImage = idx"
              class="rounded-lg border-2 transition-all duration-200"
              :class="
                selectedImage === idx
                  ? 'border-sky-400/50'
                  : 'border-white/15 hover:border-white/25'
              "
            >
              <img
                :src="img"
                :alt="`${product.name} - ${idx + 1}`"
                class="w-20 h-20 object-cover rounded-md"
              />
            </button>
          </div>
        </div>

        <!-- Details Section -->
        <div class="space-y-6">
          <!-- Header Info -->
          <div>
            <div class="flex items-start justify-between gap-4 mb-3">
              <div>
                <div class="inline-block mb-2">
                  <span class="rounded-md bg-sky-500/20 px-3 py-1 text-xs font-semibold text-sky-300 ring-1 ring-sky-400/30">
                    {{ product.type }}
                  </span>
                </div>
                <h1 class="text-3xl font-bold text-slate-100">{{ product.name }}</h1>
              </div>
              
              <!-- Status Badge -->
              <div v-if="!isAvailable" class="rounded-md bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-300 ring-1 ring-red-500/30 whitespace-nowrap">
                Sold Out
              </div>
              <div v-else-if="product.quantity < 5" class="rounded-md bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300 ring-1 ring-amber-500/30 whitespace-nowrap">
                Limited Stock
              </div>
            </div>

            <!-- Category -->
            <p class="text-sm text-slate-400 mb-2">
              Kategori: <span class="font-semibold text-slate-300">{{ product.category }}</span>
            </p>

            <!-- Rating and Owner -->
            <div class="flex items-center gap-4 flex-wrap">
              <div v-if="product.rating" class="flex items-center gap-2">
                <div class="flex gap-0.5">
                  <svg
                    v-for="i in 5"
                    :key="i"
                    class="h-4 w-4"
                    :class="i <= Math.round(product.rating) ? 'text-amber-400' : 'text-slate-600'"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                </div>
                <span class="text-sm text-slate-400">({{ product.rating.toFixed(1) }})</span>
              </div>

              <div v-if="product.owner" class="text-sm text-slate-400">
                Penjual: <span class="font-semibold text-slate-300">{{ product.owner }}</span>
              </div>
            </div>
          </div>

          <!-- Price Section -->
          <div class="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
            <p class="text-xs text-slate-400 mb-2">Harga</p>
            <p class="text-4xl font-bold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
              {{ formattedPrice }}
            </p>
          </div>

          <!-- Stock Info -->
          <div class="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
            <p class="text-sm text-slate-400 mb-2">Ketersediaan Stok</p>
            <div v-if="isAvailable" class="flex items-center gap-2">
              <span class="h-3 w-3 rounded-full bg-emerald-400"></span>
              <span class="font-semibold text-slate-200">{{ product.quantity }} barang tersedia</span>
            </div>
            <div v-else class="flex items-center gap-2">
              <span class="h-3 w-3 rounded-full bg-red-400"></span>
              <span class="font-semibold text-slate-200">Sedang habis</span>
            </div>
          </div>

          <!-- Description -->
          <div v-if="product.description" class="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
            <p class="text-sm text-slate-400 mb-2">Deskripsi</p>
            <p class="text-slate-300 leading-relaxed">{{ product.description }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4">
            <button
              v-if="isAvailable"
              @click="handleAddToCart"
              class="flex-1 rounded-lg bg-gradient-to-r from-sky-500/90 to-indigo-600/90 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/20 transition-all duration-200 hover:from-sky-500 hover:to-indigo-600 hover:ring-white/30 active:scale-95"
            >
              <svg class="h-4 w-4 inline mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 4V3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1h4a1 1 0 0 1 0 2h-1.06l-.736 14.736A2 2 0 0 1 15.21 22H8.79a2 2 0 0 1-1.994-1.864L6.06 6H5a1 1 0 0 1 0-2h2zm2 2h6v11H9V6z" />
              </svg>
              Beli Sekarang
            </button>

            <button
              v-else
              disabled
              class="flex-1 rounded-lg bg-slate-700/50 px-4 py-3 text-sm font-semibold text-slate-400 ring-1 ring-slate-600/50 cursor-not-allowed"
            >
              Produk Habis
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>