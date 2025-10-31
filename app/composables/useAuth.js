// composables/useAuth.ts
export const useAuth = () => {
  const user = useState("user", () => null);
  const { $api } = useNuxtApp();
  async function fetchUser() {
    try {
      user.value = await $api.get("/api/user");
    } catch {
      user.value = null;
    }
  }

  async function login({ email, password }) {
    await $api.get("/sanctum/csrf-cookie"); // Dapatkan cookie CSRF terlebih dahulu

    await $api.post("/api/login", {
      email: email,
      password: password,
    });
    await fetchUser();
  }

  async function logout() {
    await $api.post("/api/logout");
    user.value = null;
  }

  return { user, fetchUser, login, logout };
};
