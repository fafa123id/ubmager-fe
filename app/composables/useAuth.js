import { defineNuxtPlugin } from "#app";
import { access } from "fs";

export const useAuth = () => {
  const nuxtApp = useNuxtApp();
  const token = (maxAge = 60 ) =>
    useCookie("auth_token", {
      maxAge: maxAge,
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
    token().value = null;
    user.value = null;
    if (nuxtApp.$api) {
      delete nuxtApp.$api.defaults.headers.common["Authorization"];
    }
  };

  const fetchUser = async () => {
    if (token().value) {
      _setAuthHeader(token().value);
      try {
        const response = await nuxtApp.$api.get("/api/user");
        user.value = response.data;
        return user.value;
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error("Gagal fetch user (bukan 401):", error);
          _clearAuth();
          return null;
        }

        console.log("Access token kedaluwarsa, mencoba refresh...");
      }
    }

    try {
      const refreshResponse = await nuxtApp.$api.post("/api/refresh");
      const newAccessToken = refreshResponse.data.access_token;

      token().value = newAccessToken;
      _setAuthHeader(newAccessToken);

      const userResponse = await nuxtApp.$api.get("/api/user");
      user.value = userResponse.data;
      return user.value;
    } catch (error) {
      console.error("Gagal refresh token atau fetch user kedua:", error);
      _clearAuth();
      return null;
    }
  };

  const login = async ({ emailor_username, password }) => {
    try {
      const response = await nuxtApp.$api.post("/api/login", {
        emailor_username,
        password,
      });
      accessToken = response.data.access_token
      token().value = accessToken;

      _setAuthHeader(accessToken);

      await fetchUser();

      return true;
    } catch (error) {
      console.error("Login gagal:", error);
      _clearAuth();
      return Promise.reject(error);
    }
  };

  const loginWithToken = async (accessToken) => {
    token(60 * 60 * 24 * 30).value = accessToken;
    _setAuthHeader(accessToken);
    await fetchUser();
  };

  const logout = async () => {
    try {
      if (nuxtApp.$api) {
        _setAuthHeader(token().value);
        await nuxtApp.$api.post("/api/logout");
      }
    } catch (error) {
      console.error("Logout gagal:", error);
    }

    _clearAuth();

    await navigateTo("/");
  };
  const register = async ({
    name,
    email,
    password,
    password_confirmation,
    username,
    phone,
  }) => {
    try {
      const response = await nuxtApp.$api.post("/api/register", {
        name,
        email,
        password,
        password_confirmation,
        username,
        phone,
      });
    } catch (error) {
      console.error("Register gagal:", error);
      return Promise.reject(error);
    }
  };

  const checkAuth = async () => {
    if (user.value) {
      return true;
    }

    const fetchedUser = await fetchUser();

    return !!fetchedUser;
  };

  return {
    token,
    user,
    login,
    logout,
    checkAuth,
    fetchUser,
    _clearAuth,
    _setAuthHeader,
    register,
    loginWithToken,
  };
};
