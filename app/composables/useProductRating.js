// File: g:\FIle Coding\ubmager-fe\app\composables\useProductRating.js

export const useProductRating = () => {
  const nuxtApp = useNuxtApp()
  
  // State management
  const ratings = useState('product_ratings_list', () => [])
  const loading = useState('product_ratings_loading', () => false)
  const error = useState('product_ratings_error', () => null)
  const maxPage = useState('product_ratings_maxpage', () => 1)
  const currentPage = useState('product_ratings_currentpage', () => 1)
  const selectedRating = useState('product_ratings_filter', () => null) // null berarti all, atau 1-5
  const perPage = useState('product_ratings_perpage', () => 3)
  
  /**
   * Fetch max page untuk ratings
   * @param {number} productId - Product ID
   * @param {number} perpage - Items per page
   * @param {number|null} ratingFilter - Rating filter (<=rating)
   * @returns {Promise<number>} Max page
   */
  const fetchMaxPage = async (productId, perpage = 3, ratingFilter = null) => {
    try {
      loading.value = true
      error.value = null
      
      const params = {
        perpage,
      }
      
      if (ratingFilter) {
        params.rating = ratingFilter
      }
      
      const response = await nuxtApp.$api.get(`/api/rating/page-count/${productId}`, {
        params,
      })
      
      maxPage.value = response.data.data?.page_count || 1
      
      return maxPage.value
    } catch (err) {
      console.error('Error fetching max page for ratings:', err)
      error.value = err?.response?.data?.message || 'Gagal memuat jumlah halaman'
      maxPage.value = 1
      return Promise.reject(err)
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Fetch ratings dengan pagination dan filter
   * @param {number} productId - Product ID
   * @param {number} page - Halaman yang diminta
   * @param {number} perpage - Items per page
   * @param {number|null} ratingFilter - Rating filter (<=rating)
   * @returns {Promise<Object>} Ratings dan metadata
   */
  const fetchRatings = async (productId, page = 1, perpage = 3, ratingFilter = null) => {
    try {
      loading.value = true
      error.value = null
      
      const params = {
        page,
        perpage,
      }
      
      if (ratingFilter) {
        params.rating = ratingFilter
      }
      
      const response = await nuxtApp.$api.get(`/api/rating/${productId}`, {
        params,
      })
      
      ratings.value = response.data.data || response.data || []
      currentPage.value = page
      perPage.value = perpage
      
      return {
        ratings: ratings.value,
        maxPage: maxPage.value,
        page: currentPage.value,
      }
    } catch (err) {
      console.error('Error fetching ratings:', err)
      error.value = err?.response?.data?.message || 'Gagal memuat ulasan'
      ratings.value = []
      return Promise.reject(err)
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Initialize - fetch max page dan ratings
   * @param {number} productId - Product ID
   * @param {number} page - Starting page
   * @param {number} perpage - Items per page
   * @param {number|null} ratingFilter - Rating filter
   * @returns {Promise<Object>}
   */
  const initialize = async (productId, page = 1, perpage = 3, ratingFilter = null) => {
    try {
      await Promise.all([
        fetchMaxPage(productId, perpage, ratingFilter),
        fetchRatings(productId, page, perpage, ratingFilter),
      ])
      
      return {
        ratings: ratings.value,
        maxPage: maxPage.value,
        page: currentPage.value,
      }
    } catch (err) {
      console.error('Error initializing ratings:', err)
      return Promise.reject(err)
    }
  }
  
  /**
   * Set rating filter
   * @param {number|null} rating - Rating filter (1-5 atau null untuk all)
   */
  const setRatingFilter = (rating) => {
    selectedRating.value = rating
  }
  
  /**
   * Reset semua state
   */
  const reset = () => {
    ratings.value = []
    loading.value = false
    error.value = null
    maxPage.value = 1
    currentPage.value = 1
    selectedRating.value = null
    perPage.value = 3
  }
  
  return {
    // State
    ratings,
    loading,
    error,
    maxPage,
    currentPage,
    selectedRating,
    perPage,
    
    // Methods
    fetchMaxPage,
    fetchRatings,
    initialize,
    setRatingFilter,
    reset,
  }
}