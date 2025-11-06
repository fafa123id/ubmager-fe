// plugins/api.js
import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
  const api = axios.create({
    baseURL: 'https://api.ubmager.bornhub.cloud',
    headers: { Accept: 'application/json' },
    withCredentials: true,
  })

  const { token, _setAuthHeader, refreshAccessToken, _clearAuth } = useAuth()
  const t = token().value
  if (t) _setAuthHeader(t)

  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config || {}

      if (
        error?.response?.status !== 401 ||
        originalRequest._retry ||
        originalRequest.url === '/api/refresh' ||
        originalRequest.url === '/api/login'
      ) {
        return Promise.reject(error)
      }

      originalRequest._retry = true
      try {
        const newAccessToken = await refreshAccessToken()
        originalRequest.headers = Object.assign({}, originalRequest.headers, {
          Authorization: `Bearer ${newAccessToken}`,
        })
        return api(originalRequest)
      } catch (e) {
        _clearAuth()
        return Promise.reject(e)
      }
    }
  )

  return { provide: { api } }
})
