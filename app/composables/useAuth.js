import { defineNuxtPlugin } from "#app";

export const useAuth = () => {
  const nuxtApp = useNuxtApp();

  const user = useState("auth_user", () => null);

  const _clearAuth = () => {
    user.value = null;

  };

  const fetchUser = async () => {
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

      const response = await nuxtApp.$api.post("/api/refresh");

      const userResponse = await nuxtApp.$api.get("/api/user");
      user.value = userResponse.data;
      return user.value;
    }
  };

  const login = async ({ emailor_username, password }) => {
    try {
      const response = await nuxtApp.$api.post("/api/login", {
        emailor_username,
        password,
      });
      await fetchUser();
      return true;
    } catch (error) {
      console.error("Login gagal:", error);
      _clearAuth();
      return Promise.reject(error);
    }
  };


  const logout = async () => {
    try {
      if (nuxtApp.$api) {
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
    user,
    login,
    logout,
    checkAuth,
    fetchUser,
    _clearAuth,
    register,
  };
};
