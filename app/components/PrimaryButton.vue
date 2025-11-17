<script setup>
import { computed } from 'vue';
import { twMerge } from 'tailwind-merge'; // <-- 1. Impor twMerge

const props = defineProps({
    href: {
        type: String,
        default: null,
    },
    type: {
        type: String,
        default: 'submit',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

const computedClasses = computed(() => {
    const baseClasses = 'inline-flex items-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-900';
    return twMerge(baseClasses, attrs.class);
});

import { useAttrs } from 'vue';
const attrs = useAttrs();

</script>

<template>
    <NuxtLink
        v-if="href"
        :to="href"
        :class="computedClasses" >
        <slot />
    </NuxtLink>

    <button
        v-else
        :type="type"
        :class="computedClasses"
        :disabled="disabled" >
        <slot />
    </button>
</template>