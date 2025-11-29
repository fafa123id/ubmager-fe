<!-- pages/profile.vue -->
<script setup>
import ChangePw from "~/components/form/ChangePw.vue";
import OtpUnlinkGoogle from "~/components/form/OtpUnlinkGoogle.vue";
definePageMeta({
  middleware: "auth",
});
import { ref, computed, onMounted, watch } from "vue";
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
      { email: userObject.value.email },
      { withCredentials: true }
    );
    useSwal().showSuccess("Email verifikasi telah dikirim.");

    sessionStorage.setItem(
      "otpFlow",
      JSON.stringify({
        email: userObject.value.email, // ⬅️ pakai .value
        startedAt: Date.now(),
        lastResendAt: Date.now(),
        guard: "from-profile",
      })
    );

    navigateTo("/auth/otp?email=" + encodeURIComponent(userObject.value.email));
  } catch (e) {
    useSwal().showError(
      e?.response?.data?.message || "Gagal mengirim email verifikasi."
    );
  }
};
const { $api } = useNuxtApp();
const fetching = () => {
  loading.value = true;
  useSwal().showLoading();
  fetchUser().finally(() => {
    loading.value = false;
    useSwal().close();
  });
};
/* ----- State ----- */
const loading = ref(true);
const saving = ref(false);
const errorMsg = ref("");
const successMsg = ref("");
const { user, fetchUser, attachGoogle, unlinkGoogle, sendOtpForUnlinkGoogle } =
  useAuth();
const userForm = ref({
  name: "",
  username: "",
  email: "",
  phone: "",
  bio: "",
});
const userObject = ref({
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
  gmail: "",
});
watch(
  () => user.value,
  (u) => {
    if (!u) return;

    // SUPPORT DUA BENTUK: { data: {...} } atau {...}
    const d = u.data ?? u;

    userForm.value = {
      name: d.name ?? "",
      username: d.username ?? "",
      email: d.email ?? "",
      phone: d.phone ?? "",
      bio: d.bio ?? "",
    };

    userObject.value = {
      id: d.id ?? null,
      isVerified: d.is_verified ?? false,
      name: d.name ?? "",
      username: d.username ?? "",
      email: d.email ?? "",
      phone: d.phone ?? "",
      bio: d.bio ?? "",
      avatarUrl: d.image ?? "",
      passwordIsSet: d.password_is_set ?? true,
      phoneIsSet: d.phone_is_set ?? !!d.phone,
      gmail: d.gmail ?? "",
    };

    loading.value = false;
  },
  { immediate: true }
);

/* ----- Derived ----- */
const initials = computed(() => {
  const parts = String(userObject.valuename || "")
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
    loading.value = true;
    useSwal().showLoading();
    const res = await $api.post(`/api/user/${userObject.value.id}`, formData);
    useSwal().showSuccess("Avatar diperbarui.");
    fetchUser();
  } catch (err) {
    useSwal().showError(
      err?.response?.data?.message || "Gagal mengunggah avatar."
    );
  } finally {
    loading.value = false;
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
    if (userObject.value.email) {
      if (payload.email === "") {
        return useSwal().showError("Email tidak boleh dikosongkan.");
      }
    }
    if (userObject.value.phone) {
      if (payload.phone === "") {
        return useSwal().showError("Nomor HP tidak boleh dikosongkan.");
      }
    }
    await $api.put(`/api/user/${userObject.value.id}`, payload, {
      withCredentials: true,
    });
    useSwal().showSuccess("Profil berhasil diperbarui.");
    fetchUser();
  } catch (e) {
    useSwal().showError(
      e?.response?.data?.message || "Gagal menyimpan profil."
    );
  } finally {
    saving.value = false;
  }
};

const changePassword = () => {
  if (userObject.value.passwordIsSet === false) {
    useSwal().showError(
      "Anda belum mengatur kata sandi. Silakan atur kata sandi terlebih dahulu."
    );
    showCreatePasswordModal.value = true;
    return;
  }
  showChangePasswordModal.value = true;
};
const passwordInput = ref("");
const passwordConfirmationInput = ref("");
const showCreatePasswordModal = ref(false);
const closeAndReset = () => {
  showCreatePasswordModal.value = false;
  passwordInput.value = "";
  passwordConfirmationInput.value = "";
  showSetPassword.value = false;
  showSetPasswordConfirmation.value = false;
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
    fetchUser();
  } catch (e) {
    useSwal().showError(
      e?.response?.data?.message || "Gagal memperbarui kata sandi."
    );
  } finally {
    loading.value = false;
  }
};
const showChangePasswordModal = ref(false);

