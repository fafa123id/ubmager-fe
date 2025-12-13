<!-- File: g:\FIle Coding\ubmager-fe\app\components\Product\Favorites.vue -->

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useFavorites } from "@/composables/useFavorites";

const props = defineProps({
  perPage: {
    type: Number,
    default: 5,
  },
});

const emit = defineEmits(["view-product", "add-to-cart"]);
const route = useRoute();
const {
  favorites,
  loading,
  error,
  maxPage,
  currentPage,
  initialize: initializeFavorites,
  loadNextPage: loadNextFavoritesPage,
  searchFavorites,
} = useFavorites();

// Search state
const localSearch = ref("");
const debounceTimer = ref(null);
const favoritesScroll = ref(null);
let favoritesObserver = null;

/**
 * Setup intersection observer untuk infinite scroll horizontal
 */
const setupInfiniteScroll = () => {
  if (favoritesObserver) {
    favoritesObserver.disconnect();
  }

  favoritesObserver = new IntersectionObserver(
    async (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !loading.value) {
        if (currentPage.value < maxPage.value) {
          try {
            await loadNextFavoritesPage();
            setTimeout(() => setupInfiniteScroll(), 100);
          } catch (err) {
            console.error("Failed to load next favorites page:", err);
          }
        }
      }
    },
    { threshold: 0.5 }
  );

  const sentinel = favoritesScroll.value?.querySelector(
    "[data-favorites-sentinel]"
  );
  if (sentinel) {
    favoritesObserver.observe(sentinel);
  }
};

/**
 * Handle search dengan debounce
 */
const handleSearch = async () => {
  try {
    await searchFavorites(localSearch.value);
    if (favoritesScroll.value) {
      favoritesScroll.value.scrollLeft = 0;
    }
    setTimeout(() => setupInfiniteScroll(), 100);
  } catch (err) {
    console.error("Failed to search favorites:", err);
  }
};

/**
 * Debounced search input - emit setiap 500ms setelah user berhenti mengetik
 */
const handleSearchInput = () => {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value);
  }

  debounceTimer.value = setTimeout(() => {
    handleSearch();
  }, 500);
};

/**
 * Handle clear search
 */
const handleClear = () => {
  localSearch.value = "";
  handleSearch();
};

/**
 * Handle Enter key
 */
const handleKeyDown = (e) => {
  if (e.key === "Enter") {
    clearTimeout(debounceTimer.value);
    handleSearch();
  }
};

/**
 * Scroll handlers
 */
const scrollLeft = () => {
  if (favoritesScroll.value) {
    favoritesScroll.value.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  }
};

const scrollRight = () => {
  if (favoritesScroll.value) {
    favoritesScroll.value.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  }
};

/**
 * Handle view product
 */
const handleViewProduct = (productId) => {
  emit("view-product", productId);
};

/**
 * Handle add to cart
 */
const handleAddToCart = (productId) => {
  emit("add-to-cart", productId);
};

onMounted(async () => {
  try {
    if (useAuth().user.value === null) {
      return;
    }
    await initializeFavorites(props.perPage, "");
    setTimeout(() => setupInfiniteScroll(), 100);
  } catch (err) {
    console.error("Failed to initialize favorites:", err);
  }
});

onUnmounted(() => {
  if (favoritesObserver) {
    favoritesObserver.disconnect();
  }
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value);
  }
});
</script>

