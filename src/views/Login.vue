<template>
  <div class="content-area">
    <div class="heading">
      <h1>Welcome back.</h1>
      <div>
        New to Great East Forex?
        <router-link to="/register">Register here</router-link>
      </div>
    </div>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="login">Username</label>
        <input id="login" v-model="login" type="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input id="password" v-model="password" type="password" required />
      </div>
      <button type="submit" class="btn-red">Log in</button>
    </form>
    <div v-if="authStore.error" class="error">
      {{ authStore.error }}
    </div>
    <footer>
      <router-link to="/forgot-password">Trouble logging in?</router-link>
    </footer>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/authStore.js";
import { useStore } from "@/stores/useStore";
import { RouterLink } from "vue-router";

const authStore = useAuthStore();
const store = useStore();

const login = ref("");
const password = ref("");

const handleLogin = async () => {
  console.log("clicked");
  if (store.isLoading) return;
  console.log("duplicate submit");
  store.setLoading(true);
  try {
    await authStore.loginn(login.value, password.value);
  } catch (error) {
  } finally {
    store.setLoading(false);
  }
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
  color: #666;
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

.btn-red {
  border-radius: 9999px;
  width: 100%;
  min-height: var(--size-48);
  padding: var(--size-dropdown-item);
}

@media (max-width: 1023px) {
  .content-area {
    padding: 0 var(--size-24);
  }
}

@media (max-width: 767px) {
  .content-area {
    padding: 0 var(--size-16);
  }
}

footer a {
  color: #666;
  font-weight: var(--semi-bold);
  text-decoration: underline;
  cursor: pointer;
}
</style>
