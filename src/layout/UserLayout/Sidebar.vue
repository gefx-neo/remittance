<template>
  <div class="sidebar-container" :class="{ open: store.isSidebarOpen }">
    <div class="logo">
      <RouterLink to="/dashboard">
        <img src="@/assets/logo.jpg" />
      </RouterLink>
    </div>

    <div class="btn-close" @click="store.closeSidebar">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
        <path
          d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
        />
      </svg>
    </div>

    <div class="navigation">
      <RouterLink v-for="route in routes" :key="route.label" :to="route.to">
        <span class="icon">
          <font-awesome-icon :icon="route.icon" size="1x" />
        </span>
        <span>{{ route.label }}</span>
      </RouterLink>
    </div>
    <div class="footer">
      <div class="title">
        <div class="item">
          <p @click="openTermsModal">Terms</p>
          <span></span>
        </div>
        <div class="item">
          <p @click="openPolicyModal">Privacy</p>
        </div>
      </div>
      <p>Great East Forex © {{ currentYear }} All Rights Reserved</p>
    </div>
  </div>
  <div
    @click="store.closeSidebar"
    class="backdrop"
    :class="{ open: store.isSidebarOpen }"
  ></div>
  <div class="mobile-footer-container">
    <RouterLink
      v-for="route in routes"
      :key="route.label"
      :to="route.to"
      :class="{ help: route.label === 'Help' }"
    >
      <span class="icon">
        <font-awesome-icon :icon="route.icon" size="1x" />
      </span>
      <span class="label">{{ route.label }}</span>
    </RouterLink>
  </div>
  <ModalTerms
    :isModalOpen="isTermsModal"
    title="Terms and conditions"
    @close="isTermsModal = false"
  />
  <ModalPolicy
    :isModalOpen="isPolicyModal"
    title="Privacy Policy"
    @close="isPolicyModal = false"
  />
</template>

<script setup>
import { useRouter, RouterLink } from "vue-router";
import { useStore } from "@/stores/store";
import { ref, onMounted } from "vue";
import ModalTerms from "@/components/Modal/ModalTerms.vue";
import ModalPolicy from "@/components/Modal/ModalPolicy.vue";

const store = useStore();
const router = useRouter();

const isTermsModal = ref(false);
const isPolicyModal = ref(false);
const openTermsModal = () => {
  isTermsModal.value = true;
};
const openPolicyModal = () => {
  isPolicyModal.value = true;
};

const currentYear = ref(null);

onMounted(() => {
  currentYear.value = new Date().getFullYear();
});

const routes = [
  { to: "/dashboard", icon: ["fas", "home"], label: "Dashboard" },
  { to: "/beneficiary", icon: ["fas", "user"], label: "Beneficiary" },
  {
    to: "/transaction",
    icon: ["fas", "money-bill-wave"],
    label: "Transaction",
  },
  {
    to: "/localtransfer",
    icon: ["fas", "dollar-sign"],
    label: "Local Transfer",
  },
  {
    to: "/withdrawal",
    icon: ["fas", "hand-holding-usd"],
    label: "Withdrawal",
  },
  { to: "/faq", icon: ["fas", "question-circle"], label: "Help" },
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
  padding-left: var(--size-24);
  padding-right: var(--size-24);
}

.navigation a {
  display: flex;
  align-items: center;
  gap: var(--size-12);
  padding: var(--size-dropdown-item);
  color: var(--cool-blue);
  border-radius: var(--border-circle);
  text-decoration: none;
}

.navigation a:hover svg,
.navigation a:hover span {
  color: var(--slate-blue);
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
    overflow-y: auto;
    z-index: 1060;
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
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
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
    border-radius: 0;
  }

  .mobile-footer-container a.help {
    display: none;
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

.footer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  bottom: 0;
  width: 100%;
  padding-left: var(--size-24);
  padding-bottom: var(--size-12);
}

.footer .title {
  display: flex;
  gap: var(--size-4);
  cursor: pointer;
}

.footer .title p {
  font-weight: var(--semi-bold);
}

.footer .title .item {
  display: flex;
  align-items: center;
  gap: var(--size-4);
}

.footer .title .item span {
  width: 2px;
  height: 2px;
  background: var(--grey);
  border-radius: var(--border-circle);
}

.footer p {
  color: var(--grey);
  font-size: var(--text-xs);
}

@media (max-width: 767px) {
  .footer {
    display: none;
  }
}
</style>
