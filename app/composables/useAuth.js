export const useAuth = () => {
  const { $api } = useNuxtApp(); // Ambil instance $api dari plugin-mu
  const user = useState("user", () => null);

  // Kita simpan token di cookie bernama 'auth_token'
  const token = useCookie("auth_token", {
    maxAge: 60 * 60 * 24 * 7, // 7 hari
    path: "/",
  });

  /**
   * Helper untuk set header Authorization di instance Axios
   */
  function setAuthHeader(apiInstance, authToken) {
    if (authToken) {
      apiInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${authToken}`;
    } else {
      delete apiInstance.defaults.headers.common["Authorization"];
    }
  }

  /**
   * Coba fetch user (jika token ada)
   */
  async function fetchUser() {
    if (!token.value) {
      user.value = null;
      return;
    }

    // Pastikan header diset sebelum fetch
    setAuthHeader($api, token.value);

    try {
      const response = await $api.get("/api/user");
      user.value = response.data;
    } catch (error) {
      console.error("Gagal fetch user:", error);
      // Token mungkin expired, hapus saja
      token.value = null;
      user.value = null;
      setAuthHeader($api, null);
    }
  }

  /**
   * Login
   */
  async function login({ email, password }) {
    // 1. Hapus state lama (jika ada)
    user.value = null;
    token.value = null;
    setAuthHeader($api, null);

    try {
      // 2. Panggil /api/login baru kita
      const response = await $api.post("/api/login", {
        email: email,
        password: password,
      });

      // 3. Respons-nya akan berisi 'access_token' dari Passport
      const accessToken = response.data.access_token;

      // 4. Simpan token di cookie
      token.value = accessToken;

      // 5. Set header untuk request selanjutnya & fetch user
      setAuthHeader($api, accessToken);
      await fetchUser();
    } catch (error) {
      console.error("Login gagal:", error);
      user.value = null;
      token.value = null;
      setAuthHeader($api, null);
    }
  }

  /**
   * Logout
   */
  async function logout() {
    if (!token.value) return; // Sudah logout

    try {
      // Panggil /api/logout (yg butuh header)
      await $api.post("/api/logout");
    } catch (error) {
      console.error("Logout di server gagal:", error);
      // Tidak apa-apa, kita paksa logout di frontend
    } finally {
      // Hapus data di sisi client
      user.value = null;
      token.value = null;
      setAuthHeader($api, null);
    }
  }

  /**
   * Fungsi ini harus dipanggil saat app Nuxt pertama kali load
   * (Misal di app.vue atau plugin)
   */
  async function initAuth() {
    if (token.value) {
      await fetchUser();
    }
  }

  return { user, login, logout, fetchUser, initAuth };
};
