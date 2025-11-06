// middleware/guest.js
import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((to) => {
  const { user, token } = useAuth()

  // Hindari call API di halaman guest. Cukup cek local state/token.
  if (user.value || token().value) {
    return navigateTo('/', { replace: true })
  }
})
