export default defineNuxtPlugin(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('New version available 🚀')
      if (confirm('Update tersedia. Reload sekarang?')) {
        window.location.reload()
      }
    })
  }
})