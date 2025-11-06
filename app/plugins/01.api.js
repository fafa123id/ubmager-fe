// plugins/api.ts
import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
  const api = axios.create({
    baseURL: 'https://api.ubmager.bornhub.cloud',
    headers: { Accept: 'application/json' },
    withCredentials: true,
  })

  // Bootstrap header dari cookie access token (jika ada)
  const { token, _setAuthHeader, refreshAccessToken } = useAuth()
  const t = token().value
  if (t) _setAuthHeader(t)

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config || {}

      // Jika bukan 401, atau ini memanggil endpoint refresh/login, lemparkan saja
      if (
        error?.response?.status !== 401 ||
        originalRequest._retry ||
        originalRequest.url === '/api/refresh' ||
        originalRequest.url === '/api/login'
      ) {
        return Promise.reject(error)
      }

      // Tandai agar tidak infinite loop
      originalRequest._retry = true

      try {
        // Panggil refresh yang sudah di-"lock"
        const newAccessToken = await refreshAccessToken()

        // Pasang header baru & retry
        originalRequest.headers = defu(originalRequest.headers || {}, {
          Authorization: `Bearer ${newAccessToken}`,
        })
        return api(originalRequest)
      } catch (e) {
        // Refresh gagal -> clear auth
        const { _clearAuth } = useAuth()
        _clearAuth()
        return Promise.reject(e)
      }
    }
  )

  // Pasang ke nuxtApp
  return {
    provide: { api },
  }
})
