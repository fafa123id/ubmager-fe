export default defineNuxtPlugin(() => {
  const { fetchUser } = useAuth()
  const { setLoading } = useLoading()

  setLoading(true)

  fetchUser()
    .catch((error) => {
      console.error("Auth Plugin: Gagal fetchUser saat init:", error)
    })
    .finally(() => {
      setLoading(false)
    })
})
