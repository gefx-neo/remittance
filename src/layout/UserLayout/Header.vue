<template>
  <div class="header-area">
    <div class="hamburger">
      <font-awesome-icon
        :icon="['fas', 'bars']"
        @click="store.openSidebar"
        class="icon"
      />
      <a href="/#/dashboard">
        <img src="@/assets/logo.jpg" class="logo" />
      </a>
    </div>
    <!-- <button class="notification">
      <font-awesome-icon :icon="['fas', 'bell']" />
    </button> -->
    <div
      class="profile"
      :class="{ open: store.isDropdownOpen }"
      ref="profileDropdown"
    >
      <button class="user" @click="store.toggleDropdown">
        <font-awesome-icon :icon="['fas', 'user']" />
        <span class="name">{{ username }}</span>
        <font-awesome-icon
          :icon="['fa', 'chevron-down']"
          class="arrow-down"
          :class="{ open: store.isDropdownOpen }"
        />
      </button>
      <div class="dropdown-menu" :class="{ open: store.isDropdownOpen }">
        <div class="header">
          <div class="btn-round" @click="store.closeDropdown">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
              <path
                d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
              />
            </svg>
          </div>
        </div>
        <RouterLink to="/profile">
          <span class="icon">
            <font-awesome-icon :icon="['fas', 'user']" size="1x" />
          </span>
          <span>Profile</span>
        </RouterLink>
        <RouterLink to="/setting">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
                d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"
              />
            </svg>
          </span>
          <span>Setting</span>
        </RouterLink>
        <RouterLink to="/faq" class="faq">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
                d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3l58.3 0c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24l0-13.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1l-58.3 0c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"
              />
            </svg>
          </span>
          <span>Help</span>
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
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "../../stores/authStore.js";
import { useStore } from "@/stores/store.js";

const authStore = useAuthStore();
const store = useStore();
const router = useRouter();
const username = computed(() => authStore.username);
const profileDropdown = ref(null);
const logout = async () => {
  try {
    await authStore.logout(username);
  } catch (error) {
    console.error("Failed to get username to logout:", error);
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
  height: 100px;
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
  background: var(--sky-blue);
}

.notification:focus {
  background: var(--cool-blue);
}

.profile {
  position: relative;
  border-radius: var(--border-md);
}

.profile .user {
  display: flex;
  align-items: center;
  gap: var(--size-8);
  padding: var(--size-8) var(--size-4);
  min-height: var(--size-48);
  max-height: var(--size-48);
  border-radius: var(--border-md);
  background: var(--white);
}

.profile .user:hover {
  background: var(--sky-blue);
}

.profile .user:focus {
  background: var(--cool-blue);
}

.profile .user:focus:not(:focus-visible) {
  background: var(--white);
}

.profile .user:focus:hover {
  background: var(--sky-blue);
}

.profile .user:focus:active {
  background: var(--cool-blue);
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
  transition: transform 0.3s cubic-bezier(0, 0.94, 0.62, 1);
}

.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1054;
  padding: 8px;
  margin: 0;
  width: 320px;
  background: var(--white);
  border-radius: var(--border-lg);
  box-shadow: 0 0 40px rgba(69, 71, 69, 0.2);
  padding: var(--size-24) var(--size-16);
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
  padding: var(--size-dropdown-item);
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
  fill: var(--slate-blue);
}

.dropdown-menu a:hover svg,
.dropdown-menu a:hover span,
.dropdown-menu button:hover svg,
.dropdown-menu button:hover span {
  color: var(--slate-blue);
  fill: var(--slate-blue);
}

.dropdown-menu a.faq {
  display: none;
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
  fill: var(--cool-blue);
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

.btn-round {
  display: none;
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
    max-height: unset;
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

  .dropdown-menu a.faq {
    display: flex;
  }

  .header {
    display: flex;
    justify-content: end;
  }

  .header .btn-round {
    display: flex;
  }

  .header .btn-round svg {
    min-width: var(--size-16);
    max-width: var(--size-16);
    min-height: var(--size-16);
    max-height: var(--size-16);
    fill: var(--black);
    color: var(--black);
  }
}
</style>
