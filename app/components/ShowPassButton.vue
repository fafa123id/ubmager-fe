<script setup>
const props = defineProps({
  showPass: {
    type: Boolean,
    required: true,
  },
  id : {
    type: String,
    default: null,
  },
});
const emit = defineEmits(["toggleShow"]);
const toggleShow = () => {
  emit("toggleShow");
};
</script>
<template>
  <button
    :id="id"
    type="button"
    @click="toggleShow"
    class="cursor-pointer absolute inset-y-0 right-0 grid w-10 place-items-center text-slate-300 hover:text-white"
    aria-label="Tampilkan/sem­bunyikan sandi"
  >
    <svg
      v-if="!showPass"
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        stroke-width="1.5"
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" />
    </svg>
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        stroke="currentColor"
        stroke-width="1.5"
        d="M3 3l18 18M10.6 10.6a3 3 0 104.2 4.2M6.1 6.1C3.8 7.7 2 12 2 12s3.5 7 10 7c2 0 3.7-.5 5.1-1.2M17.8 6.6C16.1 5.6 14.2 5 12 5"
      />
    </svg>
  </button>
</template>
