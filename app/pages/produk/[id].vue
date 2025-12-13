<script setup>
import { ref, onMounted, computed } from "vue";

const route = useRoute();
const {
  getProductById,
  loading,
  error,
  getRatingCountByProductId,
  getIsFavoriteByProductId,
} = useProduct();
const { postFavorite, deleteFavorite } = useFavorites();
const product = ref(null);
const selectedImage = ref(0);
const prevImage = ref(0);
const showRatingModal = ref(false);
const loadingProcess = ref(false);
const isAvailable = computed(() => {
  return product.value && product.value.quantity > 0;
});

const formattedPrice = computed(() => {
  if (!product.value) return "";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(product.value.price);
});

const productImages = computed(() => {
  if (!product.value) return [];
  const images = [];
  if (product.value.image1) images.push(product.value.image1);
  if (product.value.image2) images.push(product.value.image2);
  if (product.value.image3) images.push(product.value.image3);
  return images;
});
const is_favorited = ref(false);
const currentImage = computed(() => {
  return productImages.value[selectedImage.value] || productImages.value[0];
});

// Determine animation direction
const isMovingForward = computed(() => {
  return selectedImage.value > prevImage.value;
});

const selectImage = (idx) => {
  prevImage.value = selectedImage.value;
  selectedImage.value = idx;
};
const sellerRating = ref(null);
const handleAddToCart = () => {
  if (!isAvailable.value) {
    useSwal().showInfo("Maaf, produk ini sedang habis.");
    return;
  }
  useSwal().showInfo("Fitur cart sedang dikembangkan");
};

const goBack = () => {
  navigateTo("/produk");
};
const proccessDeleteFavorite = async (productId) => {
  try {
    await deleteFavorite(productId);
    useSwal().showSuccess("Produk berhasil dihapus dari favorit.");
    is_favorited.value = false;
  } catch (err) {
    console.error("Failed to remove product from favorites:", err);
    useSwal().showError("Gagal menghapus produk dari favorit.");
  }
};
const ratingCount = ref(null);
onMounted(async () => {
  try {
    loadingProcess.value = true;
    const productId = route.params.id;
    const data = await getProductById(productId);
    product.value = data.data || data;

    // Jika product tidak available/tidak ada, redirect
    if (!product.value || !product.value.id) {
      useSwal().showInfo("Produk tidak ditemukan.");
      goBack();
      return;
    }
    if (!useAuth().isLoggedIn.value === false) {
      const fav = await getIsFavoriteByProductId(productId);
      is_favorited.value = fav;
    }
    loadingProcess.value = false;
    ratingCount.value = await getRatingCountByProductId(product.value.id);
    sellerRating.value = await useProductRating().getSellerRating(
      product.value.owner.id
    );
  } catch (err) {
    console.error("Failed to fetch product detail:", err);
    useSwal().showError("Gagal memuat detail produk.");
    goBack();
  }
});
const addToFavorite = async (productId) => {
  try {
    if (useAuth().user.value === null) {
      useSwal().showInfo("Silakan masuk untuk menambahkan favorit.");
      navigateTo("/auth/login?next=" + encodeURIComponent(route.fullPath));
      return;
    }
    loadingProcess.value = true;
    await postFavorite(productId);
    useSwal().showSuccess("Produk berhasil ditambahkan ke favorit.");
    is_favorited.value = true;
  } catch (err) {
    console.error("Failed to add product to favorites:", err);
    useSwal().showError("Gagal menambahkan produk ke favorit.");
  } finally {
    loadingProcess.value = false;
  }
};
</script>

