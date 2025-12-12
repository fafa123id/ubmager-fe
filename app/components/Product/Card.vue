<script setup>
import { computed } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true,
    // Structure based on the provided data:
    // id, name, type, category, description, quantity, price,
    // status, owner, image1, image2, image3, rating, created_at, updated_at
  },
})

const emit = defineEmits(['click', 'add-to-cart', 'view-details'])

// Computed properties for formatting and display
const primaryImage = computed(() => props.product.image1)
const formattedPrice = computed(() => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(props.product.price)
})

const ratingPercentage = computed(() => {
  return props.product.rating ? (props.product.rating / 5) * 100 : 0
})

const isAvailable = computed(() => props.product.quantity > 0)

const handleViewDetails = () => {
  emit('view-details', props.product.id)
}

</script>

<template>
  <div
    class="reveal group relative rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/60 to-slate-800/40 p-4 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:shadow-sky-500/10"
    @click="handleViewDetails"
  >
    <!-- Status Badge -->
    <div class="absolute top-3 right-3 z-10 flex gap-2">
      <span
        v-if="!isAvailable"
        class="rounded-md bg-red-500/20 px-2 py-1 text-[11px] font-semibold text-red-300 ring-1 ring-red-500/30"
      >
        Sold Out
      </span>
      <span
        v-else-if="product.quantity < 5"
        class="rounded-md bg-amber-500/20 px-2 py-1 text-[11px] font-semibold text-amber-300 ring-1 ring-amber-500/30"
      >
        Limited
      </span>
    </div>

    <!-- Image Container -->
    <div class="relative mb-4 overflow-hidden rounded-xl bg-slate-800">
      <img
        v-if="primaryImage"
        :src="primaryImage"
        :alt="product.name"
        class="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div v-else class="h-48 w-full bg-gradient-to-br from-slate-700 to-slate-800"></div>

      <!-- Category Tag -->
      <div
        v-if="product.type"
        class="absolute bottom-2 left-2 rounded-lg bg-black/40 px-2 py-1 text-[11px] font-semibold text-sky-300 backdrop-blur-sm ring-1 ring-sky-400/20"
      >
        {{ product.type }}
      </div>
    </div>

    <!-- Content -->
    <div class="flex flex-col gap-2">
      <!-- Product Category -->
      <div v-if="product.category" class="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
        {{ product.category }}
      </div>

      <!-- Product Name -->
      <h3 class="line-clamp-2 text-sm font-bold text-slate-100 group-hover:text-white transition-colors">
        {{ product.name }}
      </h3>

      <!-- Description -->
      <p v-if="product.description" class="line-clamp-2 text-xs text-slate-400">
        {{ product.description }}
      </p>

      <!-- Rating and Owner -->
      <div class="flex items-center justify-between gap-2 border-t border-white/5 pt-2">
        <!-- Rating -->
        <div v-if="product.rating" class="flex items-center gap-1">
          <div class="flex gap-0.5">
            <svg
              v-for="i in 5"
              :key="i"
              class="h-3 w-3"
              :class="i <= Math.round(product.rating) ? 'text-amber-400' : 'text-slate-600'"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
          </div>
          <span class="text-xs text-slate-400">({{ product.rating.toFixed(1) }})</span>
        </div>

        <!-- Owner -->
        <div v-if="product.owner" class="text-[10px] text-slate-400">
          by <span class="font-semibold text-slate-300">{{ product.owner }}</span>
        </div>
      </div>

      <!-- Price and Action -->
      <div class="flex items-center justify-between gap-2 border-t border-white/5 pt-2">
        <!-- Price -->
        <div class="flex flex-col">
          <span class="text-xs text-slate-500">Harga</span>
          <span class="text-lg font-bold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
            {{ formattedPrice }}
          </span>
        </div>

        <!-- Action Button -->
        <div
          v-if="isAvailable"
          class="rounded-lg bg-gradient-to-r from-sky-500/90 to-indigo-600/90 px-3 py-2 text-xs font-semibold text-white ring-1 ring-white/20"
        >
          Tersedia
        </div>

        <div
          v-else
          class="rounded-lg bg-slate-700/50 px-3 py-2 text-xs font-semibold text-slate-400 ring-1 ring-slate-600/50"
        >
          Habis
        </div>
      </div>

      <!-- Stock Info -->
      <div v-if="isAvailable" class="text-[10px] text-slate-500">
        Stok: <span class="font-semibold text-emerald-400">{{ product.quantity }}</span>
      </div>
    </div>
  </div>
</template>