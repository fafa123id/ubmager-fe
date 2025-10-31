export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return
      const el = e.target

      // opsional delay: <div class="reveal" data-delay="120">
      const delay = el.dataset.delay ? Number(el.dataset.delay) : 0
      el.style.setProperty('--rv-delay', `${delay}ms`)

      el.classList.add('reveal-in')
      el.classList.remove('reveal-init')

      // 🔒 sekali saja: stop observe setelah reveal
      io.unobserve(el)
    })
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 })

  const init = () => {
    document.querySelectorAll('.reveal').forEach((el) => {
      // kalau sudah pernah di-reveal, biarkan saja (no reset)
      if (!el.classList.contains('reveal-in')) el.classList.add('reveal-init')
      io.observe(el)
    })
  }

  // pertama kali mount
  window.requestAnimationFrame(init)
  // tiap selesai pindah halaman (SPA), observe elemen baru
  window.addEventListener('nuxt:page:finish', () => setTimeout(init, 0))
})
