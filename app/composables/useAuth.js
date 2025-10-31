// composables/useAuth.ts
export const useAuth = () => {
  const user = useState("user", () => null);

  async function fetchUser() {
    try {
      user.value = await axios.get("api/user");
    } catch {
      user.value = null;
    }
  }

  async function login({ email, password }) {
    await axios.get("sanctum/csrf-cookie"); // Dapatkan cookie CSRF terlebih dahulu

    await axios.post('/api/login', {
      email: this.email,
      password: this.password
    });
    await fetchUser();
  }

  async function logout() {
    await axios.post('/api/logout');
    user.value = null;
  }

  return { user, fetchUser, login, logout };
};
