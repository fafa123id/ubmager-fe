<script setup>
import { ref, computed, onMounted, watch } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  productId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const {
  ratings,
  loading,
  error,
  maxPage,
  currentPage,
  selectedRating,
  initialize,
  fetchRatings,
  fetchMaxPage,
  setRatingFilter,
  reset,
} = useProductRating();

// Rating filter buttons (1-5)
const ratingOptions = computed(() => [
  { label: "Semua", value: null },
  { label: "⭐".repeat(5), value: 5 },
  { label: "⭐".repeat(4), value: 4 },
  { label: "⭐".repeat(3), value: 3 },
  { label: "⭐".repeat(2), value: 2 },
  { label: "⭐".repeat(1), value: 1 },
]);

// Handle filter change
const handleFilterChange = async (ratingValue) => {
  setRatingFilter(ratingValue);
  try {
    await Promise.all([
      fetchMaxPage(props.productId, 3, ratingValue),
      fetchRatings(props.productId, 1, 3, ratingValue),
    ]);
  } catch (err) {
    console.error("Failed to filter ratings:", err);
  }
};

// Handle page change
const handlePageChange = async (newPage) => {
  try {
    await fetchRatings(props.productId, newPage, 3, selectedRating.value);
  } catch (err) {
    console.error("Failed to fetch ratings:", err);
  }
};

// Handle close modal
const handleClose = () => {
  reset();
  emit("close");
};

// Watch for modal close
watch(
  () => props.show,
  (newVal) => {
    if (!newVal) {
      reset();
    }
    if (newVal) {
      initialize(props.productId, 1, 3, null).catch((err) => {
        console.error("Failed to initialize ratings on show:", err);
      });
    }
  }
);
</script>

<template>
  <MyModal
    id="product-rating-modal"
    :show="show"
    maxWidth="2xl"
    @close="handleClose"
    :class="'bg-slate-900/80 backdrop-blur-sm text-slate-200 rounded-2xl overflow-auto'"
  >
    <!-- Modal Header -->
    <div class="p-6">
      <div class="border-b border-white/10 pb-4 mb-4">
        <h2 class="text-xl font-bold text-slate-100">Ulasan Produk</h2>
        <p class="text-sm text-slate-400">Baca ulasan dari pembeli lainnya</p>
      </div>

      <!-- Rating Filter Buttons -->
      <div class="space-y-3 mb-6">
        <p class="text-sm font-semibold text-slate-300">Filter Rating</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="option in ratingOptions"
            :key="option.value"
            @click="handleFilterChange(option.value)"
            :class="{
              'rounded-lg border border-sky-400/50 bg-gradient-to-r from-sky-500/20 to-indigo-600/20 px-3 py-2 text-sm font-semibold text-white ring-1 ring-sky-400/30 transition-all duration-200':
                selectedRating === option.value,
              'rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-white/10 hover:border-white/25':
                selectedRating !== option.value,
            }"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && ratings.length === 0" class="space-y-4">
        <div
          v-for="i in 3"
          :key="i"
          class="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
        >
          <div
            class="h-4 w-1/3 rounded bg-slate-700/50 mb-2 animate-pulse"
          ></div>
          <div
            class="h-3 w-full rounded bg-slate-700/50 mb-2 animate-pulse"
          ></div>
          <div class="h-3 w-5/6 rounded bg-slate-700/50 animate-pulse"></div>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error && ratings.length === 0"
        class="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center"
      >
        <svg
          class="h-8 w-8 mx-auto mb-2 text-red-400"
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
        <p class="text-red-300 text-sm">{{ error }}</p>
      </div>

      <!-- Ratings List -->
      <div v-else-if="ratings.length > 0" class="space-y-3">
        <div
          v-for="rating in ratings"
          :key="rating.id"
          class="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition-all duration-200 hover:border-white/20 hover:bg-white/10"
        >
          <!-- Header: Avatar, Name, Rating, Date -->
          <div class="flex gap-3 mb-3">
            <!-- Avatar -->
            <img
              v-if="rating.user?.image"
              :src="rating.user.image"
              :alt="rating.user?.name"
              class="h-10 w-10 rounded-full object-cover ring-1 ring-white/10"
            />
            <div
              v-else
              class="h-10 w-10 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 ring-1 ring-white/10"
            ></div>

            <!-- Info -->
            <div class="flex-1">
              <div class="flex items-center justify-between gap-2">
                <div>
                  <p class="font-semibold text-slate-200">
                    {{ rating.user?.name || "Anonymous" }}
                  </p>
                  <p class="text-xs text-slate-500">
                    {{
                      new Date(rating.created_at).toLocaleDateString("id-ID")
                    }}
                  </p>
                </div>

                <!-- Star Rating -->
                <div class="flex gap-0.5">
                  <svg
                    v-for="i in 5"
                    :key="i"
                    class="h-4 w-4"
                    :class="
                      i <= rating.rating ? 'text-amber-400' : 'text-slate-600'
                    "
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Comment -->
          <p
            v-if="rating.comment"
            class="text-sm text-slate-300 mb-3 leading-relaxed"
          >
            {{ rating.comment }}
          </p>

          <!-- Image (if available) -->
          <div
            v-if="rating.image"
            class="rounded-lg overflow-hidden bg-slate-800"
          >
            <img
              :src="rating.image"
              :alt="rating.user?.name"
              class="w-full h-auto object-cover max-h-48"
            />
          </div>
          <div
            v-else
            class="rounded-lg bg-slate-800/50 h-24 flex items-center justify-center"
          >
            <svg
              class="h-8 w-8 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="rounded-xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl"
      >
        <svg
          class="h-12 w-12 mx-auto mb-3 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z"
          />
        </svg>
        <p class="text-slate-300 font-medium">Belum ada ulasan</p>
        <p class="text-slate-500 text-sm">
          Jadilah yang pertama memberi ulasan!
        </p>
      </div>

      <!-- Pagination -->
      <div
        v-if="ratings.length > 0"
        class="mt-6 pt-4 border-t border-white/10 flex justify-center"
      >
        <div class="flex items-center gap-2">
          <button
            :disabled="currentPage <= 1"
            @click="handlePageChange(currentPage - 1)"
            class="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 hover:border-white/25"
          >
            Prev
          </button>

          <div class="flex items-center gap-1">
            <button
              v-for="page in Math.min(3, maxPage)"
              :key="page"
              @click="handlePageChange(page)"
              :class="{
                'rounded-lg border border-sky-400/50 bg-gradient-to-r from-sky-500/20 to-indigo-600/20 px-3 py-2 text-sm font-semibold text-white ring-1 ring-sky-400/30':
                  page === currentPage,
                'rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 transition-all duration-200 hover:bg-white/10 hover:border-white/25':
                  page !== currentPage,
              }"
            >
              {{ page }}
            </button>
          </div>

          <button
            :disabled="currentPage >= maxPage"
            @click="handlePageChange(currentPage + 1)"
            class="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 hover:border-white/25"
          >
            Next
          </button>

          <span class="text-xs text-slate-400 ml-2"
            >{{ currentPage }} / {{ maxPage }}</span
          >
        </div>
      </div>

      <!-- Close Button -->
      <div class="mt-6 pt-4 border-t border-white/10 flex justify-end">
        <button
          @click="handleClose"
          class="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition-all duration-200 hover:bg-white/10 hover:border-white/25"
        >
          Tutup
        </button>
      </div>
    </div>
  </MyModal>
</template>
