<template>
  <div
    class="modal-overlay"
    :class="{ open: store.isModalOpen }"
    v-if="store.isModalOpen"
    @click.self="handleClose"
  >
    <div class="modal" :class="{ open: store.isModalOpen }" @click.stop>
      <div class="header">
        <slot name="header">
          <h2>{{ title }}</h2></slot
        >
        <button @click="handleClose" class="btn-back-round">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
            <path
              d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8-9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"
            />
          </svg>
        </button>
      </div>

      <div class="body">
        <div v-if="redirectToLogin" class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path
              d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5 12.5 32.8 12.5 45.3 0z"
            />
          </svg>
        </div>
        <slot v-else name="body"></slot>
      </div>

      <div class="footer">
        <!-- <router-link to="/">Redirect to login page</router-link> -->

        <a href="/" v-if="redirectToLogin" class="message">
          Redirect to login page
        </a>

        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch } from "vue";
import { useRouter } from "vue-router"; // Import the router
import { useStore } from "@/stores/useStore";

const props = defineProps({
  isModalOpen: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
  },
  redirectToLogin: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const store = useStore();
const router = useRouter();

// Watch for isModalOpen changes and disable body scrolling when open
watch(
  () => props.isModalOpen,
  (newValue) => {
    if (newValue) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }
);

// Handle click outside the modal
const handleClose = () => {
  if (props.redirectToLogin) {
    // router.push("/");
    window.location.href = "/"; // This will refresh the page and reset the state
  } else {
    store.closeModal();
  }
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
  padding: 8px;
  width: 400px;
  max-width: 400px;
  max-height: 250px;
  background: var(--bg-screen);
  border-radius: var(--border-lg);
  padding: var(--size-16);
  transition: opacity 0.3s ease-in-out;
}

.modal.open {
  opacity: 1;
}

.modal .header {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--size-32);
  max-height: var(--size-32);
}

.modal .header .btn-back-round {
  position: absolute;
  top: var(--size-16);
  right: var(--size-16);
}

.modal .body .icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: var(--size-24) auto;
  min-width: 100px;
  max-width: 100px;
  min-height: 100px;
  max-height: 100px;
  background: var(--pastel-green);
  border-radius: var(--border-circle);
}

.modal .body .icon svg {
  min-width: 50px;
  max-width: 50px;
  min-height: 50px;
  max-height: 50px;
  fill: var(--bg-screen);
}

.modal .footer a {
  display: flex;
  justify-content: center;
  font-weight: var(--semi-bold);
  text-decoration: underline;
  color: var(--grey);
}

@media (max-width: 767px) {
  .modal {
    width: calc(100% - 32px);
    min-width: unset;
  }
}
</style>
