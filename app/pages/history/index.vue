<script setup>
import { ref, computed, onMounted } from "vue";

definePageMeta({
  middleware: "auth",
});

const { $api } = useNuxtApp();
const { orders, loading, pagination, getOrderHistory } = useOrderHistory();

// Filter dan pagination
const statusFilter = ref(null);
const currentPage = ref(1);
const perPage = 5;

// Status mapping
const statusMap = {
  pending: { label: "Belum Dibayar", color: "amber", icon: "clock" },
  processing: { label: "Diproses", color: "blue", icon: "hourglass" },
  processed: { label: "Telah Diproses", color: "sky", icon: "check" },
  finished: { label: "Selesai", color: "emerald", icon: "check-circle" },
  cancelled: { label: "Dibatalkan", color: "red", icon: "x-circle" },
};

const statusOptions = [
  { value: null, label: "Semua Status" },
  { value: "pending", label: "Belum Dibayar" },
  { value: "processing", label: "Diproses" },
  { value: "processed", label: "Telah Diproses" },
  { value: "finished", label: "Selesai" },
  { value: "cancelled", label: "Dibatalkan" },
];
const paymentMethodConfig = {
  credit_card: "Kartu Kredit",
  bank_transfer: "Transfer Bank",
  gopay: "GoPay",
  shopeepay: "ShopeePay",
  qris: "QRIS",
  alfamart: "Alfamart",
  indomaret: "Indomaret",
  midtrans: "Midtrans",
};

// Helper function untuk get payment method name
const getPaymentMethodName = (method) => {
  return paymentMethodConfig[method] || method;
};
// Fetch orders when filter/page changes
const fetchOrders = async () => {
  try {
    if (useAuth().user.value === null) return;
    await getOrderHistory(statusFilter.value, currentPage.value, perPage);
  } catch (err) {
    useSwal().showError(
      err?.response?.data?.message || "Gagal memuat riwayat pesanan"
    );
  }
};

onMounted(async () => {
  while (useLoading().loadingState.value === true) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  fetchOrders();
});

// Format currency
const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

// Get action button text and handler
const getActionButton = (order) => {
  switch (order.status) {
    case "pending":
      return {
        text: "Bayar Sekarang",
        color: "sky",
        handler: () => {
          if (order.transaction?.link_payment) {
            window.open(order.transaction.link_payment, "_blank");
          } else {
            useSwal().showError("Link pembayaran tidak tersedia");
          }
        },
      };
    case "processing":
      return { text: null, color: null, handler: null };
    case "processed":
      return {
        text: "Selesaikan Pesanan",
        color: "emerald",
        handler: () => {
          useSwal().showInfo("Fitur selesaikan pesanan sedang dikembangkan");
        },
      };
    case "finished":
    case "cancelled":
      return {
        text: "Beli Lagi",
        color: "indigo",
        handler: () => {
          navigateTo(`/produk/${order.product.id}`);
        },
      };
    default:
      return { text: null, color: null, handler: null };
  }
};

// Pagination handlers
const goToPage = (page) => {
  currentPage.value = page;
  fetchOrders();
};

const previousPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1);
  }
};

const nextPage = () => {
  if (currentPage.value < pagination.value.lastPage) {
    goToPage(currentPage.value + 1);
  }
};

// Filter handler
const onFilterChange = () => {
  currentPage.value = 1;
  fetchOrders();
};

// Computed untuk jumlah halaman
const pageNumbers = computed(() => {
  const pages = [];
  const maxPages = Math.min(pagination.value.lastPage, 5);
  let startPage = Math.max(1, currentPage.value - 2);
  let endPage = Math.min(pagination.value.lastPage, startPage + 4);

  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});
</script>

<template>
  <div class="relative min-h-dvh text-slate-100 overflow-hidden">
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

    <!-- Header -->
    <section class="relative mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
      <div class="flex items-center gap-3 mb-8">
        <button
          @click="$router.back()"
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
        <h1 class="text-3xl font-bold">Riwayat Pesanan</h1>
      </div>

      <!-- Filter Panel -->
      <div
        class="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl mb-6"
      >
        <label class="text-sm font-semibold text-slate-200 mb-3 block"
          >Filter Status</label
        >
        <div class="flex flex-wrap gap-2">
          <button
            v-for="status in statusOptions"
            :key="status.value"
            @click="
              statusFilter = status.value;
              onFilterChange();
            "
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              statusFilter === status.value
                ? 'bg-sky-500/90 text-white ring-1 ring-sky-400/50'
                : 'bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10 hover:border-white/20',
            ]"
          >
            {{ status.label }}
          </button>
        </div>
      </div>
    </section>
    <section
      class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      v-if="orders.length > 0"
    >
      <h2 class="text-lg font-semibold text-slate-200">
        Total:
        <span class="text-sky-400">{{ pagination.total }}</span>
        pesanan
      </h2>
    </section>

    <!-- Orders List -->
    <section class="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="loading" class="space-y-4">
        <div
          v-for="i in 3"
          :key="i"
          class="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl animate-pulse"
        >
          <div class="h-6 w-1/3 rounded-lg bg-white/10 mb-4"></div>
          <div class="h-4 w-2/3 rounded-lg bg-white/10"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="orders.length === 0"
        class="rounded-2xl border border-white/10 bg-slate-900/60 p-12 backdrop-blur-xl text-center"
      >
        <svg
          class="h-16 w-16 mx-auto mb-4 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10"
          />
        </svg>
        <h3 class="text-xl font-semibold text-slate-200 mb-2">
          Tidak ada pesanan
        </h3>
        <p class="text-slate-400 mb-6">
          Anda belum memiliki pesanan dengan status ini
        </p>
        <NuxtLink
          to="/produk"
          class="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-500/90 to-indigo-600/90 px-4 py-2 text-sm font-semibold text-white hover:from-sky-500 hover:to-indigo-600 transition-all"
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
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
          Belanja Sekarang
        </NuxtLink>
      </div>

      <!-- Orders Cards -->
      <div v-else class="space-y-4">
        <div
          v-for="order in orders"
          :key="order.id"
          @click="navigateTo(`/order/${order.id}`)"
          class="group cursor-pointer rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl hover:border-white/20 hover:bg-slate-900/80 transition-all duration-200"
        >
          <!-- Header: Receipt, Status, Date -->
          <div class="flex items-start justify-between gap-4 mb-4">
            <div>
              <p class="text-xs text-slate-400 mb-1">Receipt</p>
              <p class="text-sm font-semibold text-slate-100">
                {{ order.transaction?.receipt || `Order #${order.id}` }}
              </p>
            </div>
            <div class="text-right">
              <!-- Status Badge -->
              <div
                :class="[
                  'inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold mb-2',
                  statusMap[order.status]?.color === 'amber'
                    ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/30'
                    : statusMap[order.status]?.color === 'blue'
                    ? 'bg-blue-500/20 text-blue-300 ring-1 ring-blue-400/30'
                    : statusMap[order.status]?.color === 'sky'
                    ? 'bg-sky-500/20 text-sky-300 ring-1 ring-sky-400/30'
                    : statusMap[order.status]?.color === 'emerald'
                    ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30'
                    : 'bg-red-500/20 text-red-300 ring-1 ring-red-400/30',
                ]"
              >
                <svg
                  v-if="statusMap[order.status]?.icon === 'clock'"
                  class="h-3.5 w-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-5-3v-4.9z"
                  />
                </svg>
                <svg
                  v-else-if="statusMap[order.status]?.icon === 'check'"
                  class="h-3.5 w-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                  />
                </svg>
                <span>{{ statusMap[order.status]?.label }}</span>
              </div>
              <p class="text-xs text-slate-400">
                {{ new Date(order.created_at).toLocaleDateString("id-ID") }}
              </p>
            </div>
          </div>

          <!-- Divider -->
          <div class="h-px bg-white/10 mb-4"></div>

          <!-- Product Info -->
          <div class="flex gap-4 mb-4">
            <!-- Product Image -->
            <div
              class="h-20 w-20 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0"
            >
              <img
                :src="order.product?.image1 || '/placeholder.png'"
                :alt="order.product?.name"
                class="h-full w-full object-cover"
              />
            </div>

            <!-- Product Details -->
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-slate-100 truncate mb-1">
                {{ order.product?.name }}
              </h3>
              <p class="text-xs text-slate-400 mb-2">
                {{ order.product?.category }}
              </p>
              <p class="text-sm text-slate-300">
                Qty: <span class="font-semibold">{{ order.quantity }}</span>
              </p>
            </div>

            <!-- Price -->
            <div class="text-right flex-shrink-0">
              <p class="text-xs text-slate-400 mb-1">Total Harga</p>
              <p class="text-lg font-bold text-sky-400">
                {{ formatPrice(order.total_price) }}
              </p>
            </div>
          </div>

          <!-- Divider -->
          <div class="h-px bg-white/10 mb-4"></div>

          <!-- Footer: Payment Method & Action Button -->
          <div class="flex items-center justify-between gap-4 pt-2" @click.stop>
            <div
              v-if="order.transaction?.payment_method"
              class="flex items-center gap-2"
            >
              <span class="text-xs text-slate-400">Metode Pembayaran:</span>
              <span class="text-xs font-semibold text-slate-200">
                {{ getPaymentMethodName(order.transaction.payment_method) }}
              </span>
            </div>

            <!-- Action Button -->
            <button
              v-if="getActionButton(order).text"
              @click="getActionButton(order).handler()"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2',
                getActionButton(order).color === 'sky'
                  ? 'bg-sky-500/90 text-white hover:bg-sky-500 ring-1 ring-sky-400/50'
                  : getActionButton(order).color === 'emerald'
                  ? 'bg-emerald-500/90 text-white hover:bg-emerald-500 ring-1 ring-emerald-400/50'
                  : 'bg-indigo-500/90 text-white hover:bg-indigo-500 ring-1 ring-indigo-400/50',
              ]"
            >
              {{ getActionButton(order).text }}
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div v-if="orders.length > 0" class="mt-8">
        <Pagination
          :maxPage="pagination.lastPage"
          :initialPage="currentPage"
          :perPage="perPage"
          @page-changed="goToPage"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Smooth transitions */
.group:hover {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}
</style>
