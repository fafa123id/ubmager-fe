import { defineNuxtPlugin } from "#app";

export const useAuth = () => {
  const nuxtApp = useNuxtApp();
  const runtimeConfig = useRuntimeConfig();
  const token = useCookie("auth_token", {
    maxAge: 60 * 60,
    sameSite: "lax",
  });

  const refreshToken = useCookie("auth_refresh_token", {
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
  });

  const user = useState("auth_user", () => null);

  const _setAuthHeader = (accessToken) => {
    if (nuxtApp.$api && accessToken) {
      nuxtApp.$api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessToken}`;
    }
  };

  const _clearAuth = () => {
    token.value = null;
    refreshToken.value = null;
    user.value = null;
    if (nuxtApp.$api) {
      delete nuxtApp.$api.defaults.headers.common["Authorization"];
    }
  };

  const fetchUser = async () => {
    const passportClientId = runtimeConfig.public.passportClientId;
    const passportClientSecret = runtimeConfig.public.passportClientSecret;

    if (!token.value) {
      if (refreshToken.value) {
        try {
          const response = await nuxtApp.$api.post("/oauth/token", {
            grant_type: "refresh_token",
            refresh_token: refreshToken.value,
            client_id: passportClientId,
            client_secret: passportClientSecret,
            scope: "",
          });

          const newAccessToken = response.data.access_token;
          const newRefreshToken = response.data.refresh_token;
          token.value = newAccessToken;
          refreshToken.value = newRefreshToken;
        } catch (error) {
          console.error("Gagal memperbarui token:", error);
          _clearAuth();
          return null;
        }
      } else {
        _clearAuth();
        return null;
      }
    }
    _setAuthHeader(token.value);
    try {
      const response = await nuxtApp.$api.get("/api/user");
      user.value = response.data;
      return user.value;
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
    }
  };

  const login = async ({ email, password }) => {
    try {
      const response = await nuxtApp.$api.post("/api/login", {
        email,
        password,
      });

      token.value = response.data.access_token;
      refreshToken.value = response.data.refresh_token;

      _setAuthHeader(token.value);

      await fetchUser();

      return true;
    } catch (error) {
      console.error("Login gagal:", error);
      _clearAuth();
      return Promise.reject(error);
    }
  };

  const logout = async (options = { navigate: true }) => {
    try {
      if (nuxtApp.$api) {
        await nuxtApp.$api.post("/api/logout");
      }
    } catch (error) {
      console.error("Logout gagal:", error);
    }

    _clearAuth();

    if (options.navigate) {
      await navigateTo("/");
    }
  };

  const checkAuth = async () => {
    if (user.value) {
      return true;
    }

    if (token.value) {
      await fetchUser();
      return !!user.value;
    }
    return false;
  };

  return {
    token,
    refreshToken,
    user,
    login,
    logout,
    checkAuth,
    fetchUser,
    _clearAuth,
    _setAuthHeader,
  };
};
