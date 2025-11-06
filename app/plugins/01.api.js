import axios from "axios";
import { useAuth } from "~/composables/useAuth";

export default defineNuxtPlugin(async (nuxtApp) => {
  const { _clearAuth } = useAuth();

  const api = axios.create({
    baseURL: "https://api.ubmager.bornhub.cloud",
    headers: {
      Accept: "application/json",
    },
    withCredentials: true,
  });

  await api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        originalRequest.url !== "/api/refresh"
      ) {
        originalRequest._retry = true;

        try {
          console.log("Interceptor: Access token expired. Refreshing token...");

          const response = await api.post("/api/refresh");
          
          return api(originalRequest);
        } catch (refreshError) {
          console.error(
            "Interceptor: Gagal refresh token. Logout.",
            refreshError
          );
          _clearAuth();
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  return {
    provide: {
      api: api,
    },
  };
});
