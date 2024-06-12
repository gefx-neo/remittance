<template>
  <div class="header-area">
    <div class="logo">
      <RouterLink to="/">
        <img src="@/assets/logo.jpg" />
      </RouterLink>
    </div>
    <div class="menu">
      <div>Icon</div>
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
  height: 136px;
}

.logo {
  width: 240px;
  height: 136px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo img {
  height: 40px;
}

.menu {
  width: calc(100% - 240px);
  text-align: right;
  max-width: 1016px;
  margin: 0 auto;
  padding: 0 64px;
}

/* TABLET */
@media (max-width: 991px) {
  .header-area {
    width: 100%;
    max-width: 936px;
    margin: 0 auto;
    padding: 0 var(--size-24);
  }

  .logo {
    justify-content: start;
  }

  .menu {
    width: 100%;
    padding: 0;
  }
}
/* TABLET */

/* MOBILE  */
@media (max-width: 768px) {
  .header-area {
    height: 88px;
    padding: 0 var(--size-16);
    border-bottom: 1px solid rgba(14, 15, 12, 0.122);
  }

  .logo {
    display: block;
    min-width: 118px;
    max-width: 118px;
    min-height: var(--size-40);
    max-height: var(--size-40);
  }

  .menu {
    padding: 0;
  }
}
/* MOBILE */
</style>
