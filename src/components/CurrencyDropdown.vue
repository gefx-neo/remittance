<template>
  <div class="dropdown-menu" :class="{ open: isDropdownOpen }">
    <div class="dropdown">
      <button class="dropdown-toggle" @click="currencyStore.closeAllDropdowns">
        {{ selectedCurrency }}
      </button>
      <ul>
        <li
          v-for="currency in currencies"
          :key="currency"
          @click="selectCurrency(currency)"
        >
          {{ currency }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useCurrencyStore } from "@/stores/currencyStore";

const props = defineProps({
  currencyType: {
    type: String,
    required: true,
  },
  isDropdownOpen: {
    type: Boolean,
    required: true,
  },
  closeDropdown: {
    type: Function,
    required: true,
  },
});

const emit = defineEmits(["updateCurrency"]);

const currencyStore = useCurrencyStore();

const currencies = computed(() => currencyStore.currencies);

const selectedCurrency = computed({
  get() {
    return props.currencyType === "sender"
      ? currencyStore.senderCurrency
      : currencyStore.recipientCurrency;
  },
  set(value) {
    if (props.currencyType === "sender") {
      currencyStore.setSenderCurrency(value);
    } else {
      currencyStore.setRecipientCurrency(value);
    }
  },
});

const selectCurrency = (currency) => {
  selectedCurrency.value = currency;
  emit("updateCurrency", currency);
};
</script>

<style scoped>
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
  border-radius: var(--size-24);
  box-shadow: 0 0 40px rgba(69, 71, 69, 0.2);
  padding: var(--size-32);
}

.dropdown-menu.open {
  display: block;
}

@media (max-width: 768px) {
  .dropdown-menu:not(.open) {
    transform: scaleX(0);
    transform-origin: bottom;
  }

  .dropdown-menu.open {
    transform: scaleX(1);
    transform-origin: bottom;
    transition: transform 0.5s ease;
    width: 100%;
    height: 80%;
    /* position: fixed;
    top: 0; */
    border-radius: 0px;
    animation: listSlideOver 0.15s ease-out forwards;
  }

  @keyframes listSlideOver {
    0% {
      transform: translateY(100vw);
    }

    to {
      transform: translateX(0);
    }
  }
}
</style>
