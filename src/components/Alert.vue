<template>
  <transition name="fade">
    <div
      v-if="isVisible"
      :class="['alert-item', `${alertType}`]"
      @click="clearAlert"
    >
      <button class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
          <path
            d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8-9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"
          />
        </svg>
      </button>
      {{ alertMessage }}
    </div>
  </transition>
</template>

<script setup>
import { computed, watch } from "vue";
import { useAlertStore } from "@/stores/alertStore";
import { useRoute } from "vue-router";

const alertStore = useAlertStore();
const route = useRoute();

// Watch for route changes and clear the alert on route change
watch(route, () => {
  if (alertStore.isVisible) {
    alertStore.clearAlert();
  }
});

// Computed properties for the alert store data
const alertMessage = computed(() => alertStore.message);
const alertType = computed(() => alertStore.type);
const isVisible = computed(() => alertStore.isVisible);
const clearAlert = alertStore.clearAlert;
</script>

<style scoped>
.alert-item {
  position: fixed;
  top: 50px;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  gap: var(--size-12);
  padding: var(--size-12) var(--size-16);
  background: var(--black);
  color: var(--white);
  border-radius: var(--border-md);
  font-weight: var(--semi-bold);
  white-space: nowrap;
  line-height: 1.2;
  z-index: 9999;
  cursor: pointer;
}

.alert-item .icon {
  min-width: var(--size-32);
  max-width: var(--size-32);
  min-height: var(--size-32);
  max-height: var(--size-32);
  background: var(--sky-blue);
  border-radius: var(--border-circle);
  display: flex;
  justify-content: center;
  align-items: center;
}

.alert-item .icon svg {
  min-width: var(--size-16);
  max-width: var(--size-16);
  min-height: var(--size-16);
  max-height: var(--size-16);
}

.alert-item.error .icon {
  background: var(--crimson-red);
}

.alert-item.error .icon svg {
  fill: var(--white);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
