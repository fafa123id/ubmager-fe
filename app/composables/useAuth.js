import { defineNuxtPlugin } from "#app";

export const useAuth = () => {
  const nuxtApp = useNuxtApp();
  
  const token = (maxAge = 60) =>
    useCookie("auth_token", {
      maxAge: maxAge,
      sameSite: "lax",
    });

  // Global states
  const user = useState("auth_user", () => null);
  const isAuthChecking = useState("auth_checking", () => false);
  const authCheckPromise = useState("auth_check_promise", () => null);
  const isRefreshingToken = useState("is_refreshing_token", () => false);

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
    isAuthChecking.value = false;
    authCheckPromise.value = null;
    isRefreshingToken.value = false;
    if (nuxtApp.$api) {
      delete nuxtApp.$api.defaults.headers.common["Authorization"];
    }
  };

  const fetchUser = async () => {
    // Prevent multiple simultaneous fetches - reuse existing promise
    if (authCheckPromise.value) {
      console.log("Auth check already in progress, reusing promise...");
      return authCheckPromise.value;
    }

    isAuthChecking.value = true;

    const fetchPromise = (async () => {
      try {
        // Try with existing access token first
        if (token().value) {
          _setAuthHeader(token().value);
          try {
            const response = await nuxtApp.$api.get("/api/user");
            user.value = response.data;
            return user.value;
          } catch (error) {
            // If not 401, it's a real error
            if (error.response?.status !== 401) {
              console.error("Gagal fetch user (bukan 401):", error);
              _clearAuth();
              return null;
            }
            console.log("Access token kedaluwarsa, lanjut ke refresh...");
            // Continue to refresh attempt below
          }
        }

        // Prevent multiple simultaneous refresh attempts
        if (isRefreshingToken.value) {
          console.log("Refresh already in progress, waiting...");
          // Wait a bit and retry
          await new Promise(resolve => setTimeout(resolve, 100));
          if (user.value) {
            return user.value;
          }
          return null;
        }

        // Try refresh token
        isRefreshingToken.value = true;
        try {
          console.log("Attempting token refresh...");
          const refreshResponse = await nuxtApp.$api.post("/api/refresh");
          const newAccessToken = refreshResponse.data.access_token;

          token().value = newAccessToken;
          _setAuthHeader(newAccessToken);

          const userResponse = await nuxtApp.$api.get("/api/user");
          user.value = userResponse.data;
          console.log("Token refresh successful");
          return user.value;
        } catch (refreshError) {
          console.error("Gagal refresh token:", refreshError);
          _clearAuth();
          return null;
        } finally {
          isRefreshingToken.value = false;
        }
      } finally {
        isAuthChecking.value = false;
        authCheckPromise.value = null;
      }
    })();

    authCheckPromise.value = fetchPromise;
    return fetchPromise;
  };

  const login = async ({ emailor_username, password }) => {
    try {
      const response = await nuxtApp.$api.post("/api/login", {
        emailor_username,
        password,
      });
      const accessToken = response.data.access_token;
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
      if (nuxtApp.$api && token().value) {
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
      return response;
    } catch (error) {
      console.error("Register gagal:", error);
      return Promise.reject(error);
    }
  };

  const checkAuth = async () => {

    if (user.value) {
      return true;
    }


    if (authCheckPromise.value) {
      const result = await authCheckPromise.value;
      return !!result;
    }

    // Perform auth check
    const fetchedUser = await fetchUser();
    return !!fetchedUser;
  };

  return {
    token,
    user,
    isAuthChecking,
    isRefreshingToken,
    authCheckPromise,
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