// composables/useAuth.ts
export const useAuth = () => {
  const user = useState("user", () => null);

  async function fetchUser() {
    try {
      user.value = await $fetch("api/user", {
        baseURL: "https://api.ubmager.bornhub.cloud",
        credentials: "include",
      });
    } catch {
      user.value = null;
    }
  }

  async function login({ email, password }) {
    await $fetch("/sanctum/csrf-cookie", {
      baseURL: "https://api.ubmager.bornhub.cloud",
      credentials: "include",
    });

    await $fetch("api/login", {
      baseURL: "https://api.ubmager.bornhub.cloud",
      method: "POST",
      body: {
        email,
        password,
      },
      credentials: "include",
      headers: { "X-XSRF-TOKEN": useCookie("XSRF-TOKEN").value }, // jika perlu
    });
    await fetchUser();
    const target = next || getQuery().next || "/";
    return hardRefresh(target);
  }

  async function logout() {
    await $fetch("api/logout", {
      baseURL: "https://api.ubmager.bornhub.cloud",
      method: "POST",
      credentials: "include",
    });
    user.value = null;
    await refreshNuxtData();
    return hardRefresh("/login");
  }

  return { user, fetchUser, login, logout };
};
