<template>
  <div class="content-area">
    <h2>Login</h2>
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
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/authStore.js";
import { useStore } from "@/stores/useStore";

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

form {
  width: 100%;
  max-width: 400px;
}

.error {
  color: red;
  margin-top: 10px;
}

.btn-red {
  border-radius: 9999px;
  width: 100%;
  min-height: var(--size-48);
  padding: var(--size-12) var(--size-16);
}
</style>
