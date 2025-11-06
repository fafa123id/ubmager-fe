import axios from "axios";
import { useAuth } from "~/composables/useAuth";

export default defineNuxtPlugin((nuxtApp) => {
  const { token } = useAuth();
  const api = axios.create({
    baseURL: "https://api.ubmager.bornhub.cloud",
    headers: {
      Accept: "application/json",
    },
    withCredentials: true,
  });

  if (token.value) {
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token.value}`;
  }


  let isRefreshing = false;
  let refreshPromise = null;

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status !== 401 ||
        originalRequest._retry ||
        originalRequest.url === "/api/refresh" ||
        originalRequest.url === "/api/login" ||
        originalRequest.url === "/api/register"
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing && refreshPromise) {
        try {
          await refreshPromise;
          const newToken = token.value;
          if (newToken) {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      isRefreshing = true;

      refreshPromise = (async () => {
        try {
          console.log("Interceptor: Access token expired. Refreshing token...");

          const response = await api.post("/api/refresh");
          const newAccessToken = response.data.access_token;

          token.value = newAccessToken;

          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;

          console.log("Interceptor: Token refreshed successfully");
          return newAccessToken;
        } catch (refreshError) {
          console.error(
            "Interceptor: Gagal refresh token. Clearing auth.",
            refreshError
          );

          const { _clearAuth } = useAuth();
          _clearAuth();

          throw refreshError;
        } finally {
          isRefreshing = false;
          refreshPromise = null;
        }
      })();

      try {
        const newToken = await refreshPromise;
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
  );

  return {
    provide: {
      api: api,
    },
  };
});
