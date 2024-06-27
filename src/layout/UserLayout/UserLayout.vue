<template>
  <div class="page-layout" v-if="authStore.user">
    <Sidebar />
    <div class="main-container">
      <Header />
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import Sidebar from "./Sidebar.vue";
import Header from "./Header.vue";
import { useAuthStore } from "../../stores/authStore.js";

const authStore = useAuthStore();
</script>

<style scoped>
/* MOBILE 365PX ~ 768PX */
/* TABLET 769PX ~ 990PX */
/* DESKTOP 991PX AND ABOVE */

.page-layout {
  min-height: 100vh;
  background-color: var(--bg-screen);
  width: 100%;
}

.main-container {
  max-width: 1016px;
  margin: 0 auto;
  padding: 0 var(--size-40);
  display: block;
  width: calc(100% - 240px);
}

/* TABLET */
@media (max-width: 991px) {
  .main-container {
    max-width: 936px;
    width: 100%;
    padding: 0 var(--size-24);
  }
}
/* TABLET */

/* MOBILE  */
@media (max-width: 768px) {
  .main-container {
    max-width: 1216px;
    width: 100%;
    padding: 0 var(--size-16);
    padding-bottom: 62px;
  }
}
/* MOBILE */

/* DESKTOP */
@media (min-width: 991px) {
  .page-layout {
    max-width: 1440px;
    display: flex;
    margin: 0 auto;
  }
}
/* DESKTOP */
</style>
