// File: app/composables/useOrder.js
import { useState } from "#app";

export const useOrder = () => {
  const order = useState("order", () => null);
  const loading = useState("order-loading", () => false);
  const error = useState("order-error", () => null);
  const nuxtApp = useNuxtApp();
  const getOrderById = async (orderId) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await nuxtApp.$api.get(`/api/history/${orderId}`);

      // Extract first item from array if it's an array response
      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.data?.length > 0
      ) {
        order.value = response.data.data[0];
      } else {
        order.value = response.data.data;
      }

      return order.value;
    } catch (err) {
      console.error("Failed to fetch order:", err);
      error.value = err.data?.message || "Failed to fetch order";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const resetOrder = () => {
    order.value = null;
    error.value = null;
  };

  return {
    order,
    loading,
    error,
    getOrderById,
    resetOrder,
  };
};
