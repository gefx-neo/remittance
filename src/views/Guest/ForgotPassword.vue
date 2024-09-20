<template>
  <div class="content-area">
    <div class="heading">
      <h1 v-if="step === 1">Reset password</h1>
      <h1 v-if="step === 2">Set new password</h1>
      <div v-if="step === 2 && username">{{ username }}</div>
    </div>

    <form v-if="step === 1" @submit.prevent="handleStep1">
      <div class="form-group">
        <label for="login">E-mail address</label>
        <input id="username" v-model="username" type="email" required />
      </div>
      <ButtonAPI :disabled="store.isLoading" class="btn-red standard-button">
        Next
      </ButtonAPI>
    </form>

    <form v-if="step === 2" @submit.prevent="handleStep2">
      <div class="form-group">
        <label for="login">Temporary password</label>
        <input id="code" v-model="code" type="text" required />
      </div>
      <div class="form-group">
        <label for="password">New password</label>
        <input
          id="password"
          :type="showPassword ? 'text' : 'password'"
          v-model="newPassword"
          required
        />
      </div>
      <div class="form-group">
        <label for="confirmNewPassword">Confirm new password</label>
        <input
          id="confirmNewPassword"
          :type="showPassword ? 'text' : 'password'"
          v-model="confirmNewPassword"
          required
        />
        <div class="checkbox-group">
          <div class="item" @click="togglePassword">
            <input type="checkbox" id="showPassword" v-model="showPassword" />
            <svg
              v-if="showPassword"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path
                d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
              />
            </svg>
          </div>
          <label for="showPassword">Show password</label>
        </div>
        <div v-if="passwordMismatch" class="error">Passwords do not match.</div>
      </div>
      <div class="button-group">
        <ButtonAPI
          :disabled="store.isLoading || passwordMismatch"
          class="btn-red standard-button"
        >
          Submit
        </ButtonAPI>
        <button type="button" class="btn-back standard-button" @click="goBack">
          Back
        </button>
      </div>
    </form>

    <div v-show="forgotPasswordStore.error" class="error">
      {{ forgotPasswordStore.error }}
    </div>

    <footer>
      <router-link to="/forgotpassword">Forgot password?</router-link>
    </footer>
    <Modal
      :isModalOpen="store.isModalOpen"
      title="Reset successfully"
      :redirectToLogin="true"
    >
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useForgotPasswordStore } from "@/stores/forgotPasswordStore";
import { useAuthStore } from "@/stores/authStore";
import { useStore } from "@/stores/useStore";
import Modal from "@/components/Modal.vue";
import ButtonAPI from "@/components/ButtonAPI.vue";

const forgotPasswordStore = useForgotPasswordStore();
const authStore = useAuthStore();
const store = useStore();

const step = ref(1);
const code = ref("");
const username = ref("");
const newPassword = ref("");
const confirmNewPassword = ref("");
const showPassword = ref(false);

const passwordMismatch = computed(() => {
  return (
    newPassword.value !== confirmNewPassword.value &&
    confirmNewPassword.value !== ""
  );
});

const handleStep1 = async () => {
  try {
    await forgotPasswordStore.changePassword(username.value);
    step.value = 2;
    console.log("step 2");
  } catch (error) {
    console.error("Change password failed:", error);
  }
};

const handleStep2 = async () => {
  if (passwordMismatch.value) return;

  try {
    await forgotPasswordStore.setNewPassword(
      code.value,
      username.value,
      newPassword.value
    );
    store.openModal();
  } catch (error) {
    console.error("Set new password failed:", error);
  }
};

const goBack = () => {
  step.value = 1;
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// Watcher to call getReqKey when transitioning to step 2
watch(step, async (newStep) => {
  if (newStep === 2) {
    try {
      console.log("run get reqkey");
      await authStore.getReqKey(username.value);
    } catch (error) {
      console.error("Fetching request key failed:", error);
    }
  }
});
</script>

<style scoped>
.content-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--size-24);
}

.heading {
  text-align: center;
}

.heading h1 {
  margin-bottom: var(--size-8);
}

.heading a {
  color: var(--grey);
  font-weight: var(--semi-bold);
  text-decoration: underline;
  cursor: pointer;
}

form {
  width: 100%;
  max-width: 400px;
  gap: var(--size-24);
}

.form-group {
  margin-bottom: var(--size-24);
}

.error {
  color: red;
  margin-top: 10px;
}

.checkbox-group {
  display: flex;
  gap: var(--size-8);
  margin-top: var(--size-8);
}

.checkbox-group .item {
  position: relative;
  appearance: none;
  min-width: var(--size-16);
  max-width: var(--size-16);
  min-height: var(--size-16);
  max-height: var(--size-16);
}

.checkbox-group .item input[type="checkbox"] {
  position: relative;
  appearance: none;
  min-width: var(--size-16);
  max-width: var(--size-16);
  min-height: var(--size-16);
  max-height: var(--size-16);
  padding: 0;
  border-radius: var(--border-sm);
  background: var(--sky-blue);
  box-shadow: unset;
  cursor: pointer;
}

.checkbox-group .item svg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: var(--size-12);
  max-width: var(--size-12);
  min-height: var(--size-16);
  max-height: var(--size-16);
  fill: var(--slate-blue);
  cursor: pointer;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  font-size: var(--text-sm);
  min-height: var(--size-16);
  max-height: var(--size-16);
  margin-bottom: 0;
  cursor: pointer;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: var(--size-12);
}

@media (max-width: 1023px) {
  .content-area {
    padding: var(--size-24);
  }
}

@media (max-width: 767px) {
  .content-area {
    padding: var(--size-16);
  }
}

footer a {
  color: var(--grey);
  font-weight: var(--semi-bold);
  text-decoration: underline;
  cursor: pointer;
}
</style>
