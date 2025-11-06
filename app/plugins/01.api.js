import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
  const {user, token} = useAuth();
  const api = axios.create({
    baseURL: "https://api.ubmager.bornhub.cloud",
    headers: {
      Accept: "application/json",
    },
    withCredentials: true,
  });

  // Set initial token if available
  const tokenCookie = token();
  if (tokenCookie.value) {
    api.defaults.headers.common["Authorization"] = `Bearer ${tokenCookie.value}`;
  }

  // Track ongoing refresh to prevent multiple simultaneous refreshes
  let refreshTokenPromise = null;

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Don't retry if:
      // 1. Not a 401 error
      // 2. Already retried
      // 3. Request is to auth endpoints
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

      // If refresh is already in progress, wait for it
      if (refreshTokenPromise) {
        console.log("Interceptor: Refresh in progress, waiting...");
        try {
          const newToken = await refreshTokenPromise;
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      // Start refresh process
      console.log("Interceptor: Starting token refresh...");
      
      refreshTokenPromise = (async () => {
        try {
          const response = await api.post("/api/refresh");
          const newAccessToken = response.data.access_token;

          // Update token cookie
          const tokenCookie = token();
          tokenCookie.value = newAccessToken;

          // Update axios default header
          api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

          console.log("Interceptor: Token refreshed successfully");
          return newAccessToken;
        } catch (refreshError) {
          console.error("Interceptor: Refresh failed", refreshError);
          
          // Clear auth state on refresh failure
          const tokenCookie = token();
          tokenCookie.value = null;
          
          // Clear user state
          user.value = null;
          
          delete api.defaults.headers.common["Authorization"];
          
          throw refreshError;
        } finally {
          refreshTokenPromise = null;
        }
      })();

      try {
        const newToken = await refreshTokenPromise;
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