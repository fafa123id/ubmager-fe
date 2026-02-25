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

const { zMap, open, close: closeStack, bringToFront } = useModalStack();

const modalZ = computed(() => {
    return zMap[props.id] || 1000;
});

// Lock body scroll saat modal terbuka
watch(
    () => props.show,
    (visible) => {
        if (visible) {
            open(props.id);
            // Lock body scroll
            document.body.style.overflow = 'hidden';
        } else {
            closeStack(props.id);
            // Unlock body scroll
            document.body.style.overflow = '';
        }
    }
);

onMounted(() => {
    if (props.show) {
        open(props.id);
        document.body.style.overflow = 'hidden';
    }
    window.addEventListener("popstate", onBack);
    document.addEventListener("keydown", onEsc);
});

onUnmounted(() => {
    closeStack(props.id);
    document.body.style.overflow = '';
    document.removeEventListener("keydown", onEsc);
    window.removeEventListener("popstate", onBack);
});

const close = () => {
    if (props.closeable) {
        emit("close");
    }
};

const onEsc = (e) => {
    const currentMaxZ = Math.max(0, ...Object.values(zMap));
    if (e.key === "Escape" && props.show && modalZ.value === currentMaxZ) {
        close();
    }
};
const onBack = (e) => {
    const currentMaxZ = Math.max(0, ...Object.values(zMap));
    if (props.show && modalZ.value === currentMaxZ) {
        window.history.pushState(null, "", window.location.href);
        close();
    }
};

const backdropClick = () => {
    if (props.closeable) {
        close();
    }
};

const maxWidthClass = computed(() => {
    switch (props.maxWidth) {
        case 'sm': return 'sm:max-w-sm';
        case 'md': return 'sm:max-w-md';
        case 'lg': return 'sm:max-w-lg';
        case 'xl': return 'sm:max-w-xl';
        default: return 'sm:max-w-2xl';
    }
});

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
            <!-- FIXED MODAL CONTAINER - mengisi seluruh viewport, scroll dari mana saja -->
            <div
                v-if="props.show"
                class="fixed inset-0 overflow-y-auto"
                :style="{ zIndex: modalZ }"
                @mousedown="bringToFront(props.id)"
                @wheel.passive
            >
                <!-- Backdrop -->
                <div
                    class="fixed inset-0 bg-gray-800/60 backdrop-blur-sm transition-opacity pointer-events-none"
                />

                <!-- Modal centered container - flex untuk center, pointer-events-auto untuk backdrop click -->
                <div class="flex items-center justify-center min-h-screen p-4 sm:p-0 relative">
                    <!-- Backdrop click area -->
                    <div
                        class="absolute inset-0 pointer-events-auto"
                        @click="backdropClick"
                    />

                    <!-- Modal Content -->
                    <transition
                        enter-active-class="ease-out duration-200"
                        enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enter-to-class="opacity-100 translate-y-0 sm:scale-100"
                        leave-active-class="ease-in duration-150"
                        leave-from-class="opacity-100 translate-y-0 sm:scale-100"
                        leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div
                            v-if="props.show"
                            class="relative bg-slate-900/95 rounded-lg shadow-xl w-full pointer-events-auto"
                            :class="maxWidthClass"
                            :style="{ zIndex: modalZ + 1 }"
                            @mousedown.stop
                            @click.stop="handleModalContentClick"
                        >
                            <slot />
                        </div>
                    </transition>
                </div>
            </div>
        </transition>
    </Teleport>
</template>