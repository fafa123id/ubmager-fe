// middleware/guest.ts
import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  const { ensureAuth, user } = useAuth()

  // Tunggu hasil memastikan auth (agar tidak balapan)
  await ensureAuth()

  if (user.value) {
    // sudah login → lempar ke home
    return navigateTo('/')
  }
})
