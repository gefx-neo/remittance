<template>
  <div class="tooltip" @mouseover="showTooltip" @mouseleave="hideTooltip">
    <slot></slot>
    <div :class="['item', { visible: isVisible }]">
      {{ text }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    default: "top",
  },
});

const isVisible = ref(false);

const showTooltip = () => {
  isVisible.value = true;
};

const hideTooltip = () => {
  isVisible.value = false;
};
</script>

<style scoped>
.tooltip {
  position: relative;
}

.tooltip .item {
  opacity: 0;
  visibility: hidden;
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--grey);
  color: var(--white);
  padding: var(--size-8);
  border-radius: var(--border-sm);
  white-space: nowrap;
  overflow: hidden;
  font-size: var(--text-sm);
  pointer-events: none;
  z-index: 10;
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
}

.tooltip .item.visible {
  opacity: 1;
  visibility: visible;
}
</style>
