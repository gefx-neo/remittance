<template>
  <button
    :class="['btn-api', props.class, { 'is-loading': store.isLoading }]"
    :disabled="store.isLoading || disabled"
    @click="handleClick"
  >
    <slot></slot>
    <div v-if="store.isLoading && showLoader" class="loader">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </button>
</template>

<script setup>
import { useStore } from "@/stores/useStore";

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  class: {
    type: String,
  },
  showLoader: {
    type: Boolean,
    default: true,
  },
});

const store = useStore();

const emit = defineEmits(["click"]);

const handleClick = (event) => {
  if (!store.isLoading && !props.disabled) {
    emit("click", event); // Only emit click if not loading and not disabled
  }
};
</script>

<style scoped>
.btn-api {
  position: relative;
}

.btn-api.is-loading {
  cursor: default;
}

.btn-api:disabled {
  background: var(--light-grey) !important;
  color: var(--grey) !important;
}

.loader {
  display: inline-block;
  position: absolute;
  right: var(--size-8);
  width: var(--size-24); /* Adjust size as needed */
  height: var(--size-24); /* Adjust size as needed */
}
.loader div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid var(--grey);
  border-radius: var(--border-circle);
  animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: var(--grey) transparent transparent transparent;
}
.loader div:nth-child(1) {
  animation-delay: -0.45s;
}
.loader div:nth-child(2) {
  animation-delay: -0.3s;
}
.loader div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
