<template>
  <transition-group name="fade" tag="div">
    <div
      v-for="alert in alerts"
      :key="alert.id"
      :class="['alert-item', `${alert.type}`]"
      @click="clearAlert(alert.id)"
    >
      <button class="icon" v-if="alert.type === 'success'">
        <font-awesome-icon :icon="['fas', 'check']" />
      </button>
      <button class="icon" v-if="alert.type === 'error'">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
          <path
            d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8-9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"
          />
        </svg>
      </button>
      <button class="icon" v-if="alert.type === 'pending'">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512">
          <path
            d="M96 64c0-17.7-14.3-32-32-32S32 46.3 32 64l0 256c0 17.7 14.3 32 32 32s32-14.3 32-32L96 64zM64 480a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"
          />
        </svg>
      </button>
      <div v-if="alert.type === 'loading'" class="loader">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <span v-else class="message">{{ alert.message }}</span>
    </div>
  </transition-group>
</template>

<script setup>
import { computed } from "vue";
import { useAlertStore } from "@/stores/index.js";

const alertStore = useAlertStore();

// Computed property for accessing the alerts array
const alerts = computed(() => alertStore.alerts);

// Method for clearing individual alerts by id
const clearAlert = (id) => alertStore.clearAlert(id);
</script>

<style scoped>
.alert-item {
  position: fixed;
  top: 50px;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: start;
  align-items: center;
  text-align: center;
  gap: var(--size-12);
  padding: var(--size-12) var(--size-16);
  background: var(--black);
  color: var(--white);
  border-radius: var(--border-md);
  font-weight: var(--semi-bold);
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

.alert-item.success .icon {
  background: var(--pastel-green);
}

.alert-item.success .icon svg {
  color: var(--white);
}

.alert-item.error .icon {
  background: var(--crimson-red);
}

.alert-item.error .icon svg {
  fill: var(--white);
}

.alert-item.pending .icon {
  background: var(--dark-yellow);
}

.alert-item.pending .icon svg {
  fill: var(--black);
}

.alert-item.loading {
  background: var(--lighter-grey);
  border-radius: var(--border-circle);
  padding: var(--size-12);
}

.alert-item .message {
  display: flex;
  align-items: center;
  min-height: var(--size-32);
  text-align: start;
}

.loader {
  display: inline-block;
  position: relative;
  width: var(--size-24);
  height: var(--size-24);
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 767px) {
  .alert-item {
    min-width: fit-content;
    max-width: calc(100% - var(--size-32));
    width: max-content;
  }
}
</style>
