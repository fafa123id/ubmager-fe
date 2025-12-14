<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "checkout-success"]);

// State
const amount = ref(1);
const selectedPayMethod = ref(null);
const isLoading = ref(false);
const errorMessage = ref(null);

// Constants
const APP_FEE = 2000;
const OTHER_FEE = 1000;

// Payment methods with logos
const paymentMethods = [
  {
    id: "credit_card",
    label: "Kartu Kredit",
    value: "credit_card",
    icon: "💳",
    description: "Visa, Mastercard, American Express",
  },
  {
    id: "bank_transfer",
    label: "Transfer Bank",
    value: "bank_transfer",
    icon: "🏦",
    description: "BCA, Mandiri, BNI, BRI",
  },
  {
    id: "gopay",
    label: "GoPay",
    value: "gopay",
    icon: "🟢",
    description: "Pembayaran via GoPay",
  },
  {
    id: "shopeepay",
    label: "ShopeePay",
    value: "shopeepay",
    icon: "🔴",
    description: "Pembayaran via ShopeePay",
  },
  {
    id: "qris",
    label: "QRIS",
    value: "qris",
    icon: "📱",
    description: "Scan QRIS dengan ponsel Anda",
  },
  {
    id: "alfamart",
    label: "Alfamart",
    value: "alfamart",
    icon: "🛒",
    description: "Bayar di toko Alfamart",
  },
  {
    id: "indomaret",
    label: "Indomaret",
    value: "indomaret",
    icon: "🏪",
    description: "Bayar di toko Indomaret",
  },
];

// Computed
const subtotal = computed(() => {
  return (props.product?.price || 0) * amount.value;
});

const totalPrice = computed(() => {
  return subtotal.value + APP_FEE + OTHER_FEE;
});

const formattedPrice = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

// Methods
const handleAmountChange = (value) => {
  const newAmount = parseInt(value);
  if (newAmount > 0 && newAmount <= 999) {
    amount.value = newAmount;
    errorMessage.value = null;
  }
};
const { checkoutProduct } = useProduct();

const handleCheckout = async () => {
  // Validation
  if (!selectedPayMethod.value) {
    errorMessage.value = "Pilih metode pembayaran terlebih dahulu";
    return;
  }

  if (amount.value < 1) {
    errorMessage.value = "Jumlah produk minimal 1";
    return;
  }
  const confirmed = await useSwal().confirmAction(
    "Konfirmasi Checkout",
    `Anda akan membeli ${amount.value} x ${
      props.product.name
    } dengan total pembayaran ${formattedPrice(totalPrice.value)}. Lanjutkan?`
  );
  if (!confirmed.isConfirmed) {
    return;
  }
  isLoading.value = true;
  errorMessage.value = null;

  try {
    const res = await checkoutProduct(
      props.product.id,
      amount.value,
      selectedPayMethod.value
    );
    emit("checkout-success", res);
    close();
  } catch (error) {
    console.error("Checkout error:", error);
    errorMessage.value =
      error.data?.message || "Gagal memproses checkout. Coba lagi.";
  } finally {
    isLoading.value = false;
  }
};

const close = () => {
  amount.value = 1;
  selectedPayMethod.value = null;
  errorMessage.value = null;
  emit("close");
};

// Increment/Decrement
const increment = () => {
  if (amount.value < 999) {
    amount.value++;
  }
};

const decrement = () => {
  if (amount.value > 1) {
    amount.value--;
  }
};
</script>

<template>
  <Teleport to="body" v-if="isOpen">
    <div
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        @click="close"
      ></div>

      <!-- Modal -->
      <div
        class="relative w-full sm:w-full max-w-lg mx-4 rounded-t-2xl sm:rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto sm:overflow-auto"
      >
        <!-- Header -->
        <div
          class="sticky top-0 z-10 border-b border-white/10 bg-slate-800/80 backdrop-blur px-6 py-4 flex items-center justify-between"
        >
          <h2 class="text-xl font-bold text-slate-100">Checkout</h2>
          <button
            @click="close"
            class="p-1 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
              />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-6">
          <!-- Product Info -->
          <div class="bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 class="text-sm font-semibold text-slate-400 mb-2">Produk</h3>
            <p class="text-lg font-semibold text-slate-100">
              {{ product?.name || "Product" }}
            </p>
            <p class="text-sm text-slate-400 mt-1">
              Harga: {{ formattedPrice(product?.price || 0) }}
            </p>
          </div>

          <!-- Amount Input -->
          <div class="bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 class="text-sm font-semibold text-slate-400 mb-3">Jumlah</h3>
            <div class="flex items-center gap-3">
              <button
                @click="decrement"
                :disabled="amount <= 1"
                class="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-slate-200 transition-colors font-semibold"
              >
                −
              </button>

              <input
                :value="amount"
                @input="handleAmountChange($event.target.value)"
                type="number"
                min="1"
                max="999"
                class="flex-1 rounded-lg border border-white/10 bg-slate-700/50 px-3 py-2 text-center text-slate-100 focus:border-sky-400/50 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
              />

              <button
                @click="increment"
                :disabled="amount >= 999"
                class="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-slate-200 transition-colors font-semibold"
              >
                +
              </button>
            </div>
          </div>

          <!-- Price Breakdown -->
          <div
            class="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3"
          >
            <h3 class="text-sm font-semibold text-slate-400 mb-3">
              Rincian Harga
            </h3>

            <!-- Subtotal -->
            <div class="flex items-center justify-between text-slate-300">
              <span class="text-sm">
                Subtotal ({{ amount }} x
                {{ formattedPrice(product?.price || 0) }})
              </span>
              <span class="font-semibold">{{ formattedPrice(subtotal) }}</span>
            </div>

            <!-- App Fee -->
            <div class="flex items-center justify-between text-slate-300">
              <span class="text-sm">Biaya Aplikasi</span>
              <span class="font-semibold">{{ formattedPrice(APP_FEE) }}</span>
            </div>

            <!-- Other Fee -->
            <div class="flex items-center justify-between text-slate-300">
              <span class="text-sm">Biaya Lainnya</span>
              <span class="font-semibold">{{ formattedPrice(OTHER_FEE) }}</span>
            </div>

            <!-- Divider -->
            <div class="border-t border-white/10 pt-3"></div>

            <!-- Total -->
            <div class="flex items-center justify-between">
              <span class="font-semibold text-slate-200">Total Pembayaran</span>
              <span
                class="text-lg font-bold bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent"
              >
                {{ formattedPrice(totalPrice) }}
              </span>
            </div>
          </div>

          <!-- Payment Methods -->
          <div class="space-y-3">
            <h3 class="text-sm font-semibold text-slate-400">
              Pilih Metode Pembayaran
            </h3>

            <div class="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
              <button
                v-for="method in paymentMethods"
                :key="method.id"
                @click="selectedPayMethod = method.value"
                :class="[
                  'relative flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200',
                  selectedPayMethod === method.value
                    ? 'border-sky-400 bg-sky-400/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10',
                ]"
              >
                <!-- Checkmark -->
                <div
                  :class="[
                    'flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                    selectedPayMethod === method.value
                      ? 'border-sky-400 bg-sky-400'
                      : 'border-white/30',
                  ]"
                >
                  <svg
                    v-if="selectedPayMethod === method.value"
                    class="w-3 h-3 text-slate-900 font-bold"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                    />
                  </svg>
                </div>

                <!-- Icon and Label -->
                <div class="flex-1 text-left">
                  <div class="flex items-center gap-2">
                    <span class="text-xl">{{ method.icon }}</span>
                    <div>
                      <p class="font-semibold text-slate-200">
                        {{ method.label }}
                      </p>
                      <p class="text-xs text-slate-400">
                        {{ method.description }}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <div
            v-if="errorMessage"
            class="rounded-lg border border-red-500/30 bg-red-500/10 p-3"
          >
            <p class="text-sm text-red-300">{{ errorMessage }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4">
            <button
              @click="close"
              class="flex-1 rounded-lg border border-white/10 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-3 transition-colors"
            >
              Batal
            </button>

            <button
              @click="handleCheckout"
              :disabled="isLoading || !selectedPayMethod"
              class="flex-1 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 text-white font-semibold py-3 transition-all duration-200"
            >
              <span v-if="!isLoading">Checkout</span>
              <span v-else class="inline-flex items-center gap-2">
                <svg
                  class="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* Smooth scrolling */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.5);
}
</style>
