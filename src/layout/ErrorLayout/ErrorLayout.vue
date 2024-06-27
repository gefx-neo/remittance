<template>
  <div class="page-layout">
    <Header />
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import Header from "./Header.vue";
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

/* DESKTOP */
@media (min-width: 991px) {
  .page-layout {
    max-width: 1440px;
    margin: 0 auto;
  }
}
/* DESKTOP */
</style>
