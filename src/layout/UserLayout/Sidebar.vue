<template>
  <div class="sidebar-container" :class="{ open: store.isSidebarOpen }">
    <div class="logo">
      <RouterLink to="/home">
        <img src="@/assets/logo.jpg" />
      </RouterLink>
    </div>

    <div class="close-button" @click="store.closeSidebar">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
        <path
          d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
        />
      </svg>
    </div>

    <div class="navigation">
      <RouterLink
        v-for="route in desktopRoutes"
        :key="route.label"
        :to="route.to"
      >
        <span class="icon">
          <font-awesome-icon :icon="route.icon" size="1x" />
        </span>
        <span>{{ route.label }}</span>
      </RouterLink>
    </div>
  </div>
  <div
    @click="store.closeSidebar"
    class="backdrop"
    :class="{ open: store.isSidebarOpen }"
  ></div>
  <div class="mobile-footer-container">
    <RouterLink v-for="route in mobileRoutes" :key="route.label" :to="route.to">
      <span class="icon">
        <font-awesome-icon :icon="route.icon" size="1x" />
      </span>
      <span class="label">{{ route.label }}</span>
    </RouterLink>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "../../stores/authStore.js";
import { useStore } from "@/stores/useStore";

const authStore = useAuthStore();
const store = useStore();
const router = useRouter();

const desktopRoutes = [
  { to: "/home", icon: ["fas", "home"], label: "Home" },
  { to: "/recipent", icon: ["fas", "user"], label: "Recipents" },
  { to: "/payment", icon: ["fas", "money-bill"], label: "Payments" },
  { to: "/help", icon: ["fas", "question-circle"], label: "Help" },
];

const mobileRoutes = [
  { to: "/home", icon: ["fas", "home"], label: "Home" },
  { to: "/recipent", icon: ["fas", "user"], label: "Recipents" },
  { to: "/payment", icon: ["fas", "money-bill"], label: "Payments" },
  { to: "/help", icon: ["fas", "question-circle"], label: "Help" },
];

// Handle dropdown state on route change
router.beforeEach((to, from, next) => {
  store.closeSidebar();
  next();
});

// Close dropdown after each route change
router.afterEach(() => {
  store.closeSidebar();
});
</script>

<style scoped>
.sidebar-container {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 240px;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-screen);
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

.navigation {
  display: flex;
  flex-direction: column;
  padding-left: var(--size-24);
  padding-right: var(--size-24);
}

.navigation a {
  display: flex;
  align-items: center;
  gap: var(--size-12);
  padding: var(--size-12) var(--size-16);
  font-size: var(--text-md);
  color: var(--cool-blue);
  text-decoration: none;
}

.navigation a span {
  font-weight: var(--semi-bold);
}

.navigation a:hover svg,
.navigation a:hover span {
  color: var(--slate-blue) !important;
}

.navigation .icon {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: var(--size-16);
  max-width: var(--size-16);
  min-height: var(--size-16);
  max-height: var(--size-16);
}

.navigation .icon svg {
  color: var(--cool-blue);
  min-width: var(--size-16);
  max-width: var(--size-16);
  min-height: var(--size-16);
  max-height: var(--size-16);
}

.backdrop.open,
.close-button {
  display: none;
}

@media (max-width: 991px) {
  .sidebar-container {
    position: fixed;
    width: 264px;
    vertical-align: top;
    height: 100%;
    z-index: 3;
    transition: transform 0.5s ease;
    top: 0;
    max-height: 100vh;
    max-height: 100dvh;
    overflow-y: auto;
    z-index: 1060;
  }

  .sidebar-container:not(.open) {
    visibility: hidden;
    transform: translateX(-264px);
  }

  .backdrop.open {
    display: block;
  }

  .close-button {
    display: flex;
    position: absolute;
    right: 0;
  }
}

.mobile-footer-container {
  display: none;
}

@media (max-width: 768px) {
  .sidebar-container {
    display: none !important;
  }

  .backdrop.open {
    display: none;
  }

  .mobile-footer-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    align-content: center;
    width: 100%;
    height: 62px;
    background: var(--bg-screen);
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    padding: 0;
    z-index: 8;
    transition: transform 0.08s linear 0.12s;
  }

  .mobile-footer-container a {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: var(--size-4);
    text-decoration: none;
    color: var(--cool-blue);
  }

  .mobile-footer-container a .icon {
    min-width: var(--size-16);
    text-align: center;
  }

  .mobile-footer-container a .icon svg {
    color: var(--cool-blue);
  }

  .mobile-footer-container a .label {
    font-size: var(--text-xs);
  }

  .mobile-footer-container a:hover .icon svg,
  .mobile-footer-container a:hover .label {
    color: var(--slate-blue) !important;
    font-weight: var(--semi-bold);
  }
}
</style>
