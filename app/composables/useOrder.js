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
  const finishOrder = async (orderId) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await nuxtApp.$api.get(`/api/orders/${orderId}/finish`);
      resetOrder();
      return response.data;
    } catch (err) {
      console.error("Failed to finish order:", err);
      error.value = err.data?.message || "Failed to finish order";
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const cancelOrder = async (orderId) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await nuxtApp.$api.get(`/api/transaction/cancel/${orderId}`);
      resetOrder();
      return response.data;
    } catch (err) {
      console.error("Failed to cancel order:", err);
      error.value = err.data?.message || "Failed to cancel order";
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const rateOrder = async (orderId, ratingData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await nuxtApp.$api.post(`/api/rating/${orderId}`, ratingData);
      return response.data;
    } catch (err) {
      console.error("Failed to rate order:", err);
      error.value = err.data?.message || "Failed to rate order";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const downloadReceipt = async (orderId) => {
    return `${nuxtApp.$config.public.apiBase}/api/orders/${orderId}/receipt`;
  }
  return {
    order,
    loading,
    error,
    downloadReceipt,
    getOrderById,
    resetOrder,
    rateOrder,
    cancelOrder,
    finishOrder,
  };
};
