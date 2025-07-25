<template>
  <div class="content-area">
    <div class="heading">
      <h1 v-if="step === 1">Reset password</h1>
      <h1 v-if="step === 2">Set new password</h1>
      <div v-if="step === 2 && form.username">{{ form.username }}</div>
    </div>

    <!-- Step 1: Reset Password Form -->
    <div
      class="form"
      v-if="step === 1"
      @keydown.enter.prevent="handleChangePassword"
    >
      <fieldset :disabled="store.isLoading">
        <div class="form-group">
          <label for="login">E-mail address</label>
          <input type="text" id="username" v-model="form.username" />
          <span v-if="errors.username" class="error">{{
            errors.username
          }}</span>
        </div>
        <ButtonAPI
          class="btn-red standard-button"
          @click="handleChangePassword"
        >
          Next
        </ButtonAPI>
      </fieldset>
    </div>

    <!-- Step 2: Set New Password Form -->
    <div
      class="form"
      v-if="step === 2"
      @keydown.enter.prevent="handleSetNewPassword"
    >
      <fieldset :disabled="store.isLoading">
        <div class="remark">
          We have sent the temporary passcode to your email. Did not receive?
          <ButtonAPI
            @click="handleSendAgain"
            :disabled="store.isResendLoading || store.resendTime > 0"
            :showLoader="false"
            class="btn-timer"
          >
            Send again.
            {{ store.resendTime > 0 ? `(${store.resendTime}s)` : "" }}
          </ButtonAPI>
        </div>
        <div class="form-group">
          <label for="code">Temporary passcode</label>
          <input type="text" id="code" v-model="form.code" />
          <span v-if="errors.code" class="error">{{ errors.code }}</span>
        </div>
        <div class="form-group">
          <div class="label">
            <label for="newPassword">New password</label>
            <Tooltip
              text="The special characters allowed are !@#$&*
"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path
                  d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"
                />
              </svg>
            </Tooltip>
          </div>
          <input
            :type="showPassword ? 'text' : 'password'"
            id="newPassword"
            v-model="form.newPassword"
          />
          <span v-if="errors.newPassword" class="error">{{
            errors.newPassword
          }}</span>
        </div>
        <div class="form-group">
          <label for="confirmNewPassword">Confirm new password</label>
          <input
            :type="showPassword ? 'text' : 'password'"
            id="confirmNewPassword"
            v-model="confirmNewPassword"
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
          <div v-if="errors.confirmNewPassword" class="error">
            {{ errors.confirmNewPassword }}
          </div>
        </div>
        <div class="button-group">
          <ButtonAPI
            class="btn-red standard-button"
            @click="handleSetNewPassword"
          >
            Submit
          </ButtonAPI>
          <button
            type="button"
            class="btn-back standard-button"
            @click="handleBack"
          >
            Back
          </button>
        </div>
      </fieldset>
    </div>

    <div v-show="forgotPasswordStore.error" class="error">
      {{ forgotPasswordStore.error }}
    </div>

    <div class="footer">
      <router-link to="/">Go back to login</router-link>
    </div>

    <Modal
      :isModalOpen="store.isModalOpen"
      title="Password Updated"
      :success="true"
      footerMessage="Your password has been changed."
    />
  </div>
</template>

<script setup>
import { onBeforeRouteLeave } from "vue-router";
import { ref, watch, reactive } from "vue";
import { useForgotPasswordStore } from "@/stores/forgotPasswordStore";
import { useStore } from "@/stores/store";
import { useAlertStore } from "@/stores/alertStore";
import Modal from "@/components/Modal/Modal.vue";
import { ButtonAPI } from "@/components/Form";
import { validationService } from "@/services/validationUserService.js";
import Tooltip from "@/components/Tooltip.vue";
import { DEFAULT_ERROR_MESSAGE } from "@/services/apiService";

const forgotPasswordStore = useForgotPasswordStore();
const store = useStore();
const alertStore = useAlertStore();

const step = ref(1);
const confirmNewPassword = ref("");
const showPassword = ref(false);

const form = reactive({
  code: "",
  username: "",
  newPassword: "",
});

const errors = reactive({});

const handleChangePassword = async () => {
  clearErrors();

  const validationErrors = validationService.validateUsername(form);
  Object.assign(errors, validationErrors);

  if (Object.keys(errors).length > 0) {
    return;
  }

  try {
    const response = await forgotPasswordStore.changePassword(form.username);

    if (response.status === 1) {
      step.value = 2;
    } else {
      alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
    }
  } catch (error) {
    alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
  }
};

const handleSendAgain = async () => {
  try {
    const response = await forgotPasswordStore.changePasswordTimer(
      form.username
    );

    if (response.status === 1) {
      store.startResendTimer();
    } else {
      alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
    }
  } catch (error) {
    alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
  }
};

const handleSetNewPassword = async () => {
  clearErrors();

  // Trim form fields, including confirmNewPassword
  validationService.trimFormFields(form);
  confirmNewPassword.value = validationService.trimValue(
    confirmNewPassword.value
  );

  const validationErrors = validationService.validateForgotPassword(form);
  Object.assign(errors, validationErrors);

  // Check if confirmNewPassword is empty
  if (confirmNewPassword.value === "") {
    errors.confirmNewPassword = "Please confirm your new password.";
  }

  // Check for password mismatch
  if (
    form.newPassword !== confirmNewPassword.value &&
    confirmNewPassword.value !== ""
  ) {
    errors.confirmNewPassword = "Passwords do not match.";
  }

  if (Object.keys(errors).length > 0) {
    return;
  }

  try {
    const response = await forgotPasswordStore.setNewPassword(form);

    if (response.status === 1) {
      store.openModal();
    }
  } catch (error) {
    alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
  }
};

const handleBack = () => {
  step.value = 1;
  store.resetResendTimer();
  forgotPasswordStore.$reset();
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

watch(step, async (newStep) => {
  if (newStep === 2) {
    try {
      await forgotPasswordStore.getReqKey(username.value);
    } catch (error) {
      alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
    }
  }
});

const clearErrors = () => {
  Object.keys(errors).forEach((key) => delete errors[key]);
};

onBeforeRouteLeave((to, from, next) => {
  forgotPasswordStore.$reset();
  next();
});
</script>

<style scoped>
.content-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--size-24);
  min-height: calc(100vh - 138px);
  padding-top: var(--size-80);
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

.form {
  width: 100%;
  max-width: 400px;
  gap: var(--size-24);
}

.form .remark {
  background: var(--lighter-grey);
  padding: var(--size-12);
  border-radius: var(--border-md);
  margin-bottom: var(--size-12);
}

.form .remark .btn-timer {
  background: none;
  color: var(--black);
  font-weight: var(--semi-bold);
  text-decoration: underline;
  padding: 0;
  display: unset;
}

.form .remark .btn-timer:disabled {
  background: none !important;
  color: var(--grey) !important;
  font-weight: var(--semi-bold);
  text-decoration: none;
}

.form-group {
  margin-bottom: var(--size-24);
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

@media (max-width: 767px) {
  .content-area {
    padding-top: var(--size-72);
  }
}

.footer a {
  background: none;
  color: var(--grey) !important;
  font-weight: var(--semi-bold);
  text-decoration: underline;
  cursor: pointer;
}

.label {
  display: flex;
  align-items: center;
  gap: var(--size-6);
}

.label .tooltip {
  margin-bottom: var(--size-4);
}

.label .tooltip svg {
  min-width: var(--size-16);
  max-width: var(--size-16);
  min-height: var(--size-16);
  max-height: var(--size-16);
  fill: var(--grey);
}
</style>
