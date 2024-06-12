<template>
  <div class="page-layout">
    <Header />
    <div class="main-container">
      <RouterView />
    </div>
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

/* .main-container {
  max-width: 1016px;
  margin: 0 auto;
  padding: 0 64px;
  display: block;
  width: calc(100% - 240px);
  height: 200vh;
} */

/* TABLET */
@media (max-width: 991px) {
  /* .main-container {
    max-width: 936px;
    width: 100%;
    padding: 0 24px;
  } */
}
/* TABLET */

/* MOBILE  */
@media (max-width: 768px) {
  /* .main-container {
    padding: 0 var(--size-16);
    max-width: 1216px;
    width: 100%;
  } */
}
/* MOBILE */

/* DESKTOP */
@media (min-width: 991px) {
  .page-layout {
    max-width: 1440px;
    margin: 0 auto;
  }
}
/* DESKTOP */
</style>
