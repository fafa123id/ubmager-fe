<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  perPage: {
    type: Number,
    default: 5,
  },
  maxPage: {
    type: Number,
    default: 1,
  },
  initialPage: {
    type: Number,
    default: 1,
  },
})

const emit = defineEmits(['page-changed'])

const currentPage = ref(props.initialPage)
const inputPage = ref(props.initialPage)

// Page navigation
const goToPage = (page) => {
  if (page >= 1 && page <= props.maxPage) {
    currentPage.value = page
    inputPage.value = page
    emit('page-changed', page)
  }
}

const previousPage = () => {
  goToPage(currentPage.value - 1)
}

const nextPage = () => {
  goToPage(currentPage.value + 1)
}

// Handle input change
const handleInputChange = () => {
  let page = parseInt(inputPage.value)
  if (page < 1) {
    page = 1
  } else if (page > props.maxPage) {
    page = props.maxPage
  }
  if (!isNaN(page)) {
    goToPage(page)
  } else {
    inputPage.value = currentPage.value
  }
}

// Handle input blur
const handleInputBlur = () => {
  if (inputPage.value === '' || isNaN(parseInt(inputPage.value))) {
    inputPage.value = currentPage.value
  }
}

// Computed for page numbers to display
const pageNumbers = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - 2)
  let end = Math.min(props.maxPage, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  if (start > 1) {
    pages.push(1)
    if (start > 2) pages.push('...')
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (end < props.maxPage) {
    if (end < props.maxPage - 1) pages.push('...')
    pages.push(props.maxPage)
  }

  return pages
})

const canGoPrevious = computed(() => currentPage.value > 1)
const canGoNext = computed(() => currentPage.value < props.maxPage)

// Watch for prop changes
watch(
  () => props.initialPage,
  (newPage) => {
    if (newPage !== currentPage.value) {
      currentPage.value = newPage
      inputPage.value = newPage
    }
  }
)

watch(
  () => props.maxPage,
  (newMaxPage) => {
    if (currentPage.value > newMaxPage) {
      currentPage.value = newMaxPage
      inputPage.value = newMaxPage
    }
  }
)
</script>

<template>
  <div class="flex flex-col items-center gap-4 w-full px-2">
    <!-- Pagination Controls - Responsive dengan flex wrap -->
    <div class="flex flex-wrap items-center justify-center gap-1 sm:gap-2 w-full">
      <!-- Previous Button -->
      <button
        :disabled="!canGoPrevious"
        @click="previousPage"
        class="rounded-lg border border-white/15 bg-white/5 px-2 sm:px-3 py-2 text-sm font-medium text-slate-200 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 flex-shrink-0"
        :class="
          canGoPrevious
            ? 'hover:bg-white/10 hover:border-white/25 hover:text-white'
            : ''
        "
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Page Numbers - Responsive -->
      <div class="flex flex-wrap items-center justify-center gap-1 sm:gap-1">
        <button
          v-for="(page, index) in pageNumbers"
          :key="index"
          :disabled="page === '...'"
          @click="page !== '...' && goToPage(page)"
          class="rounded-lg border border-white/15 bg-white/5 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-slate-200 transition-all duration-200 flex-shrink-0"
          :class="{
            'hover:bg-white/10 hover:border-white/25 hover:text-white':
              page !== '...' && page !== currentPage,
            'border border-sky-400/50 bg-gradient-to-r from-sky-500/20 to-indigo-600/20 font-bold text-white ring-1 ring-sky-400/30':
              page === currentPage,
            'cursor-default text-slate-400 bg-transparent border-transparent px-1':
              page === '...',
          }"
        >
          {{ page }}
        </button>
      </div>

      <!-- Next Button -->
      <button
        :disabled="!canGoNext"
        @click="nextPage"
        class="rounded-lg border border-white/15 bg-white/5 px-2 sm:px-3 py-2 text-sm font-medium text-slate-200 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 flex-shrink-0"
        :class="
          canGoNext
            ? 'hover:bg-white/10 hover:border-white/25 hover:text-white'
            : ''
        "
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Page Info & Input - Responsive layout -->
    <div class="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
      <!-- Page Info -->
      <div class="text-xs text-slate-400 whitespace-nowrap">
        Halaman <span class="font-semibold text-slate-300">{{ currentPage }}</span> dari
        <span class="font-semibold text-slate-300">{{ maxPage }}</span>
      </div>

      <!-- Go to Page Input -->
      <div class="flex items-center gap-2 flex-wrap justify-center">
        <label class="text-xs text-slate-400 whitespace-nowrap">Ke halaman:</label>
        <input
          v-model.number="inputPage"
          type="number"
          min="1"
          :max="maxPage"
          @keyup.enter="handleInputChange"
          @blur="handleInputBlur"
          placeholder="1"
          class="w-14 sm:w-16 rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-sm text-slate-200 text-center transition-all duration-200 placeholder-slate-500 focus:border-sky-400/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-sky-400/30"
        />
        <button
          @click="handleInputChange"
          class="rounded-lg border border-white/15 bg-white/5 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-slate-200 transition-all duration-200 hover:bg-white/10 hover:border-white/25 hover:text-white whitespace-nowrap"
        >
          Go
        </button>
      </div>
    </div>
  </div>
</template>