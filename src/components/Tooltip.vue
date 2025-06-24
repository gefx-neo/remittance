<template>
  <div class="tooltip" @mouseover="showTooltip" @mouseleave="hideTooltip">
    <slot></slot>
    <div
      :class="[
        'item',
        customClass,
        { visible: isVisible, right: position === 'right' },
      ]"
      v-html="text"
    ></div>
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
  customClass: {
    type: String,
    default: "",
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
  display: flex;
  align-items: center;
  cursor: pointer;
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
  word-wrap: break-word;
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

.tooltip .item.right {
  right: 0;
  left: unset;
  transform: unset;
}

.tooltip .item.sm-tooltip {
  white-space: normal;
  left: 0%;
  width: 150px;
  max-width: 150px;
}

@media (max-width: 1023px) {
  .tooltip .item.long-tooltip {
    white-space: normal;
    left: 290%;
    width: 300px;
    max-width: 300px;
  }

  .tooltip .item.sm-tooltip {
    white-space: normal;
    left: 0%;
    width: 100px;
    max-width: 100px;
  }
}
</style>
