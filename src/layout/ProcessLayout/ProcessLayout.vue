<template>
  <div class="page-layout" v-if="authStore.user">
    <Header />
    <div class="main-container">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import Header from "./Header.vue";
import { useAuthStore } from "../../stores/authStore.js";

const authStore = useAuthStore();
</script>

<style scoped>
/* MOBILE 365PX ~ 767px */
/* TABLET 769PX ~ 990PX */
/* DESKTOP 1023px AND ABOVE */

.page-layout {
  min-height: 100vh;
  background-color: var(--white);
  width: 100%;
}

.main-container {
  padding: var(--size-24);
}

/* DESKTOP */
@media (min-width: 1023px) {
  .page-layout {
    max-width: 1440px;
    margin: 0 auto;
  }
}
/* DESKTOP */

/* TABLET */
@media (max-width: 1023px) {
  .main-container {
    padding-bottom: var(--size-24);
  }
}
/* TABLET */

/* MOBILE  */
@media (max-width: 767px) {
  .main-container {
    padding: var(--size-16);
  }
}
/* MOBILE */
</style>
