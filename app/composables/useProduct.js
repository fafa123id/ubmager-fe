export const useProduct = () => {
  const nuxtApp = useNuxtApp();

  // State management
  const products = useState("products_list", () => []);
  const loading = useState("products_loading", () => false);
  const loadingMaxPage = useState("products_loading_maxpage", () => false);
  const error = useState("products_error", () => null);
  const maxPage = useState("products_maxpage", () => 1);
  const currentPage = useState("products_currentpage", () => 1);
  const perPage = useState("products_perpage", () => 6);

  /**
   * Fetch max page dari API dengan filter support
   * @param {number} perpage - Items per page
   * @param {Object} filters - Filter params (type, category, dll)
   * @returns {Promise<number>} Max page
   */
  const fetchMaxPage = async (perpage = 6, filters = {}) => {
    try {
      loadingMaxPage.value = true;
      error.value = null;

      const params = {
        perpage,
        ...filters,
      };

      const response = await nuxtApp.$api.get("/api/product-page", {
        params,
      });

      maxPage.value = response.data.data?.page_count || 1;
      perPage.value = perpage;

      return maxPage.value;
    } catch (err) {
      console.error("Error fetching max page:", err);
      error.value =
        err?.response?.data?.message || "Gagal memuat jumlah halaman";
      maxPage.value = 1;
      return Promise.reject(err);
    } finally {
      loadingMaxPage.value = false;
    }
  };

  /**
   * Fetch products dengan pagination dan filters
   * @param {number} page - Halaman yang diminta
   * @param {number} perpage - Items per page
   * @param {Object} filters - Filter params (type, category, search, dll)
   * @returns {Promise<Object>} Products dan metadata
   */
  const fetchProducts = async (page = 1, perpage = 6, filters = {}) => {
    try {
      loading.value = true;
      error.value = null;

      // Merge default filters dengan custom filters
      const params = {
        page,
        perpage,
        type: filters.type || "all",
        category: filters.category || "all",
        ...filters,
      };

      const response = await nuxtApp.$api.get("/api/product", { params });

      products.value = response.data.products || response.data.data || [];
      currentPage.value = page;
      perPage.value = perpage;

      return {
        products: products.value,
        maxPage: maxPage.value,
        page: currentPage.value,
      };
    } catch (err) {
      console.error("Error fetching products:", err);
      error.value = err?.response?.data?.message || "Gagal memuat produk";
      products.value = [];
      return Promise.reject(err);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Initialize - fetch both max page dan products sekaligus
   * @param {number} page - Halaman awal
   * @param {number} perpage - Items per page
   * @param {Object} filters - Filter params
   * @returns {Promise<Object>}
   */
  const initialize = async (page = 1, perpage = 6, filters = {}) => {
    try {
      // Ensure default filters
      const defaultFilters = {
        type: "all",
        category: "all",
        ...filters,
      };

      // Fetch max page dan products secara parallel
      await Promise.all([
        fetchMaxPage(perpage, defaultFilters),
        fetchProducts(page, perpage, defaultFilters),
      ]);

      return {
        products: products.value,
        maxPage: maxPage.value,
        page: currentPage.value,
      };
    } catch (err) {
      console.error("Error initializing products:", err);
      return Promise.reject(err);
    }
  };

  /**
   * Get rating count for a product
   * @param {number|string} id - Product ID
   * @returns {Promise<number>} Rating count
   */
  const getRatingCountByProductId = async (id) => {
    try {
      const response = await nuxtApp.$api.get(`/api/rating/count/${id}`);
      return response.data.data?.count || 0;
    } catch (err) {
      console.error("Error fetching rating count:", err);
      return 0;
    }
  };

  /**
   * Fetch detail product by ID
   * @param {number|string} id - Product ID
   * @returns {Promise<Object>} Product detail
   */
  const getProductById = async (id) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await nuxtApp.$api.get(`/api/product/${id}`);
      return response.data;
    } catch (err) {
      console.error("Error fetching product:", err);
      error.value =
        err?.response?.data?.message || "Gagal memuat detail produk";
      return Promise.reject(err);
    } finally {
      loading.value = false;
    }
  };
  const getIsFavoriteByProductId = async (id) => {
    if (useAuth().isLoggedIn.value === null) {
      return false;
    } 
    try {
      const response = await nuxtApp.$api.get(`/api/product/is-favorited/${id}`);
      return response.data.data?.is_favorited || false;
    } catch (err) {
      return false;
    }
  };
  /**
   * Reset semua state
   */
  const reset = () => {
    products.value = [];
    loading.value = false;
    loadingMaxPage.value = false;
    error.value = null;
    maxPage.value = 1;
    currentPage.value = 1;
    perPage.value = 6;
  };

  /**
   * Clear error message
   */
  const clearError = () => {
    error.value = null;
  };
  const checkoutProduct = async (productId, quantity, pay_method) => {
    try {
      const response = await nuxtApp.$api.post(`/api/checkout`, {
        product_id: productId,
        quantity,
        pay_method,
      });
      return response.data;
    }
    catch (err) {
      console.error("Error during checkout:", err);
      return Promise.reject(err);
    }
  };

  return {
    // State
    products,
    loading,
    loadingMaxPage,
    error,
    maxPage,
    currentPage,
    perPage,

    // Methods
    getRatingCountByProductId,
    getIsFavoriteByProductId,
    fetchMaxPage,
    fetchProducts,
    initialize,
    getProductById,
    reset,
    clearError,
    checkoutProduct,
  };
};
