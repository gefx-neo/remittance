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
/* MOBILE 365PX ~ 767px */
/* TABLET 769PX ~ 990PX */
/* DESKTOP 1023px AND ABOVE */

.page-layout {
  min-height: 100vh;
  background-color: var(--white);
  width: 100%;
}

/* DESKTOP */
@media (min-width: 1023px) {
  .page-layout {
    max-width: 1440px;
    margin: 0 auto;
  }
}
/* DESKTOP */
</style>
