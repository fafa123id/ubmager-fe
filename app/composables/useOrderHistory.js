// app/composables/useOrderHistory.js
import { useState } from "#app";

export const useOrderHistory = () => {
  const orders = useState("order-history", () => []);
  const loading = useState("order-history-loading", () => false);
  const error = useState("order-history-error", () => null);
  const pagination = useState("order-history-pagination", () => ({
    currentPage: 1,
    perPage: 5,
    total: 0,
    lastPage: 1,
  }));

  const nuxtApp = useNuxtApp();

  const getOrderHistory = async (status = null, page = 1, perPage = 5) => {
    loading.value = true;
    error.value = null;

    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("perpage", perPage);
      if (status) params.append("status", status);

      const response = await nuxtApp.$api.get(
        `/api/history?${params.toString()}`
      );

      if (response.data?.data) {
        orders.value = response.data.data;
      }

      // Update pagination from response
      if (response.data?.meta) {
        pagination.value = {
          currentPage: response.data.meta.current_page || page,
          perPage: response.data.meta.per_page || perPage,
          total: response.data.meta.total || 0,
          lastPage: response.data.meta.last_page || 1,
        };
      }

      return response.data;
    } catch (err) {
      console.error("Failed to fetch order history:", err);
      error.value = err.response?.data?.message || "Failed to fetch orders";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const resetHistory = () => {
    orders.value = [];
    error.value = null;
    pagination.value = {
      currentPage: 1,
      perPage: 5,
      total: 0,
      lastPage: 1,
    };
  };

  return {
    orders,
    loading,
    error,
    pagination,
    getOrderHistory,
    resetHistory,
  };
};
