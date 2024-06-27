<template>
  <div class="page-layout">
    <div class="main-container">
      <div class="left-container">
        <Header />
        <RouterView />
      </div>
      <div class="right-container"></div>
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

.main-container {
  min-height: 100vh;
  display: flex;
  width: 100%;
}

.left-container {
  min-width: 50%;
  max-width: 50%;
}

.right-container {
  min-width: 50%;
  max-width: 50%;
  background: var(--crimson-red);
}

/* DESKTOP */
@media (min-width: 991px) {
  .page-layout {
    max-width: 1440px;
    margin: 0 auto;
  }
}

@media (max-width: 991px) {
  .left-container {
    min-width: 100%;
    max-width: 100%;
  }

  .right-container {
    display: none;
  }
}
/* DESKTOP */
</style>
