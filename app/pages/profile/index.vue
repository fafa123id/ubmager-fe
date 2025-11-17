<!-- pages/profile.vue -->
<script setup>
definePageMeta({
  auth: true,
});
import { ref, computed, onMounted } from "vue";
watch;
const ENDPOINTS = {
  me: "/api/user",
  updateProfile: "/api/user",
  uploadAvatar: "/api/user",
};
const verificationEmail = async () => {
  try {
    useSwal().showLoading();
    await $api.post(
      "/api/verify-email/send",
      { email: user.value.email },
      { withCredentials: true }
    );
    useSwal().showSuccess("Email verifikasi telah dikirim.");

    sessionStorage.setItem(
      "otpFlow",
      JSON.stringify({
        email: user.value.email, // ⬅️ pakai .value
        startedAt: Date.now(),
        lastResendAt: Date.now(),
        guard: "from-profile",
      })
    );

    navigateTo("/auth/otp?email=" + encodeURIComponent(user.value.email));
  } catch (e) {
    useSwal().showError(
      e?.response?.data?.message || "Gagal mengirim email verifikasi."
    );
  }
};
const { $api } = useNuxtApp();

/* ----- State ----- */
const loading = ref(true);
const saving = ref(false);
const errorMsg = ref("");
const successMsg = ref("");

const userForm = ref({
  name: "",
  username: "",
  email: "",
  phone: "",
  bio: "",
});
const user = ref({
  id: null,
  isVerified: false,
  name: "",
  username: "",
  email: "",
  phone: "",
  bio: "",
  avatarUrl: "",
  passwordIsSet: true,
  phoneIsSet: true,
});
/* ----- Lifecycle: Fetch profile ----- */
const fetchProfile = async () => {
  loading.value = true;
  errorMsg.value = "";
  try {
    const { data } = useAuth().user
    Object.assign(userForm.value, {
      email: data?.email ?? "",
      username: data?.username ?? "",
      name: data?.name ?? "",
      phone: data?.phone ?? "",
      bio: data?.bio ?? "",
    });
    Object.assign(user.value, {
      passwordIsSet: data?.password_is_set ?? false,
      isVerified: data?.is_verified ?? false,
      id: data?.id || null,
      name: data?.name ?? "",
      username: data?.username ?? "",
      email: data?.email ?? "",
      phone: data?.phone ?? "",
      phoneIsSet: data?.phone ? true : false,
      bio: data?.bio ?? "",
      avatarUrl: data?.image ?? "",
    });
  } catch (e) {
    errorMsg.value = e?.response?.data?.message || "Gagal memuat profil.";
  } finally {
    loading.value = false;
  }
};

/* ----- Derived ----- */
const initials = computed(() => {
  const parts = String(user.value.name || "")
    .trim()
    .split(/\s+/);
  return (
    parts
      .map((p) => p[0]?.toUpperCase())
      .slice(0, 2)
      .join("") || "U"
  );
});

const canSave = computed(
  () => userForm.value.name?.trim() && userForm.value.username?.trim()
);

/* ----- Actions ----- */
const onAvatarPick = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  errorMsg.value = "";
  successMsg.value = "";

  try {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("_method", "PUT");
    const res = await $api.post(`/api/user/${user.value.id}`, formData);
    const url = res?.data?.image;
    user.value.image = url;
    useSwal().showSuccess("Avatar diperbarui.");
    fetchProfile();
  } catch (err) {
    useSwal().showError(
      err?.response?.data?.message || "Gagal mengunggah avatar."
    );
  }
};

const saveProfile = async () => {
  if (!canSave.value || saving.value) return;
  saving.value = true;
  errorMsg.value = "";
  successMsg.value = "";
  try {
    const payload = {
      name: userForm.value.name,
      username: userForm.value.username,
      email: userForm.value.email,
      phone: userForm.value.phone,
      bio: userForm.value.bio,
    };
    if (user.value.email) {
      if (payload.email === "") {
        return useSwal().showError("Email tidak boleh dikosongkan.");
      }
    }
    if (user.value.phone) {
      if (payload.phone === "") {
        return useSwal().showError("Nomor HP tidak boleh dikosongkan.");
      }
    }
    await $api.put(`/api/user/${user.value.id}`, payload, {
      withCredentials: true,
    });
    useSwal().showSuccess("Profil berhasil diperbarui.");
    fetchProfile();
  } catch (e) {
    useSwal().showError(
      e?.response?.data?.message || "Gagal menyimpan profil."
    );
  } finally {
    saving.value = false;
  }
};

