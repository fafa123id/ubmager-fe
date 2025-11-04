<!-- pages/auth/otp.vue -->
<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const { $api } = useNuxtApp()
const route = useRoute()
const router = useRouter()

// Config & state
const OTP_TTL_MS = 5 * 60 * 1000
const RESEND_COOLDOWN_MS = 60 * 1000
const STORAGE_KEY = 'otpFlow'

const invalidAccess = ref(false)
const email = ref('')
const otp = ref('')
const errorMsg = ref('')
const successMsg = ref('')
const submitting = ref(false)
const sending = ref(false)

const now = ref(Date.now())
const startedAt = ref(null)
const lastResendAt = ref(null)
let ticker = null

// Computed
const expireAt = computed(() =>
  startedAt.value ? startedAt.value + OTP_TTL_MS : null
)
const remainingMs = computed(() =>
  expireAt.value ? Math.max(0, expireAt.value - now.value) : 0
)
const canSubmit = computed(() => otp.value.trim().length > 0 && remainingMs.value > 0 && !submitting.value)
const canResend = computed(() => {
  if (!startedAt.value || remainingMs.value <= 0) return false
  if (!lastResendAt.value) return true
  return now.value - lastResendAt.value >= RESEND_COOLDOWN_MS
})
const countdownDisplay = (ms) => {
  const s = Math.ceil(ms / 1000)
  const m = Math.floor(s / 60)
  const ss = (s % 60).toString().padStart(2, '0')
  return `${m}:${ss}`
}

// Actions
const submitVerify = async () => {
  if (!canSubmit.value) return
  submitting.value = true
  errorMsg.value = ''
  successMsg.value = ''
  try {
    await $api.post('/api/verify-email', { email: email.value, otp: otp.value })
    useSwal().showSuccess('Email berhasil diverifikasi.')
    sessionStorage.removeItem(STORAGE_KEY)
    setTimeout(() => router.push('/profile'), 700)
  } catch (e) {
    useSwal().showError(e?.response?.data?.message || 'Kode OTP salah atau kadaluarsa.')
  } finally {
    submitting.value = false
  }
}

const resendOtp = async () => {
  if (!canResend.value) return
  sending.value = true
  errorMsg.value = ''
  successMsg.value = ''
  try {
    await $api.post('/api/verify-email/send', { email: email.value })
    lastResendAt.value = Date.now()
    const raw = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}')
    raw.lastResendAt = lastResendAt.value
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(raw))
    useSwal().showSuccess('Kode OTP baru telah dikirim.')
  } catch (e) {
    useSwal().showError(e?.response?.data?.message || 'Gagal mengirim OTP.')
  } finally {
    sending.value = false
  }
}

// Guard
onMounted(() => {
  ticker = setInterval(() => (now.value = Date.now()), 500)
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) {
    invalidAccess.value = true
    return
  }
  let obj = {}
  try {
    obj = JSON.parse(raw)
  } catch {
    obj = {}
  }
  if (!obj.email || !obj.startedAt || !obj.guard) {
    invalidAccess.value = true
    return
  }
  email.value = obj.email
  startedAt.value = Number(obj.startedAt)
  lastResendAt.value = Number(obj.lastResendAt || 0)
  if (Date.now() - startedAt.value > OTP_TTL_MS) invalidAccess.value = true
})

onBeforeUnmount(() => {
  if (ticker) clearInterval(ticker)
})
</script>

<template>
  <main class="overflow-hidden relative min-h-dvh text-slate-100">
    <!-- Background -->
    <div class="absolute inset-0 -z-20 bg-[radial-gradient(60%_60%_at_50%_10%,#0f172a_0%,#0b1220_50%,#0a0f1a_100%)]"></div>
    <div class="pointer-events-none absolute -top-20 -left-24 h-72 w-72 rounded-full bg-sky-500/15 blur-3xl"></div>
    <div class="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl"></div>

    <section class="mx-auto grid min-h-dvh max-w-md place-items-center px-4 py-10">
      <div class="w-full rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
        <h1 class="mb-2 text-xl font-semibold">Verifikasi Email</h1>
        <p class="text-sm text-slate-300 mb-5">
          Masukkan kode OTP yang dikirim ke
          <span class="font-semibold text-slate-200">{{ email }}</span>.
        </p>

        <!-- Invalid -->
        <div
          v-if="invalidAccess"
          class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100"
        >
          Akses tidak valid. Silakan mulai proses verifikasi dari halaman profil.
          <div class="mt-3">
            <NuxtLink
              to="/profile"
              class="inline-block rounded-xl bg-white/10 px-4 py-2 text-xs ring-1 ring-white/10 hover:bg-white/15"
            >
              Kembali ke Profil
            </NuxtLink>
          </div>
        </div>

        <!-- Form OTP -->
        <div v-else>
          <div class="space-y-2">
            <p
              v-if="errorMsg"
              class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200"
            >
              {{ errorMsg }}
            </p>
            <p
              v-if="successMsg"
              class="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200"
            >
              {{ successMsg }}
            </p>
          </div>

          <!-- Input -->
          <div class="mt-4">
            <label class="mb-1 block text-xs text-slate-400">Kode OTP</label>
            <input
              v-model="otp"
              type="password"
              inputmode="numeric"
              placeholder="Masukkan kode OTP"
              class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-center text-lg text-slate-100 placeholder:text-slate-400 outline-none ring-1 ring-transparent focus:ring-sky-400"
            />
          </div>

          <!-- Timer + Resend -->
          <div class="mt-3 flex items-center justify-between text-xs text-slate-400">
            <div>
              Waktu tersisa:
              <span class="font-mono text-slate-100">{{ countdownDisplay(remainingMs) }}</span>
            </div>
            <button
              type="button"
              class="cursor-pointer rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-100 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!canResend || sending"
              @click="resendOtp"
            >
              {{ canResend ? (sending ? 'Mengirim...' : 'Kirim Ulang') : 'Tunggu...' }}
            </button>
          </div>

          <!-- Actions -->
          <div class="mt-5 flex gap-2">
            <button
              type="button"
              :disabled="!canSubmit"
              @click="submitVerify"
              class="flex-1 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/15 hover:bg-white/15 disabled:opacity-60"
            >
              {{ submitting ? 'Memverifikasi...' : 'Verifikasi' }}
            </button>
            <NuxtLink
              to="/profile"
              class="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 hover:bg-white/10"
            >
              Batal
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
