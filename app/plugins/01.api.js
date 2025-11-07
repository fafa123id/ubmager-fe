import axios from "axios";
import { useAuth } from "~/composables/useAuth";

export default defineNuxtPlugin((nuxtApp) => {
  const { _clearAuth, token } = useAuth();

  const api = axios.create({
    baseURL: "https://api.ubmager.bornhub.cloud",
    headers: {
      Accept: "application/json",
    },
    withCredentials: true,
  });

  // if (token().value) {
  //   api.defaults.headers.common["Authorization"] = `Bearer ${token().value}`;
  // }
  api.interceptors.response.use(
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
          const ssrHeaders = {};
          if (process.server) {
            const requestHeaders = useRequestHeaders(["cookie"]);
            if (requestHeaders.cookie) {
              ssrHeaders.cookie = requestHeaders.cookie;
            }
          }
          console.log("Interceptor: Access token expired. Refreshing token...");

          const response = await api.post(
            "/api/refresh",
            {},
            { headers: ssrHeaders, withCredentials: true }
          );
          // const newAccessToken = response.data.access_token;
          // token().value = newAccessToken;
          // api.defaults.headers.common[
          //   "Authorization"
          // ] = `Bearer ${newAccessToken}`;
          // originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
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
