<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  productId: {
    type: Number,
    required: true,
  },
  productName: {
    type: String,
    default: "Produk",
  },
});

const emit = defineEmits(["close", "success"]);

const nuxtApp = useNuxtApp();
const { showSuccess, showError } = useSwal();

// Form state
const rating = ref(0);
const comment = ref("");
const imageFile = ref(null);
const imagePreview = ref(null);
const dragActive = ref(false);

// UI state
const isSubmitting = ref(false);
const errors = ref({});
const hoverRating = ref(0); // Track hover state

// Rating stars display
const ratingStars = computed(() => {
  const displayRating = hoverRating.value || rating.value; // Show hover preview or actual rating
  return Array.from({ length: 5 }, (_, i) => ({
    value: i + 1,
    filled: i < displayRating,
  }));
});

// Check if form is valid
const isValid = computed(() => {
  return rating.value >= 1 && rating.value <= 5;
});

// File handling - click input
const triggerFileInput = () => {
  document.getElementById("rating-image-input")?.click();
};

// File handling - select from input
const handleFileSelect = (event) => {
  const file = event.target.files?.[0];
  if (file) {
    processFile(file);
  }
};

// File handling - drag and drop
const handleDragEnter = (e) => {
  e.preventDefault();
  dragActive.value = true;
};

const handleDragLeave = () => {
  dragActive.value = false;
};

const handleDragOver = (e) => {
  e.preventDefault();
  dragActive.value = true;
};

const handleDrop = (e) => {
  e.preventDefault();
  dragActive.value = false;
  const file = e.dataTransfer.files?.[0];
  if (file) {
    processFile(file);
  }
};

// Process selected/dropped file
const processFile = (file) => {
  // Validate file type
  const validTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!validTypes.includes(file.type)) {
    errors.value.image = "Format gambar harus JPEG atau PNG";
    imageFile.value = null;
    imagePreview.value = null;
    return;
  }

  // Validate file size (max 2MB)
  const maxSize = 2 * 1024 * 1024; // 2MB
  if (file.size > maxSize) {
    errors.value.image = "Ukuran gambar maksimal 2MB";
    imageFile.value = null;
    imagePreview.value = null;
    return;
  }

  // Set file and preview
  imageFile.value = file;
  errors.value.image = null;

  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

// Remove image
const removeImage = () => {
  imageFile.value = null;
  imagePreview.value = null;
  errors.value.image = null;

  // Reset file input value agar bisa upload file yang sama lagi
  const fileInput = document.getElementById("rating-image-input");
  if (fileInput) {
    fileInput.value = "";
  }
};

