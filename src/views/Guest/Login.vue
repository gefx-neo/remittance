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

    <form v-if="step === 1" @submit.prevent="handleStep1">
      <fieldset :disabled="store.isLoading">
        <div class="form-group">
          <label for="login">E-mail address</label>
          <input type="text" id="username" v-model="form.username" />
          <span v-if="errors.username" class="error">{{
            errors.username
          }}</span>
        </div>
        <ButtonAPI class="btn-red standard-button"> Next </ButtonAPI>
      </fieldset>
    </form>

    <form v-if="step === 2" @submit.prevent="handleStep2">
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
          <ButtonAPI class="btn-red standard-button"> Login </ButtonAPI>
          <button
            @click="goBack"
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
    </form>

    <footer>
      <router-link to="/forgotpassword">Forgot password?</router-link>
    </footer>
  </div>
</template>

<script setup>
import { onBeforeRouteLeave } from "vue-router";
import { ref, reactive } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useStore } from "@/stores/useStore";
import { validationService } from "@/services/validationUserService.js";
import ButtonAPI from "@/components/ButtonAPI.vue";

const authStore = useAuthStore();
const store = useStore();

const step = ref(1);
const showPassword = ref(false);

const form = reactive({
  username: "",
  password: "",
});

const errors = reactive({});

const handleStep1 = async () => {
  // Clear previous errors before validation
  clearErrors();

  // Revalidate on submit
  const validationErrors = validationService.validateUsername(form);
  Object.assign(errors, validationErrors);

  // Prevent submit if error exists
  if (Object.keys(errors).length > 0) {
    console.log("Validation errors:", errors);
    return;
  }

  try {
    const response = await authStore.getReqKey(form.username);

    if (response.status === 1) {
      step.value = 2;
    } else {
      console.log("Failed to get reqKey:", authStore.error);
    }
  } catch (error) {
    console.log("Failed to get reqKey:", authStore.error);
  }
};

const handleStep2 = async () => {
  clearErrors();

  const validationErrors = validationService.validatePassword(form);
  Object.assign(errors, validationErrors);

  if (Object.keys(errors).length > 0) {
    console.log("Validation errors:", errors);
    return;
  }

  try {
    await authStore.login(form);
  } catch (error) {
    console.log("Login failed:", error);
  }
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const goBack = () => {
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
