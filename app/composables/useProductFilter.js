export const useProductFilter = () => {
  const nuxtApp = useNuxtApp()
  
  // Filter State
  const types = useState('product_filter_types', () => [])
  const selectedTypes = useState('product_filter_selected_types', () => [])
  const categories = useState('product_filter_categories', () => [])
  const selectedCategories = useState('product_filter_selected_categories', () => [])
  const searchQuery = useState('product_filter_search', () => '')
  const loadingTypes = useState('product_filter_loading_types', () => false)
  const loadingCategories = useState('product_filter_loading_categories', () => false)
  const error = useState('product_filter_error', () => null)
  
  /**
   * Fetch semua product types
   * @returns {Promise<Array>} Array of types
   */
  const fetchTypes = async () => {
    try {
      loadingTypes.value = true
      error.value = null
      
      const response = await nuxtApp.$api.get('/api/product-type')
      types.value = response.data || []
      
      return types.value
    } catch (err) {
      console.error('Error fetching types:', err)
      error.value = err?.response?.data?.message || 'Gagal memuat tipe produk'
      types.value = []
      return Promise.reject(err)
    } finally {
      loadingTypes.value = false
    }
  }
  
  /**
   * Fetch categories berdasarkan type(s)
   * Jika selectedTypes kosong, fetch semua category dari __all__
   * Jika selectedTypes ada, fetch untuk setiap type dan gabungkan
   * @returns {Promise<Array>} Array of unique categories
   */
  const fetchCategories = async () => {
    try {
      loadingCategories.value = true
      error.value = null
      
      let categorySet = new Set()
      
      // Jika tidak ada type yang dipilih, fetch semua category
      if (selectedTypes.value.length === 0) {
        const response = await nuxtApp.$api.get('/api/product-category/__all__')
        categories.value = response.data || []
      } else {
        // Fetch category untuk setiap type yang dipilih
        const promises = selectedTypes.value.map((type) =>
          nuxtApp.$api.get(`/api/product-category/${type}`)
        )
        
        const responses = await Promise.all(promises)
        
        // Gabungkan semua categories dan hapus duplikasi
        responses.forEach((response) => {
          const cats = response.data || []
          cats.forEach((cat) => categorySet.add(cat))
        })
        
        categories.value = Array.from(categorySet).sort()
      }
      
      return categories.value
    } catch (err) {
      console.error('Error fetching categories:', err)
      error.value = err?.response?.data?.message || 'Gagal memuat kategori produk'
      categories.value = []
      return Promise.reject(err)
    } finally {
      loadingCategories.value = false
    }
  }
  
  /**
   * Validasi selected categories dengan available categories
   * Hapus kategori yang tidak tersedia dalam type yang dipilih
   */
  const validateSelectedCategories = () => {
    const availableCats = new Set(categories.value)
    
    // Filter selectedCategories, hanya keep yang ada di availableCats
    selectedCategories.value = selectedCategories.value.filter((cat) =>
      availableCats.has(cat)
    )
  }
  
  /**
   * Toggle type selection
   * @param {string} type - Type to toggle
   */
  const toggleType = async (type) => {
    const index = selectedTypes.value.indexOf(type)
    
    if (index > -1) {
      // Remove type
      selectedTypes.value.splice(index, 1)
    } else {
      // Add type
      selectedTypes.value.push(type)
    }
    
    // Fetch categories berdasarkan selected types
    await fetchCategories()
    
    // Validasi: hapus selected categories yang tidak ada di type baru
    validateSelectedCategories()
  }
  
  /**
   * Clear semua selected types
   */
  const clearSelectedTypes = async () => {
    selectedTypes.value = []
    await fetchCategories()
    validateSelectedCategories()
  }
  
  /**
   * Toggle category selection
   * @param {string} category - Category to toggle
   */
  const toggleCategory = (category) => {
    const index = selectedCategories.value.indexOf(category)
    
    if (index > -1) {
      // Remove category
      selectedCategories.value.splice(index, 1)
    } else {
      // Add category
      selectedCategories.value.push(category)
    }
  }
  
  /**
   * Clear semua selected categories
   */
  const clearSelectedCategories = () => {
    selectedCategories.value = []
  }
  
  /**
   * Update search query
   * @param {string} query - Search query
   */
  const setSearchQuery = (query) => {
    searchQuery.value = query.trim()
  }
  
  /**
   * Clear search query
   */
  const clearSearchQuery = () => {
    searchQuery.value = ''
  }
  
  /**
   * Get query params untuk API
   * Default: type=all, category=all
   * Jika ada selected: type=type1,type2 atau category=cat1,cat2
   * Jika ada search: query=search_term
   * @returns {Object} Filter params
   */
  const getFilterParams = () => {
    const params = {
      type: 'all',
      category: 'all',
    }
    
    // Set type param - comma separated jika multiple
    if (selectedTypes.value.length > 0) {
      params.type = selectedTypes.value.join(',')
    }
    
    // Set category param - comma separated jika multiple
    if (selectedCategories.value.length > 0) {
      params.category = selectedCategories.value.join(',')
    }
    
    // Set query param jika ada search
    if (searchQuery.value.length > 0) {
      params.query = searchQuery.value
    }
    
    return params
  }
  
  /**
   * Reset semua filter (termasuk search)
   */
  const resetFilters = async () => {
    selectedTypes.value = []
    selectedCategories.value = []
    searchQuery.value = ''
    categories.value = []
    await fetchCategories() // Fetch semua category lagi
  }
  
  /**
   * Initialize filter - fetch types dan categories(__all__)
   */
  const initialize = async () => {
    try {
      await Promise.all([
        fetchTypes(),
        fetchCategories(),
      ])
    } catch (err) {
      console.error('Error initializing filters:', err)
      return Promise.reject(err)
    }
  }
  
  return {
    // State
    types,
    selectedTypes,
    categories,
    selectedCategories,
    searchQuery,
    loadingTypes,
    loadingCategories,
    error,
    
    // Methods
    fetchTypes,
    fetchCategories,
    toggleType,
    clearSelectedTypes,
    toggleCategory,
    clearSelectedCategories,
    setSearchQuery,
    clearSearchQuery,
    getFilterParams,
    resetFilters,
    initialize,
    validateSelectedCategories,
  }
}