// Submit form
const submitRating = async () => {
  // Clear errors
  errors.value = {};

  // Validate
  if (rating.value < 1 || rating.value > 5) {
    errors.value.rating = "Pilih rating antara 1-5 bintang";
    return;
  }

  if (comment.value.length > 255) {
    errors.value.comment = "Komentar maksimal 255 karakter";
    return;
  }

  try {
    isSubmitting.value = true;

    // Create FormData for multipart upload
    const formData = new FormData();
    formData.append("rating", rating.value);
    if (comment.value.trim()) {
      formData.append("comment", comment.value.trim());
    }
    if (imageFile.value) {
      formData.append("image", imageFile.value);
    }

    // Submit to API
    const response = await nuxtApp.$api.post(
      `/api/rating/${props.productId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Show success message
    await showSuccess("Rating Anda telah dikirim. Terima kasih!");

    // Reset form and close
    resetForm();
    emit("success", response.data);
    emit("close");
  } catch (err) {
    console.error("Error submitting rating:", err);

    // Handle validation errors from server
    if (err?.response?.data?.errors) {
      errors.value = err.response.data.errors;
    } else {
      const message =
        err?.response?.data?.message || "Gagal mengirim rating. Coba lagi.";
      await showError(message);
    }
  } finally {
    isSubmitting.value = false;
  }
};

// Reset form
const resetForm = () => {
  rating.value = 0;
  comment.value = "";
  imageFile.value = null;
  imagePreview.value = null;
  errors.value = {};
  hoverRating.value = 0;

  // Reset file input value
  const fileInput = document.getElementById("rating-image-input");
  if (fileInput) {
    fileInput.value = "";
  }
};

// Handle modal close
const handleClose = () => {
  resetForm();
  emit("close");
};

// Watch modal show/hide
watch(
  () => props.show,
  (newVal) => {
    if (!newVal) {
      resetForm();
    }
  }
);
</script>

<template>
  <MyModal
    id="user-rating-modal"
    :show="show"
    maxWidth="lg"
    @close="handleClose"
    :closeable="!isSubmitting"
  >
    <div
      class="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden"
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-white">Beri Rating</h2>
            <p class="text-sm text-blue-100 mt-1">{{ productName }}</p>
          </div>
          <button
            v-if="!isSubmitting"
            @click="handleClose"
            class="p-2 hover:bg-blue-700 rounded-lg transition-colors text-white"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">
        <!-- Rating Section -->
        <div class="space-y-3">
          <label class="block text-sm font-semibold text-slate-100">
            Rating Produk
            <span class="text-red-400">*</span>
          </label>
          <div class="flex items-center gap-3 p-4 bg-slate-700/30 rounded-xl">
            <div class="flex gap-2">
              <button
                v-for="star in ratingStars"
                :key="star.value"
                @click="rating = star.value"
                @mouseenter="hoverRating = star.value"
                @mouseleave="hoverRating = 0"
                :disabled="isSubmitting"
                class="w-8 h-8 transition-all duration-150 cursor-pointer hover:scale-110 flex items-center justify-center"
                :class="[isSubmitting && 'cursor-not-allowed hover:scale-100']"
              >
                <svg
                  class="w-full h-full transition-colors duration-150"
                  :class="[star.filled ? 'text-yellow-400' : 'text-slate-400']"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <p
            v-if="errors.rating"
            class="text-sm text-red-400 flex items-center gap-2"
          >
            <i class="fas fa-exclamation-circle"></i>
            {{ errors.rating }}
          </p>
        </div>

        <!-- Comment Section -->
        <div class="space-y-3">
          <label class="block text-sm font-semibold text-slate-100">
            Komentar (Opsional)
          </label>
          <div class="relative">
            <textarea
              v-model="comment"
              :disabled="isSubmitting"
              placeholder="Bagikan pengalaman Anda dengan produk ini..."
              class="w-full px-4 py-3 bg-slate-700/40 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
              rows="4"
            ></textarea>
            <div
              class="absolute bottom-3 right-3 text-xs text-slate-400"
              :class="{ 'text-red-400': comment.length > 255 }"
            >
              {{ comment.length }}/255
            </div>
          </div>
          <p
            v-if="errors.comment"
            class="text-sm text-red-400 flex items-center gap-2"
          >
            <i class="fas fa-exclamation-circle"></i>
            {{ errors.comment }}
          </p>
        </div>

        <!-- Image Upload Section -->
        <div class="space-y-3">
          <label class="block text-sm font-semibold text-slate-100">
            Tambah Foto (Opsional)
          </label>

          <!-- Upload Area -->
          <div
            @click="triggerFileInput"
            @dragenter="handleDragEnter"
            @dragleave="handleDragLeave"
            @dragover="handleDragOver"
            @drop="handleDrop"
            :class="[
              'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all',
              dragActive
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-slate-600 bg-slate-700/20 hover:border-slate-500',
              imagePreview && 'hidden',
            ]"
          >
            <input
              id="rating-image-input"
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              @change="handleFileSelect"
              class="hidden"
              :disabled="isSubmitting"
            />
            <div class="space-y-2">
              <i class="fas fa-cloud-arrow-up text-2xl text-blue-400"></i>
              <div>
                <p class="text-sm font-medium text-slate-200">
                  Drag gambar ke sini atau klik untuk memilih
                </p>
                <p class="text-xs text-slate-400 mt-1">JPEG, PNG, max 2MB</p>
              </div>
            </div>
          </div>

          <!-- Image Preview -->
          <div v-if="imagePreview" class="space-y-3">
            <div class="relative inline-block w-full">
              <img
                :src="imagePreview"
                alt="Preview"
                class="w-full h-40 object-cover rounded-lg border border-slate-600"
              />
              <button
                @click="removeImage"
                :disabled="isSubmitting"
                class="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>

          <!-- Error message -->
          <p
            v-if="errors.image"
            class="text-sm text-red-400 flex items-center gap-2"
          >
            <i class="fas fa-exclamation-circle"></i>
            {{ errors.image }}
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="bg-slate-700/20 px-6 py-4 border-t border-slate-700 flex items-center justify-end gap-3"
      >
        <button
          @click="handleClose"
          :disabled="isSubmitting"
          class="px-6 py-2 border border-slate-600 text-slate-200 rounded-lg hover:bg-slate-700/50 transition-all disabled:opacity-50 font-medium"
        >
          Batal
        </button>
        <button
          @click="submitRating"
          :disabled="!isValid || isSubmitting"
          class="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
        >
          <i v-if="!isSubmitting" class="fas fa-paper-plane"></i>
          <i v-else class="fas fa-spinner animate-spin"></i>
          {{ isSubmitting ? "Mengirim..." : "Kirim Rating" }}
        </button>
      </div>
    </div>
  </MyModal>
</template>

<style scoped>
/* Custom star animation */
@keyframes star-bounce {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

button:has(> i.fas-star):hover {
  animation: star-bounce 0.3s ease-in-out;
}
</style>