const processUnlinkGoogle = async () => {
  try {
    if (await sendOtpForUnlinkGoogle()) showUnlinkGoogleModal.value = true;
  } catch (e) {
    useSwal().showError(
      e?.response?.data?.message || "Gagal mengirim email konfirmasi."
    );
  }
};
const beginChangeEmail = async () => {
  const confirmed = await useSwal().confirmAction(
    "Konfirmasi Ubah Email",
    "Untuk mengubah email, Anda akan menerima OTP di email lama Anda sebagai konfirmasi."
  );
  if (!confirmed.isConfirmed) return;
  try {
    useSwal().showLoading();
    await useAuth().sendChangeEmailOtp();
    useSwal().showSuccess("OTP untuk mengubah email telah dikirim.");
    showChangeEmailModal.value = true;
  } catch (e) {
    useSwal().close();
    useSwal().showError(
      e?.response?.data?.message || "Gagal mengirim email konfirmasi."
    );
  }
};
const showUnlinkGoogleModal = ref(false);
const showSetEmailModal = ref(false);
const showChangeEmailModal = ref(false);
const showSetPassword = ref(false);
const toogleSetPassword = () => {
  showSetPassword.value = !showSetPassword.value;
};
const showSetPasswordConfirmation = ref(false);
const toogleSetPasswordConfirmation = () => {
  showSetPasswordConfirmation.value = !showSetPasswordConfirmation.value;
};
</script>
<template>
  <div class="relative min-h-dvh text-slate-100 overflow-hidden">
    <FormSetEmail
      :show="showSetEmailModal"
      @close="showSetEmailModal = false"
    />
    <FormChangeEmail
      :show="showChangeEmailModal"
      @close="showChangeEmailModal = false"
    />
    <OtpUnlinkGoogle
      :show="showUnlinkGoogleModal"
      @close="showUnlinkGoogleModal = false"
    />

    <ChangePw
      :show="showChangePasswordModal"
      @close="showChangePasswordModal = false"
    />
    <MyModal
      id="create-password-modal"
      :show="showCreatePasswordModal"
      @close="closeAndReset"
    >
      <div class="p-6">
        <form @submit.prevent="savePassword">
          <h2 class="text-lg font-medium text-white">Masukkan Password Baru</h2>
          <div class="mt-6 space-y-4">
            <label class="mb-1 block text-xs text-slate-300">Password</label>
            <div class="relative">
              <input
                v-model="passwordInput"
                :type="showSetPassword ? 'text' : 'password'"
                class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 outline-none ring-1 ring-transparent focus:ring-sky-400 disabled:opacity-60"
                :disabled="loading"
                placeholder="Password"
                autocomplete="new-password"
              />
              <ShowPassButton
                :id="'create-password-show-btn'"
                :showPass="showSetPassword"
                @toggleShow="toogleSetPassword"
                id="create-password-show-btn"
              />
            </div>

            <label class="mb-1 block text-xs text-slate-300"
              >Password Confirmation</label
            >
            <div class="relative">
              <input
                v-model="passwordConfirmationInput"
                :type="showSetPasswordConfirmation ? 'text' : 'password'"
                class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 outline-none ring-1 ring-transparent focus:ring-sky-400 disabled:opacity-60"
                :disabled="loading"
                placeholder="Password Confirmation"
                autocomplete="current-password_confirmation"
              />
              <ShowPassButton
                :id="'create-password-confirmation-show-btn'"
                :showPass="showSetPasswordConfirmation"
                @toggleShow="toogleSetPasswordConfirmation"
              />
            </div>
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
      v-if="userObject.passwordIsSet === false"
      class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200"
    >
      Anda belum mengatur kata sandi. Silakan atur kata sandi untuk keamanan
      akun Anda.
      <button
        @click="showCreatePasswordModal = true"
        class="text-sky-500 hover:underline"
      >
        Atur Kata Sandi
      </button>
    </p>
    <p
      v-if="userObject.phoneIsSet === false"
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
          <ClientOnly>
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
                  v-if="userObject.avatarUrl"
                  :src="userObject.avatarUrl"
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
                  <template v-else>{{ userObject.name || "—" }}</template>
                </h1>
                <p class="text-sm text-slate-300">
                  <template v-if="loading">
                    <span
                      class="inline-block h-4 w-28 animate-pulse rounded bg-white/10"
                    ></span>
                  </template>
                  <template v-else>@{{ userObject.username || "—" }}</template>
                </p>
              </div>
            </div>
          </ClientOnly>
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
          <ClientOnly>
            <div
              class="mb-6 flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <p>Penautan Akun Google</p>
              <div>
                <FontAwesomeIcon
                  icon="fa-brands fa-google"
                  class="text-white text-3xl"
                />
                <span class="ml-2 text-sm text-slate-300">{{
                  userObject.gmail || "Belum ditautkan"
                }}</span>

                <button
                  v-if="!userObject.gmail"
                  @click="attachGoogle"
                  class="ms-4 inline-block rounded-lg bg-sky-500 px-3 py-1 text-xs text-white hover:bg-sky-600"
                >
                  Tautkan
                </button>
                <button
                  v-else
                  @click="processUnlinkGoogle"
                  class="ms-4 inline-block rounded-lg bg-rose-500 px-3 py-1 text-xs text-white hover:bg-rose-600"
                >
                  Lepas
                </button>
              </div>
            </div>
            <form
              class="grid gap-4 sm:grid-cols-2"
              @submit.prevent="saveProfile"
            >
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
                <label class="mb-1 block text-xs text-slate-300"
                  >Username</label
                >
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
                <label class="mb-1 block text-xs text-slate-300"
                  >Nomor HP</label
                >
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
                <div class="flex items-center gap-2">
                  <h2
                    class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 outline-none ring-1 ring-transparent focus:ring-indigo-400"
                  >
                    {{ userObject.email || "—" }}
                  </h2>
                  <button
                    type="button"
                    @click="
                      userObject.email
                        ? beginChangeEmail()
                        : (showSetEmailModal = true)
                    "
                    :disabled="loading"
                    class="max-[650px]:w-fit w-38 cursor-pointer inline-block items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
                    title="{{userObject.email? 'Ganti email' : 'Set email'}}"
                  >
                    {{ userObject.email ? "Ganti Email" : "Set Email" }}
                  </button>
                </div>
                <p class="mt-1 text-xs text-slate-400">
                  <span v-if="!userObject.email">
                    Email Anda belum diset, Set Sekarang!
                  </span>

                  <span v-else-if="userObject.isVerified">
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
                  @click="fetching"
                  :disabled="loading"
                  class="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
                  title="Muat ulang data dari server"
                >
                  Muat Ulang
                </button>
              </div>
            </form>
          </ClientOnly>
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
