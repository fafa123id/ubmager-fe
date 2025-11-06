// composables/useAuth.ts
import { defu } from "defu";

export const useAuth = () => {
  const nuxtApp = useNuxtApp();

  // === States ================================================================
  const user = useState("auth_user", () => null);
  const authReady = useState("auth_ready", () => false);

  // "Lock" untuk dedup refresh/fetch concurrent
  const inFlight = useState("auth_in_flight", () => null);

  // Cookie access token (non-HttpOnly, agar bisa dipakai header Authorization)
  const token = (maxAge = 60) =>
    useCookie("auth_token", {
      maxAge,
      sameSite: "lax",
      // sesuaikan jika perlu:
      // secure: true,
      // domain: '.bornhub.cloud',
      path: "/",
    });

  // === Helpers ===============================================================
  const _setAuthHeader = (accessToken) => {
    if (!nuxtApp.$api) return;
    if (accessToken) {
      nuxtApp.$api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessToken}`;
    } else {
      delete nuxtApp.$api.defaults.headers.common["Authorization"];
    }
  };

  const _clearAuth = () => {
    token().value = null;
    user.value = null;
    _setAuthHeader(null);
    authReady.value = true;
  };

  const setAccessToken = (accessToken, opts) => {
    const maxAge = opts?.maxAge ?? 60;
    token(maxAge).value = accessToken;
    _setAuthHeader(accessToken);
  };

  // === Core flows ============================================================
  const refreshAccessToken = async () => {
    // Dedup dengan "lock"
    if (inFlight.value) {
      return await inFlight.value;
    }

    const job = (async () => {
      // Mengandalkan refresh cookie HttpOnly di backend (CORS + withCredentials=true)
      const res = await nuxtApp.$api.post("/api/refresh");
      const newAccessToken = res.data?.access_token;
      if (!newAccessToken)
        throw new Error("No access_token in /api/refresh response");
      // Panjangin usia token sesuai kebutuhan (misal 1 menit)
      setAccessToken(newAccessToken, { maxAge: 60 });
      return newAccessToken;
    })();

    inFlight.value = job;
    try {
      const result = await job;
      return result;
    } finally {
      inFlight.value = null;
    }
  };

  const fetchUser = async () => {
    // Dedup juga, supaya beberapa pemanggil nunggu proses yang sama
    if (inFlight.value) {
      await inFlight.value;
      return user.value;
    }

    const job = (async () => {
      // Jika sudah punya access token, coba /api/user dulu
      const t = token().value;
      if (t) _setAuthHeader(t);

      try {
        const r1 = await nuxtApp.$api.get("/api/user");
        user.value = r1.data ?? null;
        authReady.value = true;
        return user.value;
      } catch (err) {
        // Kalau 401 → coba refresh, lalu get user lagi
        if (err?.response?.status === 401) {
          try {
            await refreshAccessToken();
            const r2 = await nuxtApp.$api.get("/api/user");
            user.value = r2.data ?? null;
            authReady.value = true;
            return user.value;
          } catch (e) {
            // Refresh gagal → clear
            _clearAuth();
            return null;
          }
        } else {
          // Error lain → anggap auth invalid
          _clearAuth();
          return null;
        }
      }
    })();

    inFlight.value = job;
    try {
      return await job;
    } finally {
      inFlight.value = null;
    }
  };

  // Dipakai middleware: tunggu proses auth selesai; return boolean
  const ensureAuth = async () => {
    if (user.value) {
      authReady.value = true;
      return true;
    }
    const u = await fetchUser();
    return !!u;
  };

  // === Public APIs ===========================================================
  const login = async ({ emailor_username, password }) => {
    try {
      const res = await nuxtApp.$api.post("/api/login", {
        emailor_username,
        password,
      });
      const accessToken = res.data?.access_token;
      if (!accessToken)
        throw new Error("No access_token in /api/login response");

      setAccessToken(accessToken, { maxAge: 60 }); // misal 1 menit
      await fetchUser();
      return true;
    } catch (error) {
      _clearAuth();
      return Promise.reject(error);
    }
  };

  const loginWithToken = async (accessToken) => {
    setAccessToken(accessToken, { maxAge: 60 * 60 * 24 * 30 });
    await fetchUser();
  };

  const logout = async () => {
    try {
      if (nuxtApp.$api) {
        _setAuthHeader(token().value);
        await nuxtApp.$api.post("/api/logout");
      }
    } catch (e) {
      // ignore
    } finally {
      _clearAuth();
      await navigateTo("/");
    }
  };

  // checkAuth disederhanakan: jangan cek refresh_token cookie
  const checkAuth = async () => {
    return await ensureAuth();
  };

  return {
    // state
    user,
    authReady,
    // cookie
    token,
    // flows
    login,
    loginWithToken,
    logout,
    ensureAuth,
    checkAuth,
    fetchUser,
    refreshAccessToken,
    // helpers
    _clearAuth,
    _setAuthHeader,
    setAccessToken,
  };
};
