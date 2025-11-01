// plugins/api.ts
import axios from "axios";
import { refreshToken, token } from "~/composables/useAuth";

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig();
  // Ambil Client ID/Secret dari .env
  const passportClientId = runtimeConfig.public.passportClientId;
  const passportClientSecret = runtimeConfig.public.passportClientSecret;

  // 1. Buat instance Axios
  const api = axios.create({
    baseURL: "https://api.ubmager.bornhub.cloud", // URL Backend kamu
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  // 2. Setup Interceptor (Pencegat Respons)
  api.interceptors.response.use(
    (response) => {
      // Jika respons 2xx (sukses), langsung teruskan
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response.status === 401 &&
        originalRequest.url !== "/oauth/token"
      ) {
        if (!refreshToken.value) {
          // Tidak ada refresh token, gagal.
          // (Opsional: panggil logout di sini)
          return Promise.reject(error);
        }

        try {
          // 3. Ini adalah percobaan refresh
          console.log("Access token expired. Refreshing token...");

          const response = await api.post("/oauth/token", {
            grant_type: "refresh_token",
            refresh_token: refreshToken.value,
            client_id: passportClientId,
            client_secret: passportClientSecret,
            scope: "",
          });

          // 4. Dapat token baru, simpan!
          const newAccessToken = response.data.access_token;
          const newRefreshToken = response.data.refresh_token;

          token.value = newAccessToken;
          refreshToken.value = newRefreshToken;

          // 5. Update header default Axios dan header request asli
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          // 6. Ulangi request asli yang gagal
          return api(originalRequest);
        } catch (refreshError) {
          // Gagal refresh (mungkin refresh token juga expired)
          console.error("Failed to refresh token:", refreshError);

          // Hapus cookie dan paksa logout
          token.value = null;
          refreshToken.value = null;
          delete api.defaults.headers.common["Authorization"];

          // (Opsional: redirect ke login)
          // const router = useRouter();
          navigateTo("/");

          return Promise.reject(refreshError);
        }
      }

      // Jika error bukan 401, lempar saja
      return Promise.reject(error);
    }
  );

  // Sediakan instance $api ke seluruh aplikasi Nuxt
  return {
    provide: {
      api: api,
    },
  };
});
