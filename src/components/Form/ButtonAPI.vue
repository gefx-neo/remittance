<template>
  <button
    :class="[
      'btn-api',
      props.class,
      { 'is-loading': store.isLoading || store.isMoneyLoading },
    ]"
    :disabled="store.isLoading || disabled"
    @click="handleClick"
  >
    <slot></slot>

    <div
      class="loader"
      :class="{ 'custom-loader': customLoader }"
      v-if="(store.isLoading && showLoader) || store.isMoneyLoading"
    >
      <svg viewBox="25 25 50 50" v-if="customLoader">
        <circle r="20" cy="50" cx="50"></circle>
      </svg>
      <svg viewBox="25 25 50 50" v-else>
        <circle r="20" cy="50" cx="50"></circle>
      </svg>
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
  customLoader: {
    type: Boolean,
    default: false,
  },
});

const store = useStore();

const emit = defineEmits(["click"]);

const handleClick = (event) => {
  if (!store.isLoading && !props.disabled && !store.isMoneyLoading) {
    emit("click", event); // Only emit click if not loading and not disabled
  }
};
</script>

<style scoped>
.btn-api {
  position: relative;
  display: flex;
  align-items: center;
  padding: var(--size-dropdown-item);
}

.btn-api.is-loading {
  cursor: default;
}

.btn-api:disabled {
  background: var(--lighter-grey) !important;
  color: var(--grey) !important;
}

.loader {
  position: absolute;
  right: var(--size-16);
  width: var(--size-24);
  height: var(--size-24);
}

.custom-loader {
  position: relative;
  width: var(--size-16);
  height: var(--size-16);
  margin-left: 12px;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-loader svg {
  position: absolute;
  right: 0;
  width: var(--size-20);
  height: var(--size-20);
}

svg {
  width: var(--size-24);
  height: var(--size-24);
  transform-origin: center;
  animation: rotate4 2s linear infinite;
}

circle {
  fill: none;
  stroke: var(--grey);
  stroke-width: 4;
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  animation: dash4 1.5s ease-in-out infinite;
}

@keyframes rotate4 {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash4 {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 90, 200;
    stroke-dashoffset: -35px;
  }

  100% {
    stroke-dashoffset: -125px;
  }
}
</style>
