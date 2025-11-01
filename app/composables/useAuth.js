// composables/useAuth.ts
export const useAuth = () => {
  const { $api } = useNuxtApp(); // Ambil $api dari plugin
  const user = useState("user", () => null); // State user global

  // Cookie untuk menyimpan token
  const token = useCookie("auth_token", {
    maxAge: 60 * 15, // 15 menit (sesuaikan dengan backend, tapi ini hanya untuk client)
    path: "/",
  });

  const refreshToken = useCookie("auth_refresh_token", {
    maxAge: 60 * 60 * 24 * 7, // 7 hari
    path: "/",
  });

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
    logout(false); // Panggil logout tapi jangan panggil API

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
      logout(false); // Bersihkan sisa token jika login gagal
      return Promise.reject(error);
    }
  }

  /**
   * (B) Fungsi Logout
   */
  async function logout(callApi = true) {
    if (callApi && token.value) {
      try {
        // Beri tahu backend untuk revoke token
        await $api.post("/api/logout");
      } catch (error) {
        console.warn("Failed to logout from API, logging out locally:", error);
      }
    }

    // Bersihkan state di frontend
    user.value = null;
    token.value = null;
    refreshToken.value = null;
    setAuthHeader(null);
    window.location.reload(true);
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

  /**
   * (D) Fungsi Inisialisasi Auth
   * Panggil ini saat aplikasi Nuxt pertama kali dimuat.
   */

  return {
    user,
    login,
    logout,
    fetchUser,
  };
};
