<template>
  <div class="timer-item">
    <div class="icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path
          d="M176 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l16 0 0 34.4C92.3 113.8 16 200 16 304c0 114.9 93.1 208 208 208s208-93.1 208-208c0-41.8-12.3-80.7-33.5-113.2l24.1-24.1c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L355.7 143c-28.1-23-62.2-38.8-99.7-44.6L256 64l16 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L224 0 176 0zm72 192l0 128c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-128c0-13.3 10.7-24 24-24s24 10.7 24 24z"
        />
      </svg>
    </div>
    <span class="message">{{ formattedTime }}</span>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const countdown = ref(30 * 60); // 30 minutes in seconds
const router = useRouter();

// Computed property to format time
const formattedTime = computed(() => {
  const minutes = Math.floor(countdown.value / 60);
  const seconds = countdown.value % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
});

let timerInterval;

const startTimer = () => {
  timerInterval = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value -= 1;
    } else {
      clearInterval(timerInterval);
      window.location.href = "/#/dashboard";
    }
  }, 1000);
};

onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  clearInterval(timerInterval);
});
</script>

<style scoped>
.timer-item {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  padding: var(--size-8);
  gap: var(--size-8);
  color: var(--black);
  background: #e0e0e0;
  border-radius: var(--border-md);
  font-weight: var(--semi-bold);
  white-space: nowrap;
  z-index: 1053;
  cursor: pointer;
}

.timer-item .icon {
  /* min-width: var(--size-32);
  max-width: var(--size-32);
  min-height: var(--size-32);
  max-height: var(--size-32);
  background: var(--sky-blue);
  border-radius: var(--border-circle); */
  display: flex;
  justify-content: center;
  align-items: center;
}

.timer-item .icon svg {
  min-width: var(--size-16);
  max-width: var(--size-16);
  min-height: var(--size-16);
  max-height: var(--size-16);
  fill: var(--black);
}

.timer-item .message {
  font-size: var(--text-sm);
  color: var(--black);
  font-weight: var(--semi-bold);
}

@media (max-width: 767px) {
  .timer-item {
    position: absolute;
    bottom: unset;
    right: unset;
    padding: 0;
    background: unset;
    top: 40px;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
