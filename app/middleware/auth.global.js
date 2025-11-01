// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const requiresAuth = to.meta.auth === true
  const { user, fetchUser } = useAuth()

  // Jika state belum ada (mis. first client nav), coba fetch
  if (user.value === null) {
    await fetchUser().catch(() => {})
  }

  // Belum login
  if (requiresAuth && !user.value) {
    return navigateTo(`/auth/login?next=${encodeURIComponent(to.fullPath)}`)
  }

})
