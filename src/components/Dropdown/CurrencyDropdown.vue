<template>
  <div class="dropdown-menu" :class="{ open: isDropdownOpen }">
    <div class="header">
      <div class="btn-close" @click="handleClose">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
          <path
            d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
          />
        </svg>
      </div>
    </div>
    <div class="body">
      <div class="title">All currencies</div>
      <div
        v-for="item in currencies"
        :key="item.code"
        @click="selectCurrency(item)"
        class="item"
        :class="{ active: isActive(item) }"
      >
        <div class="currency">
          <img :src="getCurrencyImagePath(item.code)" />
          <span class="name">{{ item.name }}</span>
        </div>
        <font-awesome-icon
          v-if="isActive(item)"
          :icon="['fas', 'check']"
          class="icon-check"
        />
      </div>
    </div>
  </div>
  <div
    class="backdrop"
    @click="handleClose"
    :class="{ open: isDropdownOpen }"
  ></div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { getCurrencyImagePath } from "@/utils/beneficiaryUtils";

const props = defineProps({
  isDropdownOpen: Boolean,
  selectedCurrency: String,
  currencies: Array,
});

const emit = defineEmits(["updateCurrency", "closeDropdown"]);

const selectedCurrencyName = computed(() => {
  const currency = props.currencies.find(
    (currency) => currency.code === props.selectedCurrency
  );
  return currency ? currency.name : "";
});

const isActive = (item) => item.code === props.selectedCurrency;

const selectCurrency = (item) => {
  emit("updateCurrency", item.code);
  emit("closeDropdown");
};

const handleClose = () => {
  emit("closeDropdown");
};

const dropdownMenuRef = ref(null);

const handleClickOutside = (event) => {
  if (dropdownMenuRef.value && !dropdownMenuRef.value.contains(event.target)) {
    handleClose();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.dropdown-menu {
  visibility: hidden;
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1056;
  margin: 0;
  width: 330px;
  height: 320px;
  background: var(--white);
  border-radius: var(--border-lg);
  box-shadow: 0 0 40px rgba(69, 71, 69, 0.2);
  transition: transform 0.15s;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.dropdown-menu.open {
  visibility: visible;
}

.dropdown-menu .header {
  display: none;
}

.dropdown-menu .body {
  overflow-y: auto;
  height: calc(100% - 16px);
}

.dropdown-menu .title {
  padding: 0 var(--size-12);
  padding-top: 8px;
  padding-bottom: 4px;
  margin: 0px var(--size-8);
  font-size: var(--text-sm);
  font-weight: var(--semi-bold);
  color: var(--cool-blue);
  position: sticky;
  top: 0;
  background: var(--white);
  z-index: 1;
}

.dropdown-menu .item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--size-12);
  margin: 0px var(--size-8);
  border-radius: var(--border-md);
  border: 1px solid var(--white);
  cursor: pointer;
}

.dropdown-menu .item .currency {
  display: flex;
  align-items: center;
  gap: var(--size-8);
}

.dropdown-menu .item:hover {
  border: 1px solid var(--black);
}

.dropdown-menu .item .country {
  display: flex;
  align-items: center;
  gap: var(--size-8);
}

.dropdown-menu .item img {
  min-width: var(--size-24);
  max-width: var(--size-24);
  min-height: var(--size-24);
  max-height: var(--size-24);
}

.dropdown-menu .item .name {
  font-weight: var(--semi-bold);
}

.dropdown-menu .item .code {
  font-size: var(--text-sm);
}

.dropdown-menu .icon-check {
  min-width: var(--size-12);
  max-width: var(--size-12);
  min-height: var(--size-12);
  max-height: var(--size-12);
}

/* Custom Scrollbar */
.dropdown-menu .body::-webkit-scrollbar {
  width: 8px;
  cursor: pointer;
}

.dropdown-menu .body::-webkit-scrollbar-thumb {
  background-color: var(--cool-blue);
  border-radius: var(--border-lg);
  cursor: pointer;
}

.dropdown-menu .body::-webkit-scrollbar-thumb:hover {
  background-color: var(--slate-blue);
}

.dropdown-menu .body::-webkit-scrollbar-track {
  background-color: var(--white);
}

@media (max-width: 767px) {
  .dropdown-menu {
    width: 100%;
    height: calc(100vh - 80px);
    position: fixed;
    top: unset;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 0px;
    border-top-left-radius: var(--border-lg);
    border-top-right-radius: var(--border-lg);
    width: calc(100% - var(--size-32));
    margin: auto;
    transform-origin: bottom;
    transition: visibility 0.3s, transform 0.3s;
  }

  .dropdown-menu:not(.open) {
    animation: menuSlideOut 0.3s ease-out forwards;
  }

  .dropdown-menu.open {
    animation: menuSlideIn 0.3s ease-out forwards;
  }

  @keyframes menuSlideIn {
    0% {
      transform: translateY(100%);
    }
    100% {
      transform: translateY(0);
    }
  }

  @keyframes menuSlideOut {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(100%);
    }
  }

  .dropdown-menu .header {
    display: flex;
    justify-content: end;
    padding: var(--size-8);
  }

  .dropdown-menu .header svg {
    min-width: var(--size-16);
    max-width: var(--size-16);
    min-height: var(--size-16);
    max-height: var(--size-16);
  }

  .dropdown-menu .body {
    margin-bottom: var(--size-8);
  }
}

@media (min-width: 767px) {
  .backdrop.open {
    display: none !important;
  }
}
</style>
