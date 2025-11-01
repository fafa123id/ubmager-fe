// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const requiresAuth = to.meta.auth === true
  const { user, checkAuth } = useAuth()

  await checkAuth();

  // Belum login
  if (requiresAuth && !user.value) {
    return navigateTo(`/auth/login?next=${encodeURIComponent(to.fullPath)}`)
  }

})
