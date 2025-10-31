// plugins/api.ts
export default defineNuxtPlugin(() => {
  const api = $fetch.create({
    baseURL: 'https://api.ubmager.bornhub.cloud',
    credentials: 'include', // <== penting supaya kirim cookie
  })
  return { provide: { api } }
})
