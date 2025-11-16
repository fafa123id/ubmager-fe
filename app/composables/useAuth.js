import { defineNuxtPlugin } from "#app";
import axios from "axios";
import { clear } from "console";

export const useAuth = () => {
  const isLoggedIn = useCookie("isLoggedIn", {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: "lax",
  });
  const setIsLoggedIn = (value) => {
    isLoggedIn.value = value;
  };
  const nuxtApp = useNuxtApp();
  // const token = (maxage = 60) =>
  //   useCookie("auth_token", {
  //     maxAge: maxage,
  //     sameSite: "lax",
  //   });
  const user = useState("auth_user", () => null);

  const _clearAuth = () => {
    // token().value = null;
    user.value = null;
    // if (nuxtApp.$api) {
    //   delete nuxtApp.$api.defaults.headers.common["Authorization"];
    // }
    setIsLoggedIn(false);
  };
  // const _setAuthHeader = (accessToken) => {
  //   if (nuxtApp.$api && accessToken) {
  //     nuxtApp.$api.defaults.headers.common[
  //       "Authorization"
  //     ] = `Bearer ${accessToken}`;
  //   }
  // };
  const fetchUser = async () => {
    try {
      // if (token().value) {
      //   _setAuthHeader(token().value);
      // }
      const response = await nuxtApp.$api.get("/api/user");
      setIsLoggedIn(true);
      user.value = response.data;
      return user.value;
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error("Gagal fetch user (bukan 401):", error);
        _clearAuth();
        return null;
      }
    }
  };

  const login = async ({ emailor_username, password }) => {
    try {
      const response = await nuxtApp.$api.post("/api/login", {
        emailor_username,
        password,
      });
      // token().value = response.data.access_token;
      // _setAuthHeader(response.data.access_token);
      await fetchUser();
      return true;
    } catch (error) {
      console.error("Login gagal:", error);
      _clearAuth();
      return Promise.reject(error);
    }
  };

  // const loginWithToken = async (accessToken) => {
  //   token(60 * 60 * 24 * 30).value = accessToken;
  //   _setAuthHeader(accessToken);
  //   await fetchUser();
  // };

  const logout = async () => {
    try {
      if (nuxtApp.$api) {
        // if (token().value) {
        //   _setAuthHeader(token().value);
        // }
        await nuxtApp.$api.post("/api/logout");
      }
    } catch (error) {
      console.error("Logout gagal:", error);
    }

    _clearAuth();
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

  const forgotPassword = async ({ email }) => {
    try {
      if (nuxtApp.$api) {
        return await nuxtApp.$api.post("/api/forgot-password", { email });
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };
  const resetPassword = async ({
    token,
    email,
    password,
    password_confirmation,
  }) => {
    try {
      if (nuxtApp.$api) {
        return await nuxtApp.$api.post("/api/reset-password", {
          token,
          email,
          password,
          password_confirmation,
        });
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };
  return {
    resetPassword,
    forgotPassword,
    user,
    login,
    logout,
    checkAuth,
    fetchUser,
    _clearAuth,
    // _setAuthHeader,
    register,
    // loginWithToken,
    isLoggedIn,
    setIsLoggedIn,
  };
};
