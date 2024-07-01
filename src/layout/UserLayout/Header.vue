<template>
  <div class="header-area">
    <div class="hamburger">
      <font-awesome-icon
        :icon="['fas', 'bars']"
        @click="store.openSidebar"
        class="icon"
      />
      <RouterLink to="/home">
        <img src="@/assets/logo.jpg" class="logo" />
      </RouterLink>
    </div>
    <button class="notification">
      <font-awesome-icon :icon="['fas', 'bell']" />
    </button>
    <div
      class="profile"
      :class="{ open: store.isDropdownOpen }"
      ref="profileDropdown"
    >
      <button class="user" @click="store.toggleDropdown">
        <font-awesome-icon :icon="['fas', 'user']" />
        <span class="name">Elvin Ong</span>
        <font-awesome-icon
          :icon="['fa', 'chevron-down']"
          class="arrow-down"
          :class="{ open: store.isDropdownOpen }"
        />
      </button>
      <div class="dropdown-menu" :class="{ open: store.isDropdownOpen }">
        <div class="btn-close" @click="store.closeDropdown">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
            <path
              d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
            />
          </svg>
        </div>
        <div class="username">Elvin Ong</div>
        <RouterLink to="/profile">
          <span class="icon">
            <font-awesome-icon :icon="['fas', 'user']" size="1x" />
          </span>
          <span>Profile</span>
        </RouterLink>
        <button class="logout" @click="logout">
          <span class="icon">
            <font-awesome-icon :icon="['fas', 'sign-out-alt']" size="1x" />
          </span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "../../stores/authStore.js";
import { useStore } from "@/stores/useStore";

const authStore = useAuthStore();
const store = useStore();
const router = useRouter();

const profileDropdown = ref(null);

const logout = async () => {
  if (store.isLoading) return;
  store.setLoading(true);
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    authStore.logout();
  } catch (error) {
  } finally {
    store.setLoading(false);
  }
};

const handleClickOutside = (event) => {
  if (profileDropdown.value && !profileDropdown.value.contains(event.target)) {
    store.closeDropdown();
  }
};

// Handle dropdown state on route change
router.beforeEach((to, from, next) => {
  store.closeDropdown();
  next();
});

// Close dropdown after each route change
router.afterEach(() => {
  store.closeDropdown();
});

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.header-area {
  height: 120px;
  display: flex;
  align-items: center;
  gap: var(--size-16);
}
.hamburger {
  display: flex;
  flex-grow: 1;
}
.hamburger .logo {
  display: none;
}
.hamburger svg {
  color: var(--slate-blue);
}

.notification {
  min-width: var(--size-40);
  max-width: var(--size-40);
  min-height: var(--size-40);
  max-height: var(--size-40);
  border-radius: var(--border-circle);
}

.notification:hover {
  background: var(--cool-blue);
}

.profile {
  position: relative;
}

.profile .user {
  display: flex;
  align-items: center;
  gap: var(--size-8);
  min-height: var(--size-40);
  max-height: var(--size-40);
}

.profile:hover,
.profile.open {
  background: var(--cool-blue);
  border-radius: var(--border-md);
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border 0.15s ease-in-out;
}

.profile .user .name {
  color: var(--slate-blue);
  font-weight: var(--semi-bold);
}

svg {
  min-width: var(--size-24);
  max-width: var(--size-24);
  min-height: var(--size-24);
  max-height: var(--size-24);
  color: var(--slate-blue);
}

.user .arrow-down {
  min-width: var(--size-16);
  max-width: var(--size-16);
  min-height: var(--size-16);
  max-height: var(--size-16);
}

.user .arrow-down.open {
  transform: rotate(180deg);
  transition: transform 0.35s cubic-bezier(0, 0.94, 0.62, 1);
}

.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1054;
  padding: 8px;
  margin: 0;
  width: 330px;
  height: 200px;
  background: var(--bg-screen);
  border-radius: var(--border-lg);
  box-shadow: 0 0 40px rgba(69, 71, 69, 0.2);
  padding: var(--size-32);
}

.dropdown-menu.open {
  display: block;
}

.dropdown-menu a,
.dropdown-menu button {
  display: flex;
  align-items: center;
  gap: var(--size-12);
  width: 100%;
  padding: var(--size-12) var(--size-16);
  font-size: var(--text-md);
  color: var(--cool-blue);
  text-decoration: none;
  border: 1px solid #ffffff;
  border-radius: var(--border-md);
}

.dropdown-menu a span,
.dropdown-menu button span {
  font-weight: var(--semi-bold);
}

.dropdown-menu a:hover,
.dropdown-menu button:hover {
  border: 1px solid var(--slate-blue);
  color: var(--slate-blue);
}

.dropdown-menu a:hover svg,
.dropdown-menu a:hover span,
.dropdown-menu button:hover svg,
.dropdown-menu button:hover span {
  color: var(--slate-blue);
}

.dropdown-menu .icon {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: var(--size-16);
  max-width: var(--size-16);
  min-height: var(--size-16);
  max-height: var(--size-16);
}

.dropdown-menu .icon svg {
  min-width: var(--size-16);
  max-width: var(--size-16);
  min-height: var(--size-16);
  max-height: var(--size-16);
  color: var(--cool-blue);
}

@media (min-width: 1023px) {
  .hamburger .icon {
    display: none;
  }
}
@media (max-width: 1023px) {
  .profile .user .name {
    display: none;
  }
}
@media (max-width: 767px) {
  .header-area {
    height: 80px;
  }

  .hamburger .logo {
    display: block;
    min-height: 30px;
    max-height: 30px;
  }

  .hamburger .icon {
    display: none;
  }
}

.btn-close {
  display: none;
}

.no-scroll {
  position: fixed;
}

.dropdown-menu .username {
  text-align: center;
  font-size: var(--size-20);
  font-weight: var(--semi-bold);
  color: var(--slate-blue);
}

@media (max-width: 767px) {
  .profile {
    position: unset;
  }
  .dropdown-menu:not(.open) {
    transform: scaleX(0);
    transform-origin: right;
  }

  .dropdown-menu.open {
    transform: scaleX(1);
    transform-origin: right;
    transition: transform 0.5s ease;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    overflow-y: auto;
    border-radius: 0px;
    max-width: none;
    animation: listSlideOver 0.15s ease-out forwards;
  }

  @keyframes listSlideOver {
    0% {
      transform: translateX(100vw);
    }

    to {
      transform: translateX(0);
    }
  }

  .btn-close {
    display: flex;
    background: var(--cool-blue);
  }

  .dropdown-menu .username {
    font-size: var(--size-24);
  }
}
</style>
