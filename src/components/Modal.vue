<template>
  <!-- @click.self is for parent overlay, @click.stop is to prevent parent click affect child modal -->
  <div
    class="modal-overlay"
    :class="{ open: isModalOpen }"
    v-if="isModalOpen"
    @click="handleClose"
  >
    <div class="modal" :class="{ open: isModalOpen }" @click.stop>
      <div class="header">
        <slot name="header">
          <h2>{{ title }}</h2></slot
        >
        <button @click="handleClose" class="btn-round">
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
        <div v-if="success" class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path
              d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5 12.5 32.8 12.5 45.3 0z"
            />
          </svg>
        </div>
        <slot v-else name="body"></slot>
      </div>

      <div class="footer">
        <!-- <div class="message" v-if="redirectToLogin">
          Please check your e-mail for temporary password
        </div> -->
        <a href="/" v-if="redirectToLogin" class="message">
          Redirect to login page
        </a>
        <div v-if="showAction" class="action">
          <button
            type="button"
            @click="emitCancel"
            class="btn-back standard-button"
          >
            Cancel
          </button>
          <ButtonAPI
            :disabled="isLoading"
            type="button"
            class="btn-blue standard-button"
            @click="emitSubmit"
          >
            Confirm
          </ButtonAPI>
        </div>
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch } from "vue";
import { useStore } from "@/stores/useStore";
import { ButtonAPI } from "@/components/Form";

const props = defineProps({
  isModalOpen: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
  redirectToLogin: {
    // For Login, Register, Reset password
    type: Boolean,
    default: false,
  },
  showAction: { type: Boolean, default: false },

  success: {
    // For User success action
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "submit", "cancel"]);

const store = useStore();

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
    emit("close"); // This is only for modals declared in their local page like Change password(Success)
    store.closeModal(); // This is for default modals
  }
};

const emitCancel = () => emit("cancel");
const emitSubmit = () => emit("submit");
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
  background: var(--white);
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
  margin-bottom: var(--size-12);
}

.modal .header .btn-round {
  position: absolute;
  top: var(--size-16);
  right: var(--size-16);
}

.modal .body {
  min-height: var(--size-48);
  margin-bottom: var(--size-24);
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
  fill: var(--white);
}

.modal .footer {
  display: flex;
  justify-content: center;
  font-weight: var(--semi-bold);
}

.modal .footer .message {
  font-weight: var(--semi-bold);
}

.modal .action {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.modal .action button {
  min-width: 48.5%;
  max-width: 48.5%;
}

@media (max-width: 767px) {
  .modal {
    width: calc(100% - 32px);
    min-width: unset;
  }
}
</style>
