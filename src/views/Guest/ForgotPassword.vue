<template>
  <div class="content-area">
    <div class="heading">
      <h1>Reset password</h1>
    </div>
    <form v-if="step === 1" @submit.prevent="handleStep1">
      <div class="form-group">
        <label for="login">E-mail address</label>
        <input id="login" v-model="login" type="email" required />
      </div>
      <APIButton :disabled="store.isLoading" class="btn-red standard-button">
        Submit
      </APIButton>
    </form>

    <form v-if="step === 2" @submit.prevent="handleStep2">
      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
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
      </div>
      <div class="button-group">
        <APIButton :disabled="store.isLoading" class="btn-red standard-button">
          Submit
        </APIButton>
        <button type="button" class="btn-back standard-button" @click="goBack">
          Back
        </button>
      </div>
    </form>
    <div v-if="authStore.error" class="error">
      {{ authStore.error }}
    </div>
    <footer>
      <router-link to="/">Go back to login</router-link>
    </footer>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useStore } from "@/stores/useStore";
import APIButton from "@/components/ButtonAPI.vue"; // Import the reusable button

const authStore = useAuthStore();
const store = useStore();

const step = ref(1);
const login = ref("");
const password = ref("");
const showPassword = ref(false);

const handleStep1 = async () => {
  try {
    store.setLoading(true);
    await authStore.fetchHexAndIv();
    step.value = 2;
  } finally {
    store.setLoading(false);
  }
};

const handleStep2 = async () => {
  try {
    store.setLoading(true);
    await authStore.loginn(login.value, password.value);
  } finally {
    store.setLoading(false);
  }
};

const goBack = () => {
  step.value = 1;
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
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
