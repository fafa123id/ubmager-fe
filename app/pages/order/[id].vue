<script setup>
import { ref, onMounted, computed } from "vue";
definePageMeta({
  middleware: "auth",
});
const route = useRoute();
const router = useRouter();
const { $api } = useNuxtApp();

// State
const order = ref(null);
const loading = ref(false);
const error = ref(null);

// Status mapping
const statusConfig = {
  pending: {
    label: "Menunggu Pembayaran",
    color: "amber",
    icon: "⏳",
  },
  processing: {
    label: "Diproses",
    color: "blue",
    icon: "⚙️",
  },
  processed: {
    label: "Dikirim",
    color: "sky",
    icon: "🚚",
  },
  finished: {
    label: "Selesai",
    color: "emerald",
    icon: "✓",
  },
  cancelled: {
    label: "Dibatalkan",
    color: "red",
    icon: "✕",
  },
};
const downloadReceipt = async (receipt) => {
  try {
    const url = await useOrder().downloadReceipt(receipt);
    window.open(url, "_blank");
  } catch (err) {
    console.error("Failed to download receipt:", err);
    useSwal().showError(err.data?.message || "Gagal mengunduh receipt");
  }
};
// Payment method mapping
const paymentMethodConfig = {
  credit_card: "Kartu Kredit",
  bank_transfer: "Transfer Bank",
  gopay: "GoPay",
  shopeepay: "ShopeePay",
  other_qris: "QRIS",
  alfamart: "Alfamart",
  indomaret: "Indomaret",
  midtrans: "Midtrans",
};
const finishOrder = async (orderId) => {
  const confirmation = await useSwal().confirmAction(
    "Apakah Anda yakin ingin menyelesaikan order ini?",
    "Tindakan ini tidak dapat dibatalkan.",
  );
  if (!confirmation.isConfirmed) {
    return;
  }
  useOrder()
    .finishOrder(orderId)
    .then(() => {
      useSwal().showSuccess("Order berhasil diselesaikan");
      fetchOrderDetail();
    })
    .catch((err) => {
      console.error("Failed to finish order:", err);
      useSwal().showError(err.data?.message || "Gagal menyelesaikan order");
    });
};
// Computed properties
const currentStatus = computed(() => {
  return order.value?.status || "pending";
});
const cancelOrder = async () => {
  try {
    const confirmation = await useSwal().confirmAction(
      "Apakah Anda yakin ingin membatalkan order ini?",
      "Tindakan ini tidak dapat dibatalkan.",
    );
    if (!confirmation.isConfirmed) {
      return;
    }

    loading.value = true;
    error.value = null;

    // Tunggu interceptor selesai refresh jika ada 401
    await waitForRefreshIfNeeded();
    await useOrder().cancelOrder(route.params.id);
    useSwal().showSuccess("Order berhasil dibatalkan");
    fetchOrderDetail();
  } catch (err) {
    console.error("Failed to cancel order:", err);
    error.value = err.data?.message || "Gagal membatalkan order";
    useSwal().showError(error.value);
  } finally {
    loading.value = false;
  }
};
const statusInfo = computed(() => {
  return statusConfig[currentStatus.value] || statusConfig.pending;
});

const formattedPrice = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

const productImages = computed(() => {
  if (!order.value?.product) return [];
  const images = [];
  if (order.value.product.image1) images.push(order.value.product.image1);
  if (order.value.product.image2) images.push(order.value.product.image2);
  if (order.value.product.image3) images.push(order.value.product.image3);
  return images;
});

// Methods
/**
 * Tunggu interceptor selesai refresh jika ada 401
 * Sebelum fetch order
 */
const waitForRefreshIfNeeded = async () => {
  while (useLoading().loadingState.value === true) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
};

const fetchOrderDetail = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Tunggu interceptor selesai refresh jika ada 401
    await waitForRefreshIfNeeded();

    // Baru fetch order dengan token yang valid
    const response = await useOrder().getOrderById(route.params.id);
    console.log("Order detail response:", response);
    order.value = response;
  } catch (err) {
    console.error("Failed to fetch order detail:", err);
    error.value = err.data?.message || "Gagal memuat detail order";
    router.back().then(() => {
      window.location.reload();
    });
  } finally {
    loading.value = false;
  }
};

const handlePaymentClick = () => {
  if (order.value?.transaction?.link_payment) {
    window.open(order.value.transaction.link_payment, "_blank");
  } else {
    useSwal().showError("Link pembayaran tidak tersedia");
  }
};

