<template>
  <button
    :class="['btn-api', props.class, { 'is-loading': store.isLoading }]"
    :disabled="store.isLoading || disabled"
    @click="handleClick"
  >
    <slot></slot>
    <span v-if="store.isLoading" class="loader"></span>
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
  position: absolute;
  right: var(--size-8);
  min-width: var(--size-16);
  max-width: var(--size-16);
  min-height: var(--size-16);
  max-height: var(--size-16);
  border: 2px solid var(--grey);
  border-radius: var(--border-circle);
  border-top-color: transparent;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>