<template>
  <div class="relative min-h-dvh text-slate-100 overflow-hidden">
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

    <!-- Header with Back Button -->
    <section class="relative mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
      <button
        @click="goBack"
        class="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition-all duration-200 hover:bg-white/10 hover:border-white/25"
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
      </button>
    </section>

    <!-- Loading State -->
    <section
      v-if="loading"
      class="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <div class="grid gap-8 lg:grid-cols-2">
        <!-- Image Skeleton -->
        <div
          class="rounded-2xl border border-white/10 bg-slate-900/60 aspect-square animate-pulse"
        ></div>

        <!-- Content Skeleton -->
        <div class="space-y-6">
          <div class="h-8 w-3/4 rounded-lg bg-slate-700/50 animate-pulse"></div>
          <div class="space-y-2">
            <div
              class="h-4 w-full rounded-lg bg-slate-700/50 animate-pulse"
            ></div>
            <div
              class="h-4 w-5/6 rounded-lg bg-slate-700/50 animate-pulse"
            ></div>
          </div>
          <div
            class="h-10 w-1/3 rounded-lg bg-slate-700/50 animate-pulse"
          ></div>
        </div>
      </div>
    </section>

    <!-- Error State -->
    <section
      v-else-if="error && !product"
      class="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <div
        class="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center"
      >
        <svg
          class="h-12 w-12 mx-auto mb-3 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
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
    <section
      v-else-if="product"
      class="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <div class="grid gap-8 lg:grid-cols-2">
        <!-- Image Section -->
        <div class="space-y-4">
          <!-- Main Image with Elegant Animation -->
          <div
            class="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl overflow-hidden relative group"
          >
            <!-- Image Container with Fixed Aspect -->
            <div
              class="relative w-full aspect-square overflow-hidden rounded-xl bg-slate-800"
            >
              <!-- Transition Wrapper with Multiple Animation Options -->
              <Transition
                :name="
                  isMovingForward ? 'image-slide-left' : 'image-slide-right'
                "
                mode="out-in"
              >
                <img
                  :key="selectedImage"
                  :src="currentImage"
                  :alt="product.name"
                  class="absolute inset-0 w-full h-full object-cover transition-all duration-500"
                />
              </Transition>
            </div>

            <!-- Loading Indicator for Image -->
            <div
              v-if="!currentImage"
              class="absolute inset-0 flex items-center justify-center bg-slate-800/50"
            >
              <div
                class="h-8 w-8 animate-spin rounded-full border-2 border-sky-400 border-t-transparent"
              ></div>
            </div>
          </div>

          <!-- Thumbnail Gallery with Smooth Hover & Selection Animation -->
          <div v-if="productImages.length > 1" class="flex gap-3">
            <button
              v-for="(img, idx) in productImages"
              :key="idx"
              @click="selectImage(idx)"
              class="relative rounded-lg border-2 overflow-hidden transition-all duration-300 transform hover:scale-110"
              :class="
                selectedImage === idx
                  ? 'border-sky-400/50 ring-2 ring-sky-400/20 scale-105'
                  : 'border-white/15 hover:border-white/25'
              "
            >
              <img
                :src="img"
                :alt="`${product.name} - ${idx + 1}`"
                class="w-20 h-20 object-cover transition-all duration-300"
                :class="
                  selectedImage === idx
                    ? 'brightness-125'
                    : 'group-hover:brightness-110'
                "
              />

              <!-- Active Indicator Overlay -->
              <div
                v-if="selectedImage === idx"
                class="absolute inset-0 bg-sky-500/20 pointer-events-none transition-all duration-300"
              ></div>
            </button>
          </div>

          <!-- Image Counter -->
          <div v-if="productImages.length > 1" class="flex justify-center">
            <span class="text-xs text-slate-400 transition-all duration-300">
              {{ selectedImage + 1 }} dari {{ productImages.length }}
            </span>
          </div>
        </div>

        <!-- Details Section -->
        <div class="space-y-6">
          <!-- Header Info -->
          <div>
            <div class="flex items-start justify-between gap-4 mb-3">
              <div>
                <div class="inline-block mb-2">
                  <span
                    class="rounded-md bg-sky-500/20 px-3 py-1 text-xs font-semibold text-sky-300 ring-1 ring-sky-400/30"
                  >
                    {{ product.type }}
                  </span>
                </div>
                <h1 class="text-3xl font-bold text-slate-100">
                  {{ product.name }}
                </h1>
              </div>

              <!-- Status Badge -->
              <div
                v-if="!isAvailable"
                class="rounded-md bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-300 ring-1 ring-red-500/30 whitespace-nowrap"
              >
                Sold Out
              </div>
              <div
                v-else-if="product.quantity < 5"
                class="rounded-md bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300 ring-1 ring-amber-500/30 whitespace-nowrap"
              >
                Limited Stock
              </div>
            </div>

            <!-- Category -->
            <p class="text-sm text-slate-400 mb-2">
              Kategori:
              <span class="font-semibold text-slate-300">{{
                product.category
              }}</span>
            </p>

            <!-- Rating and Owner -->
            <div class="flex items-center gap-4 flex-wrap">
              <div v-if="product.rating" class="flex items-center gap-2">
                <div class="flex gap-0.5">
                  <svg
                    v-for="i in 5"
                    :key="i"
                    class="h-4 w-4"
                    :class="
                      i <= Math.round(product.rating)
                        ? 'text-amber-400'
                        : 'text-slate-600'
                    "
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                </div>
                <span class="text-sm text-slate-400"
                  >({{ product.rating.toFixed(1) }}) dari
                  {{ ratingCount }} ulasan</span
                >
                <button
                  @click="showRatingModal = true"
                  class="ml-2 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors underline"
                >
                  Lihat Ulasan
                </button>
              </div>
              <!-- Seller Information - Elegant 1-line Box -->
              <div
                v-if="product.owner !== null"
                class="rounded-xl border border-white/10 bg-gradient-to-r from-white/5 to-white/5 p-3 sm:p-4 backdrop-blur-xl hover:border-white/20 hover:bg-gradient-to-r hover:from-white/8 hover:to-white/8 transition-all duration-300"
              >
                <div class="flex items-center justify-between gap-3 sm:gap-4">
                  <!-- Left: Avatar & Name -->
                  <div class="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <!-- Avatar -->
                    <div class="flex-shrink-0">
                      <img
                        v-if="product.owner.image"
                        :src="product.owner.image"
                        :alt="product.owner.name"
                        class="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover ring-2 ring-sky-400/30 hover:ring-sky-400/50 transition-all"
                      />
                      <div
                        v-else
                        class="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 ring-2 ring-sky-400/30 flex items-center justify-center flex-shrink-0"
                      >
                        <svg
                          class="h-6 w-6 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                          />
                        </svg>
                      </div>
                    </div>

                    <!-- Name & Rating -->
                    <div class="min-w-0 flex-1">
                      <p
                        class="text-sm sm:text-base font-semibold text-slate-100 truncate"
                      >
                        {{ product.owner.name }}
                      </p>
                      <div
                        v-if="sellerRating !== null"
                        class="flex items-center gap-1 mt-0.5"
                      >
                        <div class="flex gap-0.5">
                          <svg
                            v-for="i in 5"
                            :key="i"
                            class="h-3 w-3 sm:h-3.5 sm:w-3.5"
                            :class="
                              i <= Math.round(sellerRating)
                                ? 'text-amber-400'
                                : 'text-slate-600'
                            "
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                            />
                          </svg>
                        </div>
                        <span class="text-xs sm:text-sm text-slate-400">
                          {{ sellerRating.toFixed(1) }}
                        </span>
                      </div>
                      <div v-else class="text-sm text-slate-500">
                        <div class="flex items-center gap-2">
                          <svg
                            class="h-4 w-4 animate-spin text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              class="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              stroke-width="4"
                            ></circle>
                            <path
                              class="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span>Memuat rating...</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Right: Label & CTA -->
                  <div class="flex flex-col items-end gap-1 flex-shrink-0">
                    <span
                      class="text-xs text-slate-500 font-medium uppercase tracking-wide"
                    >
                      Penjual
                    </span>
                    <button
                      class="text-xs sm:text-sm font-semibold px-3 py-1 rounded-lg bg-gradient-to-r from-sky-500/20 to-indigo-600/20 text-sky-300 border border-sky-400/30 hover:from-sky-500/30 hover:to-indigo-600/30 hover:border-sky-400/50 transition-all duration-200"
                      @click="
                        useSwal().showInfo(
                          'Fitur kunjungi penjual sedang dikembangkan'
                        )
                      "
                    >
                      Kunjungi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Price Section -->
          <div
            class="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
          >
            <p class="text-xs text-slate-400 mb-2">Harga</p>
            <p
              class="text-4xl font-bold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent"
            >
              {{ formattedPrice }}
            </p>
          </div>

          <!-- Stock Info -->
          <div
            class="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
          >
            <p class="text-sm text-slate-400 mb-2">Ketersediaan Stok</p>
            <div v-if="isAvailable" class="flex items-center gap-2">
              <span
                class="h-3 w-3 rounded-full bg-emerald-400 animate-pulse"
              ></span>
              <span class="font-semibold text-slate-200"
                >{{ product.quantity }} barang tersedia</span
              >
            </div>
            <div v-else class="flex items-center gap-2">
              <span class="h-3 w-3 rounded-full bg-red-400"></span>
              <span class="font-semibold text-slate-200">Sedang habis</span>
            </div>
          </div>

          <!-- Description -->
          <div
            v-if="product.description"
            class="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
          >
            <p class="text-sm text-slate-400 mb-2">Deskripsi</p>
            <p class="text-slate-300 leading-relaxed">
              {{ product.description }}
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4">
            <button
              v-if="isAvailable"
              @click="handleAddToCart"
              class="flex-1 rounded-lg bg-gradient-to-r from-sky-500/90 to-indigo-600/90 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/20 transition-all duration-200 hover:from-sky-500 hover:to-indigo-600 hover:ring-white/30 active:scale-95"
            >
              <svg
                class="h-4 w-4 inline mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M7 4V3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1h4a1 1 0 0 1 0 2h-1.06l-.736 14.736A2 2 0 0 1 15.21 22H8.79a2 2 0 0 1-1.994-1.864L6.06 6H5a1 1 0 0 1 0-2h2zm2 2h6v11H9V6z"
                />
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

            <button
              v-if="useAuth().user.value && !is_favorited"
              @click="addToFavorite(product.id)"
              :disabled="loadingProcess"
              :class="loadingProcess ? 'opacity-50 cursor-not-allowed' : ''"
              class="rounded-lg border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 transition-all duration-200 hover:bg-white/10 hover:border-white/25"
            >
              Tambah ke Favorit
            </button>
            <button
              v-else-if="useAuth().user.value && is_favorited"
              @click="proccessDeleteFavorite(product.id)"
              :disabled="loadingProcess"
              :class="loadingProcess ? 'opacity-50 cursor-not-allowed' : ''"
              class="rounded-lg border border-sky-400/50 bg-sky-500/20 px-6 py-3 text-sm font-semibold text-sky-300"
            >
              Produk telah ada di Favorit
            </button>
            <NuxtLink
              v-else
              :to="`/auth/login/?next=${encodeURIComponent(route.fullPath)}`"
              class="rounded-lg border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 transition-all duration-200 hover:bg-white/10 hover:border-white/25"
              >Masuk untuk menambahkan ke Favorit</NuxtLink
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Rating Modal - Only render when product exists -->
    <ProductRatingModal
      v-if="product"
      :show="showRatingModal"
      :productId="product.id"
      @close="showRatingModal = false"
    />
  </div>
</template>

<style scoped>
/* Slide Left Animation */
.image-slide-left-enter-active,
.image-slide-left-leave-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.image-slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}

.image-slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px) scale(0.95);
}

/* Slide Right Animation */
.image-slide-right-enter-active,
.image-slide-right-leave-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.image-slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px) scale(0.95);
}

.image-slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}
</style>
