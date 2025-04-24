<template>
  <div class="accordion" :class="{ open: isOpen }">
    <div class="header" @click="toggle">
      <div class="title">{{ header }}</div>
      <font-awesome-icon :icon="['fa', 'chevron-down']" />
    </div>
    <div class="body">
      <div class="content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  header: {
    type: String,
    required: true,
  },
});

const isOpen = ref(true);
const toggle = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style scoped>
.accordion {
  border: 1px solid var(--light-grey);
  border-radius: var(--border-md);
  margin-bottom: var(--size-24);
}

.accordion .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--size-dropdown-item);
  cursor: pointer;
}

.accordion .header .title {
  font-weight: var(--semi-bold);
}

.accordion.open .header svg {
  transform: rotate(180deg);
}

.accordion .header svg {
  transition: transform 0.3s cubic-bezier(0, 0.94, 0.62, 1);
  color: var(--black);
}

.accordion.open .body {
  max-height: 500px;
  opacity: 1;
}

.accordion .body {
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.accordion.open .body {
  max-height: 500px;
  opacity: 1;
  border-top: 1px solid var(--light-grey);
}

.accordion .body .content {
  padding: var(--size-16);
}
</style>
