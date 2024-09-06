<template>
  <div class="header-container">
    <div class="header-area">
      <div class="logo">
        <RouterLink to="/">
          <img src="@/assets/logo.jpg" />
        </RouterLink>
      </div>
      <div class="hamburger" @click="store.toggleMenu">
        <font-awesome-icon
          v-if="!store.isMenuOpen"
          :icon="['fas', 'bars']"
          class="icon-open"
        />
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
          <path
            d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
          />
        </svg>
      </div>
      <div class="menu" :class="{ open: store.isMenuOpen }">
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

.hamburger {
  display: none;
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
  border-radius: var(--border-circle);
}

.menu .register:hover {
  background: var(--cool-blue);
}

.menu .login {
  padding: 4px 16px;
  border-radius: var(--border-circle);
}

/* TABLET */
@media (max-width: 1023px) {
  .header-area {
    width: 100%;
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
@media (max-width: 767px) {
  .header-container {
    height: 80px;
  }

  .header-area {
    height: 80px;
    padding: 0 var(--size-16);
    border-bottom: 1px solid rgba(14, 15, 12, 0.122);
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

  .hamburger {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: var(--size-40);
    max-width: var(--size-40);
    min-height: var(--size-40);
    max-height: var(--size-40);
    border-radius: var(--border-circle);
    transition: transform 0.35s ease;
  }

  .hamburger svg {
    min-width: var(--size-24);
    max-width: var(--size-24);
    min-height: var(--size-24);
    max-height: var(--size-24);
    color: var(--slate-blue);
  }

  .menu {
    position: fixed;
    top: 80px;
    left: 0;
    width: 100%;
    min-height: 100%;
    transform: translateX(-100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-4);
    z-index: 1;
    -webkit-transition: -webkit-transform 0.35s ease;
    transition: -webkit-transform 0.35s ease;
    transition: transform 0.35s ease;
    transition: transform 0.35s ease, -webkit-transform 0.35s ease;
    background: green;
  }

  .menu.open {
    transform: translateX(0%);
  }

  .login-section {
    margin-top: auto;
    flex-direction: column;
    position: sticky;
    bottom: 0;
    width: 100%;
    height: unset;
    background-color: hsla(0, 0%, 100%, 0.8);
    -webkit-backdrop-filter: blur(3px);
    backdrop-filter: blur(3px);
  }
}
/* MOBILE */
</style>
