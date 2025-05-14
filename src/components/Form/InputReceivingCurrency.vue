<template>
  <div class="form-group" ref="dropdownContainer">
    <label :for="id">{{ label }}</label>
    <div class="input-group">
      <div class="currency-item">
        <div class="dropdown">
          <button
            type="button"
            @click="toggleDropdown"
            :class="{ open: isDropdownOpen }"
          >
            <img :src="getCurrencyImagePath(selectedCurrency)" />
            <span>{{ selectedCurrency }} - {{ selectedCurrencyName }}</span>
            <font-awesome-icon :icon="['fa', 'chevron-down']" />
          </button>
          <CurrencyDropdown
            :isDropdownOpen="isDropdownOpen"
            :selectedCurrency="selectedCurrency"
            :currencies="receivingCurrencies"
            @updateCurrency="updateCurrency"
            @closeDropdown="isDropdownOpen = false"
          />
        </div>
      </div>
    </div>
    <span v-if="error" class="error">{{ error }}</span>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import CurrencyDropdown from "@/components/Dropdown/CurrencyDropdown.vue";
import { receivingCurrencies } from "@/data/data";
import { getCurrencyImagePath } from "@/utils/currencyUtils.js";

const props = defineProps({
  label: String,
  id: String,
  modelValue: String,
  modelCurrency: String,
  error: String,
});

const emit = defineEmits(["update:modelCurrency"]);

const isDropdownOpen = ref(false);

const selectedCurrency = ref(
  props.modelCurrency || receivingCurrencies[0].code
);

const dropdownContainer = ref(null);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const selectedCurrencyName = computed(() => {
  const currency = receivingCurrencies.find(
    (currency) => currency.code === selectedCurrency.value
  );
  return currency ? currency.name : "";
});

const updateCurrency = (currencyCode) => {
  selectedCurrency.value = currencyCode;
  emit("update:modelCurrency", currencyCode);
  isDropdownOpen.value = false;
};

watch(
  () => props.modelCurrency,
  (newCurrencyValue) => {
    if (newCurrencyValue) {
      selectedCurrency.value = newCurrencyValue;
    }
  }
);

const handleClickOutside = (event) => {
  if (
    dropdownContainer.value &&
    !dropdownContainer.value.contains(event.target)
  ) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  if (!props.modelCurrency) {
    emit("update:modelCurrency", selectedCurrency.value);
  }
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.form-group {
  width: 100%;
}

.input-group {
  position: relative;
  width: 100%;
}

.form-group button {
  display: flex;
  align-items: center;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  gap: var(--size-8);
  padding: 0;
  padding-right: var(--size-16);
  cursor: pointer;
}

.form-group button img {
  min-width: var(--size-24);
  max-width: var(--size-24);
  min-height: var(--size-24);
  max-height: var(--size-24);
}

/* .form-group button span {
} */

.dropdown {
  width: 100%;
}

.dropdown button {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  min-height: var(--size-48);
  max-height: var(--size-48);
  padding: var(--size-dropdown-item);
  box-shadow: inset 0 0 0 1px var(--cool-blue);
  border-radius: var(--border-md);
}

.dropdown button:hover {
  box-shadow: inset 0 0 0 2px var(--cool-blue);
}

.dropdown button.open {
  box-shadow: inset 0 0 0 3px var(--slate-blue);
}

.dropdown button svg {
  position: absolute;
  top: 50%;
  right: var(--size-8);
  transform: translate(-50%, -50%);
  min-width: var(--size-16);
  max-width: var(--size-16);
  min-height: var(--size-16);
  max-height: var(--size-16);
  color: var(--cool-blue);
  pointer-events: none;
}

.dropdown button.open svg {
  color: var(--slate-blue);
  transition: color 0.3s ease-in-out;
}
</style>
