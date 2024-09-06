<template>
  <div class="header-container">
    <div class="header-area">
      <div class="logo">
        <RouterLink to="/">
          <img src="@/assets/logo.jpg" />
        </RouterLink>
      </div>
      <div class="menu">
        <div class="login-section">
          <RouterLink to="/register" class="register">Register</RouterLink>
          <RouterLink to="/login" class="btn-red login">Log in</RouterLink>
        </div>
      </div>
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
.header-container {
  height: 100px;
}

.header-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1440px;
  height: 100px;
  position: fixed;
  top: 0;
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

.menu {
  display: flex;
  align-items: center;
  justify-content: end;
  width: calc(100% - 240px);
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 var(--size-32);
  min-height: var(--size-40);
  max-height: var(--size-40);
}

.login-section {
  height: var(--size-40);
  display: flex;
  align-items: center;
  gap: var(--size-4);
}

.menu .register {
  color: var(--slate-blue);
  font-weight: var(--semi-bold);
  padding: 4px 8px;
  border-radius: 9999px;
}

.menu .register:hover {
  background: var(--sky-blue);
}

.menu .register:focus {
  background: var(--cool-blue);
}

.menu .login {
  padding: 4px 16px;
  border-radius: 9999px;
}

/* TABLET */
@media (max-width: 1023px) {
  .header-container {
    height: 100px;
    margin: 0 auto;
  }

  .header-area {
    width: 100%;
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
@media (max-width: 767px) {
  .header-container {
    height: 80px;
  }

  .header-area {
    height: 80px;
    padding: 0 var(--size-16);
    border-bottom: 1px solid rgba(102, 102, 102, 0.2);
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

  .menu {
    padding: 0;
  }
}
/* MOBILE */
</style>
