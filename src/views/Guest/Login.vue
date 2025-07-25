<template>
  <div class="content-area">
    <div class="heading">
      <h1>Welcome back</h1>
      <div v-if="step === 1">
        No account yet?
        <router-link to="/register">Register here</router-link>
      </div>
      <div v-if="step === 2 && form.username">{{ form.username }}</div>
    </div>

    <div class="form" v-if="step === 1" @keydown.enter.prevent="handleStep1">
      <fieldset :disabled="store.isLoading">
        <div class="form-group">
          <label for="login">E-mail address</label>
          <input type="text" id="username" v-model="form.username" />
          <span v-if="errors.username" class="error">{{
            errors.username
          }}</span>
        </div>
        <div class="button-group">
          <ButtonAPI
            class="btn-red standard-button"
            :disabled="store.isLoading"
            @click="handleStep1"
          >
            Next
          </ButtonAPI>
          <!-- <button
            class="btn-singpass standard-button"
            @click="redirectToSingpass"
          >
            Log in with <img src="@/assets/singpass_logo_fullcolours-1.png" />
          </button> -->
        </div>
      </fieldset>
    </div>
    <div class="form" v-if="step === 2" @keydown.enter.prevent="handleStep2">
      <fieldset :disabled="store.isLoading">
        <div class="form-group">
          <label for="password">Password</label>
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="form.password"
          />
          <span v-if="errors.password" class="error">{{
            errors.password
          }}</span>
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
        </div>
        <div class="button-group">
          <ButtonAPI class="btn-red standard-button" @click="handleStep2">
            Login
          </ButtonAPI>
          <button
            @click="handleBack"
            type="button"
            class="btn-back standard-button"
          >
            Back
          </button>
        </div>
        <div v-show="authStore.error" class="error">
          {{ authStore.error }}
        </div>
      </fieldset>
    </div>

    <div class="footer">
      <div><router-link to="/forgotpassword">Forgot password</router-link></div>
      <div>
        By clicking Login, you agree to our
        <span @click="openTermsModal">Terms</span> and
        <span @click="openPolicyModal">Privacy Policy</span>
      </div>
    </div>
  </div>
  <ModalTerms
    :isModalOpen="isTermsModal"
    title="Terms and conditions"
    @close="isTermsModal = false"
  />
  <ModalPolicy
    :isModalOpen="isPolicyModal"
    title="Privacy Policy"
    @close="isPolicyModal = false"
  />
</template>

<script setup>
import { onBeforeRouteLeave } from "vue-router";
import { ref, reactive } from "vue";
import { useStore } from "@/stores/store";
import { validationService } from "@/services/validationUserService.js";
import ModalTerms from "../../components/Modal/ModalTerms.vue";
import ModalPolicy from "../../components/Modal/ModalPolicy.vue";
import MaintenanceBanner from "./components/MaintenanceBanner.vue";
import { ButtonAPI } from "@/components/Form";
import { useAlertStore, useAuthStore } from "@/stores/index.js";
import { DEFAULT_ERROR_MESSAGE } from "@/services/apiService";

const authStore = useAuthStore();
const store = useStore();
const alertStore = useAlertStore();

const step = ref(1);
const showPassword = ref(false);

const form = reactive({
  username: "",
  password: "",
});

const redirectToSingpass = () => {
  window.location.href = "/login";
};
const isTermsModal = ref(false);
const isPolicyModal = ref(false);
const openTermsModal = () => {
  isTermsModal.value = true;
};
const openPolicyModal = () => {
  isPolicyModal.value = true;
};

const errors = reactive({});

const handleStep1 = async () => {
  // Clear previous errors before validation
  clearErrors();

  // Revalidate on submit
  const validationErrors = validationService.validateUsername(form);
  Object.assign(errors, validationErrors);

  // Prevent submit if error exists
  if (Object.keys(errors).length > 0) {
    return;
  }

  try {
    const response = await authStore.getReqKey(form.username);

    if (response.status === 1) {
      step.value = 2;
    } else {
      alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
    }
  } catch (error) {
    alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
  }
};

const handleStep2 = async () => {
  clearErrors();

  const validationErrors = validationService.validatePassword(form);
  Object.assign(errors, validationErrors);

  if (Object.keys(errors).length > 0) {
    return;
  }

  try {
    await authStore.login(form);
  } catch (error) {
    alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
  }
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleBack = () => {
  step.value = 1;
  form.password = "";
  authStore.error = null;
  // clearErrors();
};

const clearErrors = () => {
  Object.keys(errors).forEach((key) => delete errors[key]);
};

onBeforeRouteLeave((to, from, next) => {
  authStore.$reset();
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

.form a {
  display: flex;
  justify-content: start;
  color: var(--grey);
  text-decoration: underline;
  font-weight: var(--semi-bold);
  margin-bottom: var(--size-12);
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

.footer {
  color: var(--grey);
  font-size: var(--text-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--size-12);
}

.footer div:nth-child(2) {
  text-align: center;
}

.footer a {
  color: var(--grey) !important;
  font-weight: var(--semi-bold);
  text-decoration: underline;
}

.footer span {
  font-weight: var(--semi-bold);
  cursor: pointer;
}
</style>
