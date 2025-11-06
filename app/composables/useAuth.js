// composables/useAuth.js
export const useAuth = () => {
  const nuxtApp = useNuxtApp()

  // ===== States =====
  const user = useState('auth_user', () => null)
  const authReady = useState('auth_ready', () => false)
  const inFlight = useState('auth_in_flight', () => null) // Promise lock

  const token = (maxAge = 60) =>
    useCookie('auth_token', {
      maxAge,
      sameSite: 'lax',
      path: '/',
      // secure: true, // aktifkan kalau full HTTPS
      // domain: '.bornhub.cloud', // kalau lintas subdomain
    })

  // ===== Helpers =====
  const _setAuthHeader = (accessToken) => {
    if (!nuxtApp.$api) return
    if (accessToken) {
      nuxtApp.$api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    } else {
      delete nuxtApp.$api.defaults.headers.common['Authorization']
    }
  }

  const _clearAuth = () => {
    token().value = null
    user.value = null
    _setAuthHeader(null)
    authReady.value = true
  }

  const setAccessToken = (accessToken, opts = {}) => {
    const maxAge = opts.maxAge ?? 60
    token(maxAge).value = accessToken
    _setAuthHeader(accessToken)
  }

  // ===== Core =====
  const refreshAccessToken = async () => {
    if (inFlight.value) return inFlight.value

    const job = (async () => {
      const res = await nuxtApp.$api.post('/api/refresh')
      const newAccessToken = res?.data?.access_token
      if (!newAccessToken) throw new Error('No access_token from /api/refresh')
      setAccessToken(newAccessToken, { maxAge: 60 })
      return newAccessToken
    })()

    inFlight.value = job
    try {
      return await job
    } finally {
      inFlight.value = null
    }
  }

  const fetchUser = async () => {
    if (inFlight.value) {
      await inFlight.value
      return user.value
    }

    const job = (async () => {
      const t = token().value
      if (t) _setAuthHeader(t)

      try {
        const r1 = await nuxtApp.$api.get('/api/user')
        user.value = r1?.data ?? null
        authReady.value = true
        return user.value
      } catch (err) {
        if (err?.response?.status === 401) {
          try {
            await refreshAccessToken()
            const r2 = await nuxtApp.$api.get('/api/user')
            user.value = r2?.data ?? null
            authReady.value = true
            return user.value
          } catch (e) {
            _clearAuth()
            return null
          }
        } else {
          _clearAuth()
          return null
        }
      }
    })()

    inFlight.value = job
    try {
      return await job
    } finally {
      inFlight.value = null
    }
  }

  // Dipakai route protected
  const ensureAuth = async () => {
    if (user.value) {
      authReady.value = true
      return true
    }
    const u = await fetchUser()
    return !!u
  }

  // ===== Public =====
  const login = async ({ emailor_username, password }) => {
    try {
      const res = await nuxtApp.$api.post('/api/login', { emailor_username, password })
      const accessToken = res?.data?.access_token
      if (!accessToken) throw new Error('No access_token from /api/login')
      setAccessToken(accessToken, { maxAge: 60 }) // 1 menit
      await fetchUser()
      return true
    } catch (e) {
      _clearAuth()
      return Promise.reject(e)
    }
  }

  const loginWithToken = async (accessToken) => {
    setAccessToken(accessToken, { maxAge: 60 * 60 * 24 * 30 })
    await fetchUser()
  }

  const logout = async () => {
    try {
      if (nuxtApp.$api) {
        _setAuthHeader(token().value)
        await nuxtApp.$api.post('/api/logout')
      }
    } catch (e) {
      // ignore
    } finally {
      _clearAuth()
      await navigateTo('/', { replace: true })
    }
  }

  const checkAuth = async () => {
    return await ensureAuth()
  }

  return {
    user,
    authReady,
    token,
    login,
    loginWithToken,
    logout,
    ensureAuth,
    checkAuth,
    fetchUser,
    refreshAccessToken,
    _clearAuth,
    _setAuthHeader,
    setAccessToken,
  }
}