const changePassword = () => navigateTo("/settings/password");
const passwordInput = ref("");
const passwordConfirmationInput = ref("");
const showChangePasswordModal = ref(false);
const closeAndReset = () => {
  showChangePasswordModal.value = false;
  passwordInput.value = "";
  passwordConfirmationInput.value = "";
};
const savePassword = async () => {
  if (
    passwordInput.value.length < 6 ||
    passwordInput.value !== passwordConfirmationInput.value
  ) {
    useSwal().showError(
      "Password harus minimal 6 karakter dan sesuai dengan konfirmasi."
    );
    return;
  }
  try {
    loading.value = true;
    useSwal().showLoading();
    await $api.post(`/api/set-password`, {
      password: passwordInput.value,
      password_confirmation: passwordConfirmationInput.value,
    });
    useSwal().showSuccess("Kata sandi berhasil diperbarui.");
    closeAndReset();
    fetchProfile();
  } catch (e) {
    useSwal().showError(
      e?.response?.data?.message || "Gagal memperbarui kata sandi."
    );
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="relative min-h-dvh text-slate-100 overflow-hidden">
    <MyModal
      id="change-password-modal"
      :show="showChangePasswordModal"
      @close="closeAndReset"
    >
      <div class="p-6">
        <form @submit.prevent="savePassword">
          <h2 class="text-lg font-medium text-white">Masukkan Password Baru</h2>
          <div class="mt-6">
            <label class="mb-1 block text-xs text-slate-300">Password</label>
            <input
              v-model="passwordInput"
              type="password"
              class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 outline-none ring-1 ring-transparent focus:ring-sky-400 disabled:opacity-60"
              :disabled="loading"
              placeholder="Password"
              autocomplete="current-password"
            />
            <label class="mb-1 block text-xs text-slate-300"
              >Password Confirmation</label
            >
            <input
              v-model="passwordConfirmationInput"
              type="password"
              class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 outline-none ring-1 ring-transparent focus:ring-sky-400 disabled:opacity-60"
              :disabled="loading"
              placeholder="Password Confirmation"
              autocomplete="current-password_confirmation"
            />
          </div>
          <div class="mt-6 flex justify-end">
            <SecondaryButton @click="closeAndReset"> Cancel </SecondaryButton>
            <PrimaryButton
              class="ms-3"
              :class="{ 'opacity-25': loading }"
              :disabled="loading"
            >
              Add
            </PrimaryButton>
          </div>
        </form>
      </div>
    </MyModal>
    <!-- Background tema gelap-elegan -->
    <div
      class="absolute inset-0 -z-20 bg-[radial-gradient(60%_60%_at_50%_10%,#0f172a_0%,#0b1220_50%,#0a0f1a_100%)]"
    ></div>
    <div
      class="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,.25))]"
    ></div>
    <div
      class="absolute inset-0 -z-10 opacity-15 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
    >
      <div
        class="h-full w-full bg-[length:42px_42px] bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]"
      ></div>
    </div>
    <div
      class="pointer-events-none absolute -top-20 -left-24 h-72 w-72 rounded-full bg-sky-500/15 blur-3xl"
    ></div>
    <div
      class="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl"
    ></div>
    <p
      v-if="user.passwordIsSet === false"
      class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200"
    >
      Anda belum mengatur kata sandi. Silakan atur kata sandi untuk keamanan
      akun Anda.
      <button
        @click="showChangePasswordModal = true"
        class="text-sky-500 hover:underline"
      >
        Atur Kata Sandi
      </button>
    </p>
    <p
      v-if="user.phoneIsSet === false"
      class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200"
    >
      Anda belum mengatur nomor telepon. Silakan atur nomor telepon untuk mulai
      berbelanja di akun Anda.
    </p>
    <!-- Breadcrumbs kecil -->
    <div
      class="mx-auto max-w-7xl px-4 pt-6 text-xs text-slate-400 sm:px-6 lg:px-8"
    >
      <NuxtLink to="/" class="hover:underline">Beranda</NuxtLink>
      <span class="mx-2">/</span>
      <span class="text-slate-300">Profil</span>
    </div>

    <!-- Hero profil -->
    <section>
      <div class="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div
          class="flex flex-col items-center gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div class="flex items-center gap-4">
            <!-- Avatar -->
            <label
              class="group relative grid h-20 w-20 cursor-pointer place-items-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 ring-1 ring-white/10"
            >
              <input
                type="file"
                accept="image/*"
                class="hidden"
                @change="onAvatarPick"
                aria-label="Unggah avatar"
              />
              <img
                v-if="user.avatarUrl"
                :src="user.avatarUrl"
                alt="avatar"
                class="h-full w-full object-cover"
              />
              <span v-else class="text-lg font-semibold text-slate-200">{{
                initials
              }}</span>
              <span
                class="pointer-events-none absolute inset-0 hidden place-items-center bg-slate-950/30 text-xs text-slate-200 group-hover:grid"
                >Ganti</span
              >
            </label>

            <div>
              <h1 class="text-2xl font-bold tracking-tight">
                <template v-if="loading">
                  <span
                    class="inline-block h-6 w-48 animate-pulse rounded bg-white/10"
                  ></span>
                </template>
                <template v-else>{{ user.name || "—" }}</template>
              </h1>
              <p class="text-sm text-slate-300">
                <template v-if="loading">
                  <span
                    class="inline-block h-4 w-28 animate-pulse rounded bg-white/10"
                  ></span>
                </template>
                <template v-else>@{{ user.username || "—" }}</template>
              </p>
            </div>
          </div>

          <!-- Aksi cepat -->
          <div class="flex flex-wrap items-center gap-2">
            <NuxtLink
              to="/orders"
              class="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 hover:bg-white/10"
            >
              Lihat Pesanan
            </NuxtLink>
            <button
              @click="changePassword"
              class="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 hover:bg-white/10"
            >
              Ubah Kata Sandi
            </button>
          </div>
        </div>

        <!-- Alert -->
        <div class="mt-4 space-y-2">
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
      </div>
    </section>

    <!-- Konten utama -->
    <section>
      <div
        class="mx-auto max-w-7xl grid gap-6 px-4 py-8 sm:grid-cols-5 sm:px-6 lg:px-8"
      >
        <!-- Sidebar -->
        <aside class="sm:col-span-2 space-y-4">
          <div
            class="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl"
          >
            <h2 class="text-sm font-semibold">Menu Akun</h2>
            <ul class="mt-3 space-y-1 text-sm">
              <li>
                <NuxtLink
                  to="/orders"
                  class="block rounded-lg px-3 py-2 text-slate-200 ring-1 ring-white/0 hover:bg-white/5"
                  >Pesanan</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/settings"
                  class="block rounded-lg px-3 py-2 text-slate-200 ring-1 ring-white/0 hover:bg-white/5"
                  >Pengaturan</NuxtLink
                >
              </li>
            </ul>
          </div>

          <div
            class="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl"
          >
            <h3 class="text-sm font-semibold">Ringkasan</h3>
            <div class="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div
                class="rounded-xl border border-white/10 bg-white/5 px-3 py-2"
              >
                <div class="text-lg font-extrabold">0</div>
                <div class="text-slate-300">Transaksi</div>
              </div>
              <div
                class="rounded-xl border border-white/10 bg-white/5 px-3 py-2"
              >
                <div class="text-lg font-extrabold">0</div>
                <div class="text-slate-300">Favorit</div>
              </div>
              <div
                class="rounded-xl border border-white/10 bg-white/5 px-3 py-2"
              >
                <div class="text-lg font-extrabold">0</div>
                <div class="text-slate-300">Ulasan</div>
              </div>
            </div>
          </div>
        </aside>

        <!-- Form profil -->
        <div
          class="sm:col-span-3 rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl"
        >
          <div class="mb-4">
            <h2 class="text-lg font-semibold">Informasi Profil</h2>
            <p class="text-xs text-slate-300">Perbarui data akunmu.</p>
          </div>

          <form class="grid gap-4 sm:grid-cols-2" @submit.prevent="saveProfile">
            <div class="sm:col-span-2">
              <label class="mb-1 block text-xs text-slate-300"
                >Nama Lengkap</label
              >
              <input
                v-model="userForm.name"
                type="text"
                class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 outline-none ring-1 ring-transparent focus:ring-sky-400 disabled:opacity-60"
                :disabled="loading"
                placeholder="Nama kamu"
                autocomplete="name"
              />
            </div>

            <div>
              <label class="mb-1 block text-xs text-slate-300">Username</label>
              <input
                v-model="userForm.username"
                type="text"
                class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 outline-none ring-1 ring-transparent focus:ring-sky-400 disabled:opacity-60"
                :disabled="loading"
                placeholder="username"
                autocomplete="username"
              />
            </div>

            <div>
              <label class="mb-1 block text-xs text-slate-300">Nomor HP</label>
              <input
                v-model="userForm.phone"
                type="tel"
                class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 outline-none ring-1 ring-transparent focus:ring-sky-400 disabled:opacity-60"
                :disabled="loading"
                placeholder="08xxxxxxxxxx"
                autocomplete="tel"
              />
            </div>

            <div class="sm:col-span-2">
              <label class="mb-1 block text-xs text-slate-300">Email</label>
              <input
                v-model="userForm.email"
                type="email"
                class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 outline-none ring-1 ring-transparent focus:ring-indigo-400 disabled:opacity-60"
                :disabled="loading"
                placeholder="nama@kampus.ac.id"
                autocomplete="email"
              />
              <p class="mt-1 text-xs text-slate-400">
                <span v-if="!user.email">
                  Email Anda belum diset, Set Sekarang!
                </span>

                <span v-else-if="user.isVerified">
                  Email Anda sudah diverifikasi
                </span>

                <span v-else>
                  Email Anda belum diverifikasi
                  <button
                    type="button"
                    class="text-sky-500 hover:underline ml-1"
                    @click="verificationEmail"
                  >
                    Verifikasi sekarang!
                  </button>
                </span>
              </p>
              <div>
                <p></p>
              </div>
            </div>

            <div class="sm:col-span-2">
              <label class="mb-1 block text-xs text-slate-300">Bio</label>
              <textarea
                v-model="userForm.bio"
                rows="4"
                class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 outline-none ring-1 ring-transparent focus:ring-indigo-400 disabled:opacity-60"
                :disabled="loading"
                placeholder="Ceritakan tentang dirimu..."
              ></textarea>
            </div>

            <div class="sm:col-span-2 mt-2 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                :disabled="!canSave || saving || loading"
                class="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/15 transition-colors hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <svg
                  v-if="saving"
                  class="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="3"
                    class="opacity-25"
                  ></circle>
                  <path
                    d="M12 2a10 10 0 0110 10h-3A7 7 0 0012 5V2z"
                    fill="currentColor"
                    class="opacity-75"
                  ></path>
                </svg>
                Simpan Perubahan
              </button>

              <button
                type="button"
                @click="fetchProfile"
                :disabled="loading"
                class="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
                title="Muat ulang data dari server"
              >
                Muat Ulang
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer
      class="mx-auto max-w-7xl px-4 pb-10 text-center text-xs text-slate-400 sm:px-6 lg:px-8"
    >
      © {{ new Date().getFullYear() }} UBMager •
      <NuxtLink to="/kebijakan-privasi" class="hover:underline"
        >Privasi</NuxtLink
      >
      •
      <NuxtLink to="/syarat-ketentuan" class="hover:underline">S&K</NuxtLink>
    </footer>
  </div>
</template>
