<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from "vue";
import { useModalStack } from "@/composables/useModalStack";

const props = defineProps({
    id: { type: String, required: true },
    show: Boolean,
    maxWidth: { type: String, default: "2xl" },
    closeable: { type: Boolean, default: true }
});

const emit = defineEmits(["close"]);

// Ambil fungsi & state dari composable
const { zMap, open, close: closeStack, bringToFront } = useModalStack();

// 1. COMPUTED PROPERTY UNTUK Z-INDEX (INI KUNCINYA)
//    Secara reaktif mengambil nilai z-index dari zMap global
const modalZ = computed(() => {
    return zMap[props.id] || baseZ; // Ambil dari map, atau fallback ke baseZ
});

// Awasi perubahan prop 'show'
watch(
    () => props.show,
    (visible) => {
        if (visible) {
            open(props.id); // Panggil 'open' dari composable
        } else {
            closeStack(props.id); // Panggil 'close' dari composable
        }
    },
    // { immediate: true } // immediate: true kadang bikin masalah kalau ID belum siap,
    // Lebih aman panggil 'open' saat mounted jika show=true
);

// Panggil 'open' saat mounted jika prop 'show' awalnya true
onMounted(() => {
    if (props.show) {
        open(props.id);
    }
    document.addEventListener("keydown", onEsc);
});

onUnmounted(() => {
    // Pastikan modal ditutup dari stack saat komponen hilang
    closeStack(props.id);
    document.removeEventListener("keydown", onEsc);
});

// Fungsi close lokal
const close = () => {
    if (props.closeable) {
        emit("close"); // Kirim event ke parent
    }
};

// Handle Escape key
const onEsc = (e) => {
    // Hanya tutup modal PALING ATAS saat ESC ditekan
    // Kita cek apakah z-index modal ini paling tinggi
    const currentMaxZ = Math.max(0, ...Object.values(zMap));
    if (e.key === "Escape" && props.show && modalZ.value === currentMaxZ) {
        close();
    }
};

// Handle klik backdrop
const backdropClick = () => {
    if (props.closeable) {
        close();
    }
};

// 2. PERBAIKAN maxWidthClass (SESUAI DOKUMENTASI TAILWIND)
//    Kita definisikan SEMUA kemungkinan class secara eksplisit
const maxWidthClass = computed(() => {
    switch (props.maxWidth) {
        case 'sm': return 'sm:max-w-sm';
        case 'md': return 'sm:max-w-md';
        case 'lg': return 'sm:max-w-lg';
        case 'xl': return 'sm:max-w-xl';
        default: return 'sm:max-w-2xl'; // default ke '2xl'
    }
});

// Fungsi untuk memanggil bringToFront saat modal diklik
const handleModalContentClick = () => {
    bringToFront(props.id);
};
</script>

<template>
    <Teleport to="body">
        <transition
            enter-active-class="ease-out duration-200"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="ease-in duration-150"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="props.show"
                class="fixed inset-0 flex items-center justify-center p-4 sm:p-0"
                :style="{ zIndex: modalZ }" @mousedown="bringToFront(props.id)" >
                <div
                    class="fixed inset-0 bg-gray-800/60 backdrop-blur-sm transition-opacity"
                    @click="backdropClick"
                />

                <transition
                    enter-active-class="ease-out duration-200"
                    enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enter-to-class="opacity-100 translate-y-0 sm:scale-100"
                    leave-active-class="ease-in duration-150"
                    leave-from-class="opacity-100 translate-y-0 sm:scale-100"
                    leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <div
                        class="relative bg-slate-900/95 rounded-lg shadow-xl overflow-y-auto w-full my-6"
                        :class="maxWidthClass" :style="{ zIndex: modalZ + 1 }" @mousedown.stop >
                        <slot />
                    </div>
                </transition>
            </div>
        </transition>
    </Teleport>
</template>