const goBack = () => {
  router.back();
};

const copyReceipt = () => {
  if (order.value?.transaction?.receipt) {
    navigator.clipboard.writeText(order.value.transaction.receipt);
    useSwal().showSuccess("Receipt berhasil disalin");
  }
};
onMounted(() => {
  fetchOrderDetail();
});
const showRatingModal = ref(false);
const productId = ref(123);
const productName = ref("Nama Produk");
const handleRatingSuccess = (response) => {
  fetchOrderDetail();
  showRatingModal.value = false;
};
const OpenRatingModal = (id, name) => {
  productId.value = id;
  productName.value = name;
  showRatingModal.value = true;
};
</script>

<template>
  <div class="relative min-h-dvh text-slate-100 overflow-hidden">
    <UserRatingModal
      :show="showRatingModal"
      :productId="productId"
      :productName="productName"
      @close="showRatingModal = false"
      @success="handleRatingSuccess"
    />
    <!-- BG -->
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

    <!-- Header with Back Button -->
    <section class="relative mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
      <button
        @click="goBack"
        class="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition-all duration-200 hover:bg-white/10 hover:border-white/25"
      >
        <svg
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Kembali
      </button>
    </section>

    <!-- Loading State -->
    <section
      v-if="loading"
      class="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <div class="space-y-6">
        <div class="h-10 w-1/3 rounded-lg bg-slate-700/50 animate-pulse"></div>
        <div class="grid gap-8 lg:grid-cols-3">
          <div
            class="lg:col-span-2 rounded-2xl border border-white/10 bg-slate-900/60 h-96 animate-pulse"
          ></div>
          <div
            class="rounded-2xl border border-white/10 bg-slate-900/60 h-96 animate-pulse"
          ></div>
        </div>
      </div>
    </section>

    <!-- Error State -->
    <section
      v-else-if="error && !order"
      class="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <div
        class="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center"
      >
        <svg
          class="h-12 w-12 mx-auto mb-3 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p class="text-red-300 mb-4">{{ error }}</p>
        <button
          @click="goBack"
          class="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-500/90 to-indigo-600/90 px-4 py-2 text-sm font-semibold text-white"
        >
          Kembali
        </button>
      </div>
    </section>

    <!-- Order Detail -->
    <section
      v-else-if="order"
      class="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <!-- Header with Title and Status -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-100 mb-3">Detail Order</h1>
        <div
          class="flex items-center gap-3 max-[500px]:flex-wrap max-[500px]:flex-col"
        >
          <span class="text-sm text-slate-400">Receipt:</span>
          <div
            class="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2"
          >
            <span class="font-mono text-sm font-semibold text-sky-300">
              {{ order.transaction?.receipt || "N/A" }}
            </span>
            <button
              v-if="order.transaction?.receipt"
              @click="copyReceipt"
              class="p-1 text-slate-400 hover:text-slate-200 transition-colors"
              title="Salin receipt"
            >
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
                />
              </svg>
            </button>
          </div>
          <button
            v-if="
              order.transaction?.status === 'success' &&
              order.transaction?.receipt
            "
            @click="downloadReceipt(order.transaction?.receipt)"
            class="min-[500px]:ml-auto flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-yellow-500 hover:from-indigo-700 hover:to-yellow-600 text-white font-semibold px-3 py-2 transition-all duration-200"
          >
            Download Receipt
            <svg class="h-4 w-4 ml-2" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M5 20h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-5l-2-2H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2zm7-11l5 5h-3v4h-4v-4H7l5-5z"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Status Badge -->
      <div
        class="mb-8 min-[500px]:inline-flex max-[500px]:flex justify-center items-center gap-4 max-[500px]:flex-wrap"
      >
        <div
          :class="[
            'flex items-center gap-2 rounded-lg px-4 py-2 ring-1',
            statusInfo.color === 'amber'
              ? 'bg-amber-500/20 text-amber-300 ring-amber-400/30'
              : statusInfo.color === 'blue'
                ? 'bg-blue-500/20 text-blue-300 ring-blue-400/30'
                : statusInfo.color === 'sky'
                  ? 'bg-sky-500/20 text-sky-300 ring-sky-400/30'
                  : statusInfo.color === 'emerald'
                    ? 'bg-emerald-500/20 text-emerald-300 ring-emerald-400/30'
                    : 'bg-red-500/20 text-red-300 ring-red-400/30',
          ]"
        >
          <span class="text-xl">{{ statusInfo.icon }}</span>
          <span class="font-semibold">{{ statusInfo.label }}</span>
        </div>
        <button
          v-if="order.status === 'finished' && order.is_rated == false"
          @click="OpenRatingModal(order.id, order.product.name)"
          class="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 ring-1 ring-yellow-300/50 hover:ring-yellow-300 shadow-lg hover:shadow-xl"
        >
          ⭐ Rate
        </button>
        <div
          v-else-if="order.status === 'finished' && order.is_rated == true"
          class="flex items-center gap-2 px-4 py-2 rounded-lg ring-1 text-md font-semibold bg-emerald-500/20 text-emerald-300 ring-emerald-400/30"
        >
          <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
          Sudah Dinilai
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid gap-8 lg:grid-cols-3">
        <!-- Left Column: Product and Order Info -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Product Card -->
          <div
            class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <h2 class="text-lg font-semibold text-slate-100 mb-4">Produk</h2>

            <div class="grid gap-6 sm:grid-cols-2">
              <!-- Product Image -->
              <div
                v-if="productImages.length > 0"
                class="rounded-xl overflow-hidden bg-slate-800 aspect-square"
              >
                <img
                  :src="productImages[0]"
                  :alt="order.product?.name"
                  class="w-full h-full object-cover"
                />
              </div>
              <div
                v-else
                class="rounded-xl overflow-hidden bg-slate-800 aspect-square flex items-center justify-center"
              >
                <svg
                  class="h-16 w-16 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <!-- Product Details -->
              <div class="space-y-4">
                <div>
                  <p class="text-xs text-slate-400 mb-1">Nama Produk</p>
                  <h3 class="text-xl font-bold text-slate-100">
                    {{ order.product?.name || "N/A" }}
                  </h3>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <p class="text-xs text-slate-400 mb-1">Tipe</p>
                    <p class="text-sm font-semibold text-slate-200">
                      {{ order.product?.type || "N/A" }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-slate-400 mb-1">Kategori</p>
                    <p class="text-sm font-semibold text-slate-200">
                      {{ order.product?.category || "N/A" }}
                    </p>
                  </div>
                </div>

                <div>
                  <p class="text-xs text-slate-400 mb-1">Deskripsi</p>
                  <p class="text-sm text-slate-300 line-clamp-3">
                    {{ order.product?.description || "N/A" }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-slate-400 mb-1">Penjual</p>
                  <p class="text-sm text-slate-300 line-clamp-3">
                    {{ order.product?.user.name || "N/A" }}
                  </p>
                </div>
                <div>
                  <NuxtLink
                    :to="`/produk/${order.product?.id}`"
                    class="inline-flex rounded-lg bg-gradient-to-r from-sky-500/90 to-indigo-600/90 px-3 py-2 text-xs font-semibold text-white ring-1 ring-white/20 hover:from-sky-600/90 hover:to-indigo-700/90 transition-all duration-200"
                  >
                    Lihat Detail Produk
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Details -->
          <div
            class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <h2 class="text-lg font-semibold text-slate-100 mb-4">
              Detail Order
            </h2>

            <div class="space-y-3">
              <!-- Quantity -->
              <div
                class="flex items-center justify-between pb-3 border-b border-white/10"
              >
                <span class="text-slate-400">Jumlah</span>
                <span class="text-lg font-semibold text-slate-100"
                  >{{ order.quantity }}x</span
                >
              </div>

              <!-- Harga Satuan -->
              <div
                class="flex items-center justify-between pb-3 border-b border-white/10"
              >
                <span class="text-slate-400">Harga Satuan</span>
                <span class="font-semibold text-slate-200">
                  {{ formattedPrice(order.product?.price || 0) }}
                </span>
              </div>
              <!-- Biaya Aplikasi -->
              <div
                class="flex items-center justify-between pb-3 border-b border-white/10"
              >
                <span class="text-slate-400">Biaya Aplikasi</span>
                <span class="font-semibold text-slate-200">
                  {{ formattedPrice(2000) }}
                </span>
              </div>
              <!-- Biaya Lain Lain -->
              <div
                class="flex items-center justify-between pb-3 border-b border-white/10"
              >
                <span class="text-slate-400">Biaya Lain Lain</span>
                <span class="font-semibold text-slate-200">
                  {{ formattedPrice(1000) }}
                </span>
              </div>
              <!-- Total Price -->
              <div class="flex items-center justify-between pt-3">
                <span class="text-slate-300 font-semibold">Total Harga</span>
                <span
                  class="text-2xl font-bold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent"
                >
                  {{ formattedPrice(order.total_price) }}
                </span>
              </div>
            </div>
            <button
              v-if="order.status === 'processed'"
              class="mt-4 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 bg-emerald-500/90 text-white hover:bg-emerald-500 ring-1 ring-emerald-400/50"
              @click="finishOrder(order.id)"
            >
              Selesaikan Pesanan
            </button>
          </div>

          <!-- Address (if available) -->
          <div
            v-if="order.address"
            class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <h2 class="text-lg font-semibold text-slate-100 mb-4">
              Alamat Pengiriman
            </h2>
            <p class="text-slate-300">{{ order.address }}</p>
          </div>
        </div>

        <!-- Right Column: Transaction Info -->
        <div class="space-y-6">
          <!-- Transaction Card -->
          <div
            class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl space-y-4"
          >
            <h2 class="text-lg font-semibold text-slate-100">
              Informasi Pembayaran
            </h2>

            <!-- Payment Method -->
            <div>
              <p class="text-xs text-slate-400 mb-2">Metode Pembayaran</p>
              <div
                class="flex items-center gap-2 bg-slate-800/50 rounded-lg p-3"
              >
                <span class="text-2xl">💳</span>
                <span class="font-semibold text-slate-200">
                  {{
                    paymentMethodConfig[order.transaction?.payment_method] ||
                    order.transaction?.payment_method
                  }}
                </span>
              </div>
            </div>

            <!-- Transaction ID -->
            <div>
              <p class="text-xs text-slate-400 mb-2">ID Transaksi</p>
              <p class="font-mono text-sm text-sky-300 break-all">
                {{ order.transaction?.id || "N/A" }}
              </p>
            </div>

            <!-- Status -->
            <div>
              <p class="text-xs text-slate-400 mb-2">Status Pembayaran</p>
              <div
                :class="[
                  'rounded-lg px-3 py-2 font-semibold text-center',
                  order.transaction?.status === 'pending'
                    ? 'bg-amber-500/20 text-amber-300'
                    : order.transaction?.status === 'success'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-red-500/20 text-red-300',
                ]"
              >
                {{
                  order.transaction?.status === "pending"
                    ? "Menunggu Pembayaran"
                    : order.transaction?.status === "success"
                      ? "Dibayar"
                      : "Gagal"
                }}
              </div>
            </div>

            <!-- Order Date -->
            <div>
              <p class="text-xs text-slate-400 mb-2">Tanggal Order</p>
              <p class="text-sm text-slate-300">
                {{
                  order.created_at
                    ? new Date(order.created_at).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "N/A"
                }}
              </p>
            </div>
            <!-- Payment Date -->
            <div v-if="order.transaction?.status === 'success'">
              <p class="text-xs text-slate-400 mb-2">Tanggal Pembayaran</p>
              <p class="text-sm text-slate-300">
                {{
                  order.transaction?.updated_at
                    ? new Date(
                        order.transaction?.updated_at,
                      ).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "N/A"
                }}
              </p>
            </div>
            <!-- Divider -->
            <div class="border-t border-white/10"></div>

            <!-- Action Button -->
            <div
              v-if="
                order.transaction?.status === 'pending' &&
                order.transaction?.link_payment
              "
              class="space-y-4"
            >
              <button
                @click="handlePaymentClick"
                class="w-full rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold py-3 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M3 10h18V5H3v5zm0 8h18v-6H3v6zm1-5h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"
                  />
                </svg>
                Lanjutkan Pembayaran
              </button>
              <button
                @click="fetchOrderDetail"
                class="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-yellow-500 hover:from-indigo-700 hover:to-yellow-600 text-white font-semibold py-3 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Check Status Pembayaran
              </button>
              <button
                @click="cancelOrder"
                class="w-full rounded-lg bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-3 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Batalkan Order
              </button>
            </div>

            <button
              v-else-if="order.transaction?.status === 's '"
              disabled
              class="w-full rounded-lg bg-emerald-500/20 text-emerald-300 font-semibold py-3 border border-emerald-400/30 cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              Pembayaran Berhasil
            </button>

            <button
              v-else
              disabled
              class="w-full rounded-lg bg-slate-700/30 text-slate-400 font-semibold py-3 cursor-not-allowed"
            >
              Tidak Ada Aksi
            </button>
          </div>

          <!-- Rating Card (if available) -->
          <div
            v-if="order.is_rated"
            class="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6"
          >
            <div class="flex items-center gap-2 text-emerald-300 font-semibold">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              Produk sudah dinilai
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
