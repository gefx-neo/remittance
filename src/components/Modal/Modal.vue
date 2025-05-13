<template>
  <!-- @click.self is for parent overlay, @click.stop is to prevent parent click affect child modal -->
  <div
    class="modal-overlay"
    :class="{ open: isModalOpen }"
    v-if="isModalOpen"
    @click="handleClose"
  >
    <div
      class="modal"
      :class="{ open: isModalOpen, success: success }"
      @click.stop
    >
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
        <div class="message">
          {{ footerMessage }}
        </div>
        <div v-if="showAction" class="action">
          <ButtonAPI
            type="button"
            class="btn-blue standard-button"
            @click="emitSubmit"
          >
            Confirm
          </ButtonAPI>
          <button
            type="button"
            @click="emitCancel"
            class="btn-back standard-button"
          >
            Cancel
          </button>
        </div>
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onUnmounted, watch } from "vue";
import { useStore, useAuthStore } from "@/stores/index";
import { ButtonAPI } from "@/components/Form";
import { useRouter } from "vue-router";

const props = defineProps({
  isModalOpen: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
  showAction: { type: Boolean, default: false },
  success: {
    type: Boolean,
    default: false,
  },
  footerMessage: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["close", "submit", "cancel"]);

const store = useStore();
const authStore = useAuthStore();
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
  if (props.success) {
    if (!authStore.username) {
      window.location.href = "/";
    } else {
      emit("close");
      store.closeModal();
    }
  } else {
    emit("close");
    store.closeModal();
  }
};

const emitCancel = () => emit("cancel");
const emitSubmit = () => emit("submit");

onUnmounted(() => {
  store.closeModal();
  document.body.style.overflow = "";
});

router.beforeEach((to, from, next) => {
  store.closeModal();
  document.body.style.overflow = "";
  next();
});

// Close dropdown after each route change
router.afterEach(() => {
  store.closeModal();
  document.body.style.overflow = "";
});
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
  width: 500px;
  max-width: 500px;
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
  min-height: 100px;
  max-height: 70vh;
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
    min-height: calc(100% - 32px);
    max-height: calc(100% - 32px);
  }

  .modal.success {
    min-height: unset;
  }

  .modal .body {
    max-height: unset;
  }

  .modal .header h2 {
    display: flex;
    align-items: center;
    font-size: var(--text-lg);
  }

  .modal .header .btn-round {
    display: none;
  }
}
</style>
