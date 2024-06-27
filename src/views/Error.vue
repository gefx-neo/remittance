<template>
  <div class="content-area">
    <div class="error">
      <div class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
          <path
            d="M208 64a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zM9.8 214.8c5.1-12.2 19.1-18 31.4-12.9L60.7 210l22.9-38.1C99.9 144.6 129.3 128 161 128c51.4 0 97 32.9 113.3 81.7l34.6 103.7 79.3 33.1 34.2-45.6c6.4-8.5 16.6-13.3 27.2-12.8s20.3 6.4 25.8 15.5l96 160c5.9 9.9 6.1 22.2 .4 32.2s-16.3 16.2-27.8 16.2H288c-11.1 0-21.4-5.7-27.2-15.2s-6.4-21.2-1.4-31.1l16-32c5.4-10.8 16.5-17.7 28.6-17.7h32l22.5-30L22.8 246.2c-12.2-5.1-18-19.1-12.9-31.4zm82.8 91.8l112 48c11.8 5 19.4 16.6 19.4 29.4v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V405.1l-60.6-26-37 111c-5.6 16.8-23.7 25.8-40.5 20.2S-3.9 486.6 1.6 469.9l48-144 11-33 32 13.7z"
          />
        </svg>
      </div>
      <div class="message">
        <h1>404</h1>
        <h2>Page not found</h2>
        <p>Sorry, the page you are looking for could not be found.</p>
        <router-link to="/home" v-if="authStore.user" class="btn-red"
          >Go back home</router-link
        >
        <router-link to="/" v-else class="btn-red">Go back home</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "../stores/authStore.js";
const authStore = useAuthStore();
</script>

<style scoped>
.content-area {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: var(--size-12);
  height: calc(100vh - 136px);
}

.error {
  display: flex;
}

.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--crimson-red);
  border-radius: var(--border-circle);
  width: 400px;
  height: 400px;
}

.icon svg {
  fill: var(--bg-screen);
  width: 300px;
  height: 300px;
}

.message {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  width: 400px;
  color: var(--slate-blue);
}

.message h1 {
  color: var(--slate-blue);
  font-weight: var(--semi-bold);
  font-size: 40px;
}

.message h2 {
  white-space: nowrap;
}

.message p {
  margin: var(--size-12) 0;
}

.message .btn-red {
  border-radius: var(--border-circle);
  padding: var(--size-8) var(--size-16);
}

.message a {
  color: var(--crimson-red);
  font-weight: var(--semi-bold);
  font-size: var(--text-lg);
}

@media (max-width: 991px) {
  .content-area {
    padding: 0 var(--size-24);
  }

  .error {
    flex-direction: column;
    align-items: center;
  }

  .icon {
    width: 200px;
    height: 200px;
  }

  .icon svg {
    width: 125px;
    height: 125px;
  }

  .message {
    width: 250px;
    justify-content: center;
  }

  .message p {
    margin-top: 0px;
  }
}

@media (max-width: 768px) {
  .content-area {
    height: calc(100vh - 88px);
    padding: 0 var(--size-16);
  }
}
</style>
