// composables/useAuth.ts
export const useAuth = () => {
  const user = useState('user', () => null)

  async function fetchUser() {
    try { user.value = await $fetch('/user', { baseURL: 'https://api.bornhub.cloud', credentials: 'include' }) }
    catch { user.value = null }
  }

  async function login(email, password) {

    await $fetch('/sanctum/csrf-cookie', { baseURL: 'https://api.bornhub.cloud', credentials: 'include' })
    // 2) kirim kredensial (Axios/$fetch akan kirim X-XSRF-TOKEN otomatis jika pakai Axios; untuk $fetch, set header manual jika perlu)
    await $fetch('/login', {
      baseURL: 'https://api.bornhub.cloud',
      method: 'POST',
      body: { email, password },
      credentials: 'include',
      headers: { 'X-XSRF-TOKEN': useCookie('XSRF-TOKEN').value }, // jika perlu
    })
    await fetchUser()
  }

  async function logout() {
    await $fetch('/logout', { baseURL: 'https://api.bornhub.cloud', method: 'POST', credentials: 'include' })
    user.value = null
  }

  return { user, fetchUser, login, logout }
}
