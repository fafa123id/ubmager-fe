// middleware/auth.ts
import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  // biarkan halaman /auth/* bebas
  if (to.path.startsWith('/auth')) return

  const { ensureAuth, user } = useAuth()

  const ok = await ensureAuth()
  if (!ok || !user.value) {
    // Opsional: tampilkan swal di halaman tujuan (hindari swal di middleware SSR)
    return navigateTo(`/auth/login?next=${encodeURIComponent(to.fullPath)}`)
  }
})
