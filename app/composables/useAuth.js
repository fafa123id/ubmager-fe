import { access } from "fs";
export const token = useCookie("auth_token", {
  maxAge: 60, // 15 menit (sesuaikan dengan backend, tapi ini hanya untuk client)
  path: "/",
});

export const refreshToken = useCookie("auth_refresh_token", {
  maxAge: 60 * 60 * 24 * 7, // 7 hari
  path: "/",
});
// composables/useAuth.ts
export const useAuth = () => {
  const { $api } = useNuxtApp(); // Ambil $api dari plugin
  const user = useState("user", () => null); // State user global

  // Cookie untuk menyimpan token

  /**
   * Helper untuk set header di $api
   */
  function setAuthHeader(authToken) {
    if (authToken) {
      $api.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
    } else {
      delete $api.defaults.headers.common["Authorization"];
    }
  }

  /**
   * (A) Fungsi Login
   */
  async function login({ email, password }) {
    // Hapus token lama jika ada
    clearTokens();

    try {
      const response = await $api.post("/api/login", {
        email: email,
        password: password,
      });

      // Simpan kedua token dari respons Passport
      token.value = response.data.access_token;
      refreshToken.value = response.data.refresh_token;

      // Set header untuk request selanjutnya
      setAuthHeader(token.value);

      // Ambil data user
      await fetchUser();

      return Promise.resolve();
    } catch (error) {
      console.error("Login failed:", error);
      clearTokens(); // Bersihkan sisa token jika login gagal
      return Promise.reject(error);
    }
  }
  function clearTokens() {
    // Bersihkan state di frontend
    user.value = null;
    token.value = null;
    refreshToken.value = null;
    setAuthHeader(null);
  }
  /**
   * (B) Fungsi Logout
   */
  async function logout() {
    if (token.value) {
      try {
        // Beri tahu backend untuk revoke token
        await $api.post("/api/logout");
      } catch (error) {
        console.warn("Failed to logout from API, logging out locally:", error);
      }
    }
    clearTokens();
    navigateTo("/");
  }

  /**
   * (C) Fungsi Fetch User
   */
  async function fetchUser() {
    if (!token.value) {
      user.value = null;
      return; // Tidak ada token, tidak perlu fetch
    }

    // Set header (penting jika ini page load baru)
    setAuthHeader(token.value);

    try {
      const response = await $api.get("/api/user");
      user.value = response.data;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      // Jika error (mungkin 401), interceptor akan coba refresh.
      // Jika refresh gagal, token akan dihapus oleh interceptor.
      // Kita cek lagi di sini.
      if (!token.value) {
        user.value = null;
      }
    }
  }

  async function checkAuth() {
    if (refreshToken.value) {
      return false;
    }
    if (!token.value) {
      try {
        const runtimeConfig = useRuntimeConfig();
        const passportClientId = runtimeConfig.public.passportClientId;
        const passportClientSecret = runtimeConfig.public.passportClientSecret;
        // Coba refresh token
        const response = await $api.post("/oauth/token", {
          grant_type: "refresh_token",
          refresh_token: refreshToken.value,
          client_id: passportClientId,
          client_secret: passportClientSecret,
          scope: "",
        });
        token.value = response.data.access_token;
        refreshToken.value = response.data.refresh_token;
      } catch (error) {
        console.error("Failed to refresh token:", error);
        clearTokens();
        return false;
      }
    }
    return true;
  }

  /**
   * (D) Fungsi Inisialisasi Auth
   * Panggil ini saat aplikasi Nuxt pertama kali dimuat.
   */

  return {
    checkAuth,
    user,
    login,
    logout,
    fetchUser,
  };
};
