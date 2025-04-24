<template>
  <div class="page-layout">
    <Sidebar />
    <div class="main-container">
      <Header />
      <RouterView />
      <Footer />
    </div>
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import Sidebar from "./Sidebar.vue";
import Header from "./Header.vue";
import Footer from "./Footer.vue";
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
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 var(--size-32);
  display: block;
  width: calc(100% - 240px);
}

/* TABLET */
@media (max-width: 1023px) {
  .main-container {
    width: 100%;
    padding: 0 var(--size-24);
  }
}
/* TABLET */

/* MOBILE  */
@media (max-width: 767px) {
  .main-container {
    width: 100%;
    padding: 0 var(--size-16);
    padding-bottom: 76px;
  }
}
/* MOBILE */

/* DESKTOP */
@media (min-width: 1023px) {
  .page-layout {
    max-width: 1440px;
    display: flex;
    margin: 0 auto;
  }
}
/* DESKTOP */
</style>
