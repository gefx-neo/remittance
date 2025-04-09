<template>
  <div class="content-area">
    <div class="error">
      <h1>404</h1>
      <h2>Page not found</h2>
      <p>Sorry, we couldn't find the page you're looking for</p>
      <router-link to="/#/dashboard" v-if="authStore.username" class="btn-blue"
        >Return to Dashboard</router-link
      >
      <router-link to="/" v-else class="btn-blue">Return to Home</router-link>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "../stores/authStore.js";
const authStore = useAuthStore();
</script>

<style scoped>
.content-area {
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  min-height: calc(100vh - 140px);
}

.error {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  white-space: nowrap;
  width: 100%;
}

.error h1 {
  font-family: "Rubik Dirt", serif;
  color: var(--black);
  font-size: var(--size-48);
  font-weight: 400;
}

.error h2 {
  font-family: "Rubik Dirt", serif;
  color: var(--black);
  white-space: nowrap;
  font-size: var(--text-xl);
  font-weight: 400;
}

.error p {
  font-family: "Archivo Black", serif;
  color: var(--grey);
  margin-top: var(--size-12);
  margin-bottom: var(--size-24);
  font-weight: var(--semi-bold);
}

.error .btn-blue {
  border-radius: var(--border-md);
  padding: var(--size-8) var(--size-16);
}

.error a {
  color: var(--white);
  font-weight: var(--semi-bold);
}

@media (max-width: 1023px) {
  .content-area {
    padding: 0 var(--size-24);
  }

  .error h1 {
    font-size: var(--size-40);
  }

  .error h2 {
    font-size: var(--text-lg);
  }

  .error p {
    white-space: normal;
  }
}

@media (max-width: 767px) {
  .content-area {
    height: calc(100vh - 80px);
    padding: 0 var(--size-16);
  }
}
</style>