<template>
  <section class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-slate-100 mb-1">Produk Favorit</h2>
          <p class="text-sm text-slate-400">
            Koleksi produk pilihan Anda yang disimpan
          </p>
        </div>
      </div>

      <!-- Search Favorites - Miripkan dengan ProductSearch -->
      <div v-if="useAuth().user.value" class="relative">
        <div class="relative flex items-center">
          <!-- Search Icon -->
          <svg
            class="absolute left-3 h-5 w-5 text-slate-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <!-- Input -->
          <input
            v-model="localSearch"
            type="text"
            placeholder="Cari produk favorit..."
            @input="handleSearchInput"
            @keydown="handleKeyDown"
            class="w-full rounded-lg border border-white/15 bg-white/5 py-2.5 pl-10 pr-10 text-sm text-slate-100 placeholder-slate-500 transition-all duration-200 hover:border-white/25 hover:bg-white/10 focus:border-sky-400/50 focus:bg-white/5 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
          />

          <!-- Clear Button -->
          <button
            v-if="localSearch.length > 0"
            @click="handleClear"
            class="absolute right-3 inline-flex items-center justify-center rounded-md p-1 text-slate-400 transition-colors hover:text-slate-200"
          >
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
              />
            </svg>
          </button>
        </div>

        <!-- Help Text -->
        <p v-if="localSearch.length > 0" class="mt-2 text-xs text-slate-500">
          Tekan <span class="font-semibold text-slate-400">Enter</span> atau
          tunggu untuk cari
        </p>
      </div>

      <!-- Horizontal Scroll Container with Controls -->
      <div class="space-y-4">
        <!-- Loading State -->
        <div
          v-if="loading && favorites.length === 0"
          class="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
        >
          <div
            v-for="i in perPage"
            :key="i"
            class="flex-shrink-0 w-52 h-96 rounded-2xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-xl animate-pulse snap-center"
          >
            <div
              class="mb-3 aspect-square w-full rounded-lg bg-slate-800/50"
            ></div>
            <div class="h-2 w-2/3 rounded bg-slate-700/50 mb-2"></div>
            <div class="h-2 w-1/2 rounded bg-slate-700/50"></div>
          </div>
        </div>

        <!-- Error State -->
        <div
          v-else-if="error && favorites.length === 0"
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
          <p class="text-red-300">{{ error }}</p>
        </div>

        <!-- Favorites Horizontal Scroll with Navigation Buttons -->
        <div v-else-if="favorites.length > 0" class="relative group">
          <!-- Left Scroll Button (Desktop Only) -->
          <button
            @click="scrollLeft"
            class="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-sky-500/20 to-indigo-600/20 border border-sky-400/30 text-sky-300 hover:from-sky-500/30 hover:to-indigo-600/30 hover:border-sky-400/50 transition-all duration-300 group-hover:scale-110 active:scale-95"
            :disabled="loading"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <!-- Scroll Container -->
          <div
            ref="favoritesScroll"
            class="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth hide-scrollbar"
          >
            <!-- Cards -->
            <div
              v-for="fav in favorites"
              :key="`${fav.user_id}-${fav.product_id}`"
              class="flex-shrink-0 w-52 snap-center h-full"
            >
              <div class="h-full flex flex-col">
                <ProductCard
                  :product="fav.product"
                  @view-details="handleViewProduct"
                  @add-to-cart="handleAddToCart"
                />
              </div>
            </div>

            <!-- Sentinel for infinite scroll -->
            <div data-favorites-sentinel class="flex-shrink-0 w-0 h-0" />

            <!-- Loading More Indicator -->
            <div
              v-if="loading && favorites.length > 0"
              class="flex-shrink-0 w-52 flex items-center justify-center snap-center"
            >
              <div
                class="rounded-2xl border border-white/10 bg-slate-900/60 w-full h-full flex flex-col items-center justify-center gap-3 p-4"
              >
                <div class="flex gap-2">
                  <div
                    class="h-2 w-2 rounded-full bg-sky-400 animate-bounce"
                  ></div>
                  <div
                    class="h-2 w-2 rounded-full bg-sky-400 animate-bounce"
                    style="animation-delay: 0.2s"
                  ></div>
                  <div
                    class="h-2 w-2 rounded-full bg-sky-400 animate-bounce"
                    style="animation-delay: 0.4s"
                  ></div>
                </div>
                <p class="text-xs text-slate-400 text-center">Loading...</p>
              </div>
            </div>
          </div>

          <!-- Right Scroll Button (Desktop Only) -->
          <button
            @click="scrollRight"
            class="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-sky-500/20 to-indigo-600/20 border border-sky-400/30 text-sky-300 hover:from-sky-500/30 hover:to-indigo-600/30 hover:border-sky-400/50 transition-all duration-300 group-hover:scale-110 active:scale-95"
            :disabled="loading"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
        <div
          v-else-if ="useAuth().user.value === null"
          class="rounded-2xl border border-white/10 bg-slate-900/60 p-12 text-center backdrop-blur-xl"
        >
          <svg
            class="h-16 w-16 mx-auto mb-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M5 5a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V5z"
            />
          </svg>
          <h3 class="text-lg font-semibold text-slate-200 mb-2">
            Belum ada favorit
          </h3>
          <p class="text-slate-400">
            Masuk untuk melihat favorit Anda. <NuxtLink :to="`/auth/login?next=${encodeURIComponent(route.fullPath)}`" class="text-sky-400 hover:underline">Masuk</NuxtLink>
          </p>
        </div>
        <!-- Empty State -->
        <div
          v-else
          class="rounded-2xl border border-white/10 bg-slate-900/60 p-12 text-center backdrop-blur-xl"
        >
          <svg
            class="h-16 w-16 mx-auto mb-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M5 5a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V5z"
            />
          </svg>
          <h3 class="text-lg font-semibold text-slate-200 mb-2">
            Belum ada favorit
          </h3>
          <p class="text-slate-400">
            Mulai tambahkan produk ke favorit untuk menyimpannya di sini.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Hide scrollbar tapi tetap bisa scroll */
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Smooth scroll behavior */
.scroll-smooth {
  scroll-behavior: smooth;
}
</style>
