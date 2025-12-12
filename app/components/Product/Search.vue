<script setup>
import { ref, watch } from 'vue'

const emit = defineEmits(['search-changed'])

const { searchQuery, setSearchQuery, clearSearchQuery } = useProductFilter()

const localSearch = ref('')
const debounceTimer = ref(null)

// Sync dengan searchQuery dari composable
watch(
  () => searchQuery.value,
  (newVal) => {
    localSearch.value = newVal
  },
  { immediate: true }
)

// Debounce search - emit setiap 500ms setelah user berhenti mengetik
const handleSearch = () => {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
  
  debounceTimer.value = setTimeout(() => {
    setSearchQuery(localSearch.value)
    emit('search-changed')
  }, 500)
}

const handleClear = () => {
  localSearch.value = ''
  clearSearchQuery()
  emit('search-changed')
}

const handleKeyDown = (e) => {
  // Submit on Enter
  if (e.key === 'Enter') {
    clearTimeout(debounceTimer.value)
    setSearchQuery(localSearch.value)
    emit('search-changed')
  }
}
</script>

<template>
  <div class="relative">
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
        placeholder="Cari produk, brand, atau jasa..."
        @input="handleSearch"
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
      Tekan <span class="font-semibold text-slate-400">Enter</span> atau tunggu untuk cari
    </p>
  </div>
</template>