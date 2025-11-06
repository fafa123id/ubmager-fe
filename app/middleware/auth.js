// middleware/auth.js
import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path.startsWith('/auth')) return

  const { ensureAuth, user } = useAuth()

  const ok = await ensureAuth()
  if (!ok || !user.value) {
    return navigateTo(`/auth/login?next=${encodeURIComponent(to.fullPath)}`, { replace: true })
  }
})
