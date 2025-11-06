import { defineNuxtPlugin } from "#app";

export const useAuth = () => {
  const nuxtApp = useNuxtApp();
  const token = useCookie("auth_token", {
    maxAge: 60 * 60,
    sameSite: "lax",
  });
  const PAT = useCookie("auth_pat", {
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
    PAT.value = null;
    user.value = null;
    if (nuxtApp.$api) {
      delete nuxtApp.$api.defaults.headers.common["Authorization"];
    }
  };
  const GetUser = async () => {
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
      return false;
    }
  };
  const fetchUser = async () => {
    if (PAT.value) {
      _setAuthHeader(PAT.value);
    } else if (token.value) {
      _setAuthHeader(token.value);
    }
    if (await GetUser()) {
      return user.value;
    }

    try {
      const refreshResponse = await nuxtApp.$api.post("/api/refresh");
      const newAccessToken = refreshResponse.data.access_token;

      token.value = newAccessToken;
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

      token.value = response.data.access_token;
      _setAuthHeader(token.value);

      await fetchUser();

      return true;
    } catch (error) {
      console.error("Login gagal:", error);
      _clearAuth();
      return Promise.reject(error);
    }
  };

  const loginWithToken = async (accessToken) => {
    PAT.value = accessToken;
    _setAuthHeader(PAT.value);
    await fetchUser();
  };

  const logout = async () => {
    try {
      if (nuxtApp.$api) {
        if (PAT.value) _setAuthHeader(PAT.value);
        else if (token.value) _setAuthHeader(token.value);
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
    PAT,
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
