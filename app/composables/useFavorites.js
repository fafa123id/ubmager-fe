// File: g:\FIle Coding\ubmager-fe\app\composables\useFavorites.js

export const useFavorites = () => {
  const nuxtApp = useNuxtApp();

  // State management
  const favorites = useState("favorites_list", () => []);
  const loading = useState("favorites_loading", () => false);
  const error = useState("favorites_error", () => null);
  const maxPage = useState("favorites_maxpage", () => 1);
  const currentPage = useState("favorites_currentpage", () => 1);
  const perPage = useState("favorites_perpage", () => 5);
  const searchQuery = useState("favorites_search", () => "");

  /**
   * Fetch max page untuk favorites
   * @param {number} perpage - Items per page
   * @param {string} search - Search query (optional)
   * @returns {Promise<number>} Max page
   */
  const fetchMaxPage = async (perpage = 5, search = "") => {
    try {
      loading.value = true;
      error.value = null;

      const params = {
        perpage,
      };

      if (search) {
        params.query = search;
      }

      const response = await nuxtApp.$api.get("/api/favorites/page-count", {
        params,
      });

      maxPage.value = response.data.data?.page_count || 1;
      perPage.value = perpage;

      return maxPage.value;
    } catch (err) {
      if (err.status === 500) {
        maxPage.value = 1;
        return;
      }
      console.error("Error fetching favorites max page:", err);
      error.value =
        err?.response?.data?.message || "Gagal memuat jumlah halaman";
      maxPage.value = 1;
      return Promise.reject(err);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch favorites dengan pagination dan search
   * @param {number} page - Halaman yang diminta
   * @param {number} perpage - Items per page
   * @param {string} search - Search query (optional)
   * @returns {Promise<Object>} Favorites dan metadata
   */
  const fetchFavorites = async (page = 1, perpage = 5, search = "") => {
    try {
      loading.value = true;
      error.value = null;

      const params = {
        page,
        perpage,
      };

      if (search) {
        params.query = search;
      }

      const response = await nuxtApp.$api.get("/api/favorites", {
        params,
      });

      const newFavorites = response.data.data || [];

      // Jika page 1, replace, else append (untuk infinite scroll)
      if (page === 1) {
        favorites.value = newFavorites;
      } else {
        favorites.value = [...favorites.value, ...newFavorites];
      }

      currentPage.value = page;

      return {
        favorites: favorites.value,
        maxPage: maxPage.value,
        page: currentPage.value,
      };
    } catch (err) {
      if (err.status === 500) {
        favorites.value = [];
        return;
      }
      console.error("Error fetching favorites:", err);
      error.value = err?.response?.data?.message || "Gagal memuat favorit";
      if (page === 1) {
        favorites.value = [];
      }
      return Promise.reject(err);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Initialize - fetch max page dan favorites pertama kali
   * @param {number} perpage - Items per page
   * @param {string} search - Search query
   * @returns {Promise<Object>}
   */
  const initialize = async (perpage = 5, search = "") => {
    try {
      await fetchMaxPage(perpage, search);
      await fetchFavorites(1, perpage, search);

      searchQuery.value = search;

      return {
        favorites: favorites.value,
        maxPage: maxPage.value,
      };
    } catch (err) {
      if (err.status === 500) {
        return;
      }
      console.error("Error initializing favorites:", err);
      return Promise.reject(err);
    }
  };

  /**
   * Load next page (untuk infinite scroll)
   * @returns {Promise<Object>}
   */
  const loadNextPage = async () => {
    if (currentPage.value >= maxPage.value) {
      return { hasMore: false };
    }

    const nextPage = currentPage.value + 1;
    try {
      await fetchFavorites(nextPage, perPage.value, searchQuery.value);
      return { hasMore: currentPage.value < maxPage.value };
    } catch (err) {
      console.error("Error loading next page:", err);
      return Promise.reject(err);
    }
  };

  /**
   * Search favorites
   * @param {string} query - Search query
   * @returns {Promise<Object>}
   */
  const searchFavorites = async (query = "") => {
    try {
      searchQuery.value = query;
      await Promise.all([
        fetchMaxPage(perPage.value, query),
        fetchFavorites(1, perPage.value, query),
      ]);

      return {
        favorites: favorites.value,
        maxPage: maxPage.value,
      };
    } catch (err) {
      console.error("Error searching favorites:", err);
      return Promise.reject(err);
    }
  };
  const postFavorite = async (itemId) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await nuxtApp.$api.post("/api/favorites", {
        product_id: itemId,
      });
      return response.data;
    } catch (err) {
      if (err.status === 500) {
        return;
      }
      console.error("Error adding favorite:", err);
      error.value = err?.response?.data?.message || "Gagal menambahkan favorit";
      return Promise.reject(err);
    } finally {
      loading.value = false;
    }
  };
  const deleteFavorite = async (itemId) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await nuxtApp.$api.delete(`/api/favorites/${itemId}`);
      return response.data;
    } catch (err) {
      if (err.status === 500) {
        return;
      } 
      console.error("Error deleting favorite:", err);
      error.value = err?.response?.data?.message || "Gagal menghapus favorit";
      return Promise.reject(err);
    } finally {
      loading.value = false;
    }
  };
  /**
   * Reset semua state
   */
  const reset = () => {
    favorites.value = [];
    loading.value = false;
    error.value = null;
    maxPage.value = 1;
    currentPage.value = 1;
    perPage.value = 5;
    searchQuery.value = "";
  };

  return {
    // State
    favorites,
    loading,
    error,
    maxPage,
    currentPage,
    perPage,
    searchQuery,

    // Methods
    fetchMaxPage,
    fetchFavorites,
    initialize,
    loadNextPage,
    searchFavorites,
    reset,
    postFavorite,
    deleteFavorite,
  };
};
