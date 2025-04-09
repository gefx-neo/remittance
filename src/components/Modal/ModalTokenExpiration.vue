<template>
  <!-- Modal overlay -->
  <div
    class="modal-overlay"
    :class="{ open: isOpen }"
    v-if="authStore.username"
  >
    <div class="modal" :class="{ open: isOpen }" @click.stop>
      <div class="header">
        <slot name="header">
          <h2>Session Timeout</h2>
        </slot>
        <button @click="handleConfirm" class="btn-round">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
            <path
              d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8-9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"
            />
          </svg>
        </button>
      </div>
      <div class="body">
        <div>
          Your session is about to expire due to inactivity. To stay logged in,
          please confirm that you would like to continue.
        </div>
        <div class="timer">
          <div>{{ tokenTimeRemaining }}</div>
        </div>
      </div>
      <div class="footer">
        <div class="action">
          <ButtonAPI
            type="button"
            class="btn-blue standard-button"
            @click="handleConfirm"
          >
            Stay logged in
          </ButtonAPI>
          <button
            type="button"
            @click="handleLogout"
            class="btn-back standard-button"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, watchEffect, onMounted, onUnmounted } from "vue";
import { getLocalStorageWithExpiry } from "@/services/localStorageService.js";
import { ButtonAPI } from "@/components/Form";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/index";

const router = useRouter();
const authStore = useAuthStore();

// States
const tokenExpiryTime = ref(0);
const remainingTime = ref(0);
const isOpen = ref(false);
const countdownInterval = ref(null);

// Set expiry time 4 hours from now
const setExpiryToFiveMinutes = () => {
  const now = new Date().getTime();
  tokenExpiryTime.value = now + 4 * 60 * 60 * 1000;
};

// Countdown function
const startCountdown = () => {
  if (countdownInterval.value) clearInterval(countdownInterval.value);

  countdownInterval.value = setInterval(() => {
    const now = new Date().getTime();
    remainingTime.value = tokenExpiryTime.value - now;

    if (remainingTime.value <= 0) {
      clearInterval(countdownInterval.value);
      remainingTime.value = 0;
      isOpen.value = false;
    }
    // 3 * 60 * 60 * 1000 + 59 * 60 * 1000 + 50 * 1000
    // 5 * 60 * 1000
    // Open modal when timer reaches 5m
    if (remainingTime.value <= 5 * 60 * 1000) {
      isOpen.value = true;
    }
  }, 1000);
};

// Computed property for formatted time
const tokenTimeRemaining = computed(() => {
  if (remainingTime.value <= 0) return "Token expired";

  const hours = String(
    Math.floor(remainingTime.value / (1000 * 60 * 60))
  ).padStart(2, "0");
  const minutes = String(
    Math.floor((remainingTime.value % (1000 * 60 * 60)) / (1000 * 60))
  ).padStart(2, "0");
  const seconds = String(
    Math.floor((remainingTime.value % (1000 * 60)) / 1000)
  ).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
});

// Watch for token changes
watchEffect(() => {
  if (getLocalStorageWithExpiry("token")) {
    setExpiryToFiveMinutes();
    startCountdown();
  }
});

watch(
  () => isOpen.value,
  (newValue) => {
    if (newValue) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }
);

// Initialize on mount
onMounted(() => {
  setExpiryToFiveMinutes();
  startCountdown();
});

// Cleanup interval
onUnmounted(() => {
  if (countdownInterval.value) clearInterval(countdownInterval.value);
  isOpen.value = false;
  document.body.style.overflow = "";
});

router.beforeEach((to, from, next) => {
  isOpen.value = false;
  document.body.style.overflow = "";
  next();
});

// Close dropdown after each route change
router.afterEach(() => {
  isOpen.value = false;
  document.body.style.overflow = "";
});

const handleConfirm = () => {
  window.location.reload();
};

const handleLogout = () => {
  authStore.logout();
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  opacity: 0;
  visibility: hidden;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1055;
  transition: opacity 0.3s ease-in-out, visibility 0.3s;
}

.modal-overlay.open {
  opacity: 1;
  visibility: visible;
  transition: opacity 0.3s ease-in-out, visibility 0s;
}

.modal {
  opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  width: 400px;
  max-width: 400px;
  background: var(--white);
  border-radius: var(--border-lg);
  transition: opacity 0.3s ease-in-out;
}

.modal.open {
  opacity: 1;
}

.modal .header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--size-16);
}

.modal .header h2 {
  min-height: var(--size-32);
  max-height: var(--size-32);
}

.modal .header .btn-round {
  position: absolute;
  top: var(--size-16);
  right: var(--size-16);
}

.modal .body {
  padding: 0 var(--size-16);
  margin: 0 var(--size-8);
  flex-grow: 1;
  overflow-y: auto;
  max-height: 70vh;
}

.modal .body .timer {
  height: 100px;
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal .body .timer div {
  font-weight: var(--semi-bold);
  font-size: var(--text-xl);
}

.modal .body::-webkit-scrollbar {
  width: var(--size-8);
  cursor: pointer;
}

.modal .body::-webkit-scrollbar-thumb {
  background-color: var(--cool-blue);
  border-radius: var(--border-lg);
  cursor: pointer;
}

.modal .body::-webkit-scrollbar-thumb:hover {
  background-color: var(--slate-blue);
}

.modal .body::-webkit-scrollbar-track {
  background-color: var(--white);
}

.modal .footer {
  display: flex;
  justify-content: center;
  font-weight: var(--semi-bold);
  padding: var(--size-16);
}

.modal .footer .message {
  font-weight: var(--semi-bold);
}

.modal .action {
  display: flex;
  flex-direction: column;
  gap: var(--size-12);
  width: 100%;
}

@media (max-width: 767px) {
  .modal {
    width: calc(100% - 32px);
    min-width: unset;
    min-height: unset;
    max-height: calc(100% - 32px);
  }

  .modal .body {
    max-height: unset;
  }
}
</style>
