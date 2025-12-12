<script setup>
import { computed, onMounted } from 'vue'

const emit = defineEmits(['filter-changed'])

const { 
  types, 
  selectedTypes, 
  categories, 
  selectedCategories,
  loadingTypes,
  loadingCategories,
  toggleType,
  toggleCategory,
  initialize,
} = useProductFilter()

const isTypeSelected = computed((type) => {
  return (type) => selectedTypes.value.includes(type)
})

const isCategorySelected = computed((category) => {
  return (category) => selectedCategories.value.includes(category)
})

const handleToggleType = async (type) => {
  await toggleType(type)
  emit('filter-changed')
}

const handleToggleCategory = (category) => {
  toggleCategory(category)
  emit('filter-changed')
}

onMounted(async () => {
  await initialize()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Type Filter Section -->
    <div>
      <h3 class="mb-3 text-sm font-semibold text-slate-200">Tipe Produk</h3>
      <div v-if="loadingTypes" class="flex flex-wrap gap-2">
        <div v-for="i in 3" :key="i" class="h-8 w-20 rounded-lg bg-slate-700/50 animate-pulse"></div>
      </div>
      <div v-else class="flex flex-wrap gap-2">
        <button
          v-for="type in types"
          :key="type"
          @click="handleToggleType(type)"
          :class="{
            'rounded-lg border border-sky-400/50 bg-gradient-to-r from-sky-500/20 to-indigo-600/20 px-3 py-2 text-sm font-semibold text-white ring-1 ring-sky-400/30 transition-all duration-200':
              selectedTypes.includes(type),
            'rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-white/10 hover:border-white/25':
              !selectedTypes.includes(type),
          }"
        >
          {{ type }}
        </button>
      </div>
    </div>

    <!-- Category Filter Section -->
    <div v-if="categories.length > 0">
      <h3 class="mb-3 text-sm font-semibold text-slate-200">Kategori</h3>
      <div v-if="loadingCategories" class="flex flex-wrap gap-2">
        <div v-for="i in 3" :key="i" class="h-8 w-20 rounded-lg bg-slate-700/50 animate-pulse"></div>
      </div>
      <div v-else class="flex flex-wrap gap-2">
        <button
          v-for="category in categories"
          :key="category"
          @click="handleToggleCategory(category)"
          :class="{
            'rounded-lg border border-emerald-400/50 bg-gradient-to-r from-emerald-500/20 to-teal-600/20 px-3 py-2 text-sm font-semibold text-white ring-1 ring-emerald-400/30 transition-all duration-200':
              selectedCategories.includes(category),
            'rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-white/10 hover:border-white/25':
              !selectedCategories.includes(category),
          }"
        >
          {{ category }}
        </button>
      </div>
    </div>
  </div>
</template>