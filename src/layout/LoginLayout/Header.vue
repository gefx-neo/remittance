<template>
  <div class="header-area">
    <div class="logo">
      <RouterLink to="/">
        <img src="@/assets/logo.jpg" />
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { useRouter, RouterLink } from "vue-router";
import { useStore } from "@/stores/useStore";

const store = useStore();
const router = useRouter();

// Handle dropdown state on route change
router.beforeEach((to, from, next) => {
  store.closeDropdown();
  next();
});

// Close dropdown after each route change
router.afterEach(() => {
  store.closeDropdown();
});
</script>

<style scoped>
.header-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1440px;
  height: 100px;
  background: white;
}

.logo {
  width: 240px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo img {
  height: 40px;
}

/* TABLET */
@media (max-width: 1023px) {
  .header-area {
    height: 100px;
    padding: 0 var(--size-24);
  }

  .logo {
    justify-content: start;
  }
}
/* TABLET */

/* MOBILE  */
@media (max-width: 767px) {
  .header-container {
    height: 80px;
  }

  .header-area {
    height: 80px;
    padding: 0 var(--size-16);
  }

  .logo {
    display: block;
    min-width: 118px;
    max-width: 118px;
    min-height: 30px;
    max-height: 30px;
  }

  .logo img {
    height: 30px;
  }
}
/* MOBILE */
</style>
