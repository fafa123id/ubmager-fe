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

// Page navigation
const goToPage = (page) => {
  if (page >= 1 && page <= props.maxPage) {
    currentPage.value = page
    emit('page-changed', page)
  }
}

const previousPage = () => {
  goToPage(currentPage.value - 1)
}

const nextPage = () => {
  goToPage(currentPage.value + 1)
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
    }
  }
)

watch(
  () => props.maxPage,
  (newMaxPage) => {
    // Adjust current page if it exceeds new max page
    if (currentPage.value > newMaxPage) {
      currentPage.value = newMaxPage
    }
  }
)
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <!-- Pagination Controls -->
    <div class="flex items-center gap-2">
      <!-- Previous Button -->
      <button
        :disabled="!canGoPrevious"
        @click="previousPage"
        class="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
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

      <!-- Page Numbers -->
      <div class="flex items-center gap-1">
        <button
          v-for="(page, index) in pageNumbers"
          :key="index"
          :disabled="page === '...'"
          @click="page !== '...' && goToPage(page)"
          :class="{
            'rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 transition-all duration-200 hover:bg-white/10 hover:border-white/25 hover:text-white':
              page !== '...' && page !== currentPage,
            'rounded-lg border border-sky-400/50 bg-gradient-to-r from-sky-500/20 to-indigo-600/20 px-3 py-2 text-sm font-bold text-white ring-1 ring-sky-400/30':
              page === currentPage,
            'cursor-default text-slate-400': page === '...',
          }"
        >
          {{ page }}
        </button>
      </div>

      <!-- Next Button -->
      <button
        :disabled="!canGoNext"
        @click="nextPage"
        class="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
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

    <!-- Page Info -->
    <div class="text-xs text-slate-400">
      Halaman <span class="font-semibold text-slate-300">{{ currentPage }}</span> dari
      <span class="font-semibold text-slate-300">{{ maxPage }}</span>
    </div>
  </div>
</template>