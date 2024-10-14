<template>
  <div class="sidebar-container" :class="{ open: store.isSidebarOpen }">
    <div class="logo">
      <a href="/">
        <img src="@/assets/logo.jpg" />
      </a>
    </div>

    <div class="btn-close" @click="store.closeSidebar">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
        <path
          d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
        />
      </svg>
    </div>

    <div class="navigation">
      <div class="title">
        <h3>Remittance</h3>
        <font-awesome-icon :icon="['fa', 'chevron-down']" />
      </div>

      <RouterLink v-for="route in routes" :key="route.label" :to="route.to">
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
  <!-- <div class="mobile-footer-container">
    <RouterLink v-for="route in routes" :key="route.label" :to="route.to">
      <span class="icon">
        <font-awesome-icon :icon="route.icon" size="1x" />
      </span>
      <span class="label">{{ route.label }}</span>
    </RouterLink>
  </div> -->
</template>

<script setup>
import { useRouter, RouterLink } from "vue-router";
import { useStore } from "@/stores/useStore";

const store = useStore();
const router = useRouter();

const routes = [
  {
    to: "/admin/remittance/customermanagement",
    icon: ["fas", "user"],
    label: "Customer Management",
  },
  {
    to: "/admin/remittance/transactionmanagement",
    icon: ["fas", "money-bill"],
    label: "Transaction Management",
  },
  {
    to: "/admin/remittance/beneficiarymanagement",
    icon: ["fas", "user"],
    label: "Beneficiary Management",
  },
  // {
  //   to: "/admin/remittance/auditlog",
  //   icon: ["fas", "file"],
  //   label: "Audit Log",
  // },
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
  background-color: var(--white);
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

.navigation {
  display: flex;
  flex-direction: column;
  margin: 0 var(--size-8);
  border: 1px solid var(--light-grey);
  border-radius: var(--border-md);
}

.navigation .title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--sky-blue);
  padding: var(--size-12) var(--size-4);
  border-bottom: 1px solid var(--light-grey);
  border-radius: var(--border-md);
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  cursor: pointer;
}

.navigation .title svg {
  min-width: var(--size-16);
  max-width: var(--size-16);
  min-height: var(--size-16);
  max-height: var(--size-16);
  color: var(--slate-blue);
}

.navigation a {
  display: flex;
  align-items: center;
  gap: var(--size-12);
  padding: var(--size-12) var(--size-4);
  color: var(--cool-blue);
  text-decoration: none;
  border-bottom: 1px solid var(--light-grey);
}

.navigation a:last-child {
  border-bottom: none;
}

.navigation a:hover svg,
.navigation a:hover span {
  color: var(--slate-blue) !important;
  font-weight: var(--semi-bold);
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
.btn-close {
  display: none;
}

@media (max-width: 1023px) {
  .sidebar-container {
    position: fixed;
    width: 240px;
    vertical-align: top;
    height: 100%;
    z-index: 3;
    transition: transform 0.5s ease;
    top: 0;
    max-height: 100vh;
    max-height: 100dvh;
    overflow-y: auto;
    z-index: 1060;
    transition: visibility 0.3s, transform 0.3s;
  }

  .sidebar-container:not(.open) {
    visibility: hidden;
    transform: translateX(-240px);
  }

  .backdrop.open {
    display: block;
  }

  .btn-close {
    display: flex;
    position: absolute;
    right: 0;
  }

  .navigation {
    border: none;
    margin: 0px;
  }

  .navigation .title {
    background: none;
    border-bottom: none;
    padding: var(--size-12) var(--size-8);
  }

  .navigation a {
    border-bottom: none;
    padding-right: 0;
    padding: var(--size-12) var(--size-8);
  }
}

.mobile-footer-container {
  display: none;
}

@media (max-width: 767px) {
  .sidebar-container {
    display: none !important;
  }

  .backdrop.open {
    display: none;
  }

  .mobile-footer-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    width: 100%;
    height: 60px;
    background: var(--white);
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    padding: 0;
    z-index: 8;
    border-top: 1px solid var(--light-grey);
  }

  .mobile-footer-container a {
    display: flex;
    justify-content: center;
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
