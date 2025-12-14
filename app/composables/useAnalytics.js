export const useAnalytics = () => {
  const nuxtApp = useNuxtApp();
  const fetchProfileAnalytics = async () => {
    try {
      const response = await nuxtApp.$api.get("/api/analytics/profile");
      return response.data;
    } catch (error) {
      console.error("Gagal fetch analytics:", error);
      return null;
    }
  };
  const fetchProductAnalytics = async () => {
    try {
      const response = await nuxtApp.$api.get("/api/analytics");
      return response.data;
    } catch (error) {
      console.error("Gagal fetch product analytics:", error);
      return null;
    }
  };

  return {
    fetchProfileAnalytics,
    fetchProductAnalytics,
  };
};
