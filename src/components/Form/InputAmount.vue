<template>
  <div
    class="form-group"
    ref="dropdownContainer"
    :class="{ dashboard: isDashboard }"
  >
    <label :for="id">{{ label }}</label>
    <div class="input-group">
      <input
        type="text"
        :id="id"
        :value="formattedAmount"
        @input="handleInput"
        @blur="handleBlur"
      />
      <div class="dropdown">
        <button
          type="button"
          @click="toggleDropdown"
          :class="{ open: isDropdownOpen }"
        >
          <img :src="selectedCurrencyIcon" alt="currency-icon" />
          <span>{{ selectedCurrency }}</span>
          <font-awesome-icon :icon="['fa', 'chevron-down']" />
        </button>
        <CurrencyDropdown
          :isDropdownOpen="isDropdownOpen"
          :selectedCurrency="selectedCurrency"
          :currencies="currencies"
          @updateCurrency="updateCurrency"
          @closeDropdown="isDropdownOpen = false"
        />
      </div>
    </div>
    <span v-if="error" class="error">{{ error }}</span>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import CurrencyDropdown from "@/components/Dropdown/CurrencyDropdown.vue";
import { sendingCurrencies, receivingCurrencies } from "@/data/data";

const props = defineProps({
  label: String,
  id: String,
  modelValue: {
    type: [Number, String],
    required: true,
  },
  modelCurrency: String,
  error: String,
  isSending: Boolean, // Determines if sendingCurrencies or receivingCurrencies is used
  isDashboard: Boolean,
});

const emit = defineEmits(["update:modelValue", "update:modelCurrency"]);

const isDropdownOpen = ref(false);
const selectedCurrency = ref(props.modelCurrency || "");
const dropdownContainer = ref(null);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const currencies = computed(() =>
  props.isSending ? sendingCurrencies : receivingCurrencies
);

const selectedCurrencyIcon = computed(() => {
  const currency = currencies.value.find(
    (currency) => currency.code === selectedCurrency.value
  );
  return currency ? currency.icon : "";
});

// Computed property for formatted amount
const formattedAmount = computed({
  get() {
    return formatAmount(props.modelValue);
  },
  set(value) {
    const numericValue = parseFloat(value.replace(/,/g, ""));
    emit("update:modelValue", isNaN(numericValue) ? 0 : numericValue);
  },
});

const handleInput = (event) => {
  let inputValue = event.target.value.replace(/[^0-9.,]/g, "");
  const decimalParts = inputValue.split(".");

  if (decimalParts.length > 2) {
    inputValue = decimalParts[0] + "." + decimalParts.slice(1).join("");
  }

  formattedAmount.value = inputValue; // Triggers the `set` in computed
};

const handleBlur = () => {
  formattedAmount.value = formatAmount(props.modelValue);
};

const formatAmount = (value) => {
  if (!value) return "";

  // Split the value into integer and decimal parts
  const [integer, decimal] = parseFloat(value).toFixed(2).split(".");

  return decimal === "00"
    ? parseInt(integer, 10).toLocaleString()
    : parseInt(integer, 10).toLocaleString() + "." + decimal;
};

const updateCurrency = (currencyCode) => {
  selectedCurrency.value = currencyCode;
  emit("update:modelCurrency", currencyCode);
  isDropdownOpen.value = false;
};

watch(
  () => props.modelCurrency,
  (newCurrency) => {
    if (newCurrency) {
      selectedCurrency.value = newCurrency;
    }
  }
);

watch(
  () => props.modelValue,
  (newVal) => {
    formattedAmount.value = formatAmount(newVal); // Update display
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
@import "@/assets/dashboard.css";

.input-group {
  position: relative;
  width: 100%;
}

.form-group {
  display: flex;
}

.form-group input {
  width: 100%;
  font-size: var(--text-lg);
  color: var(--slate-blue);
  font-weight: var(--semi-bold);
  padding-right: 118px;
  letter-spacing: 0.3px;
}

.form-group .input-group {
  position: relative;
  width: 100%;
}

.form-group .input-group button {
  display: flex;
  align-items: center;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  gap: 6px;
  padding: 0;
  padding-right: var(--size-16);
  color: var(--slate-blue);
  cursor: pointer;
}

.form-group .input-group button img {
  min-width: var(--size-24);
  max-width: var(--size-24);
  min-height: var(--size-24);
  max-height: var(--size-24);
}

.form-group .input-group button span {
  font-size: var(--text-lg);
  font-weight: var(--semi-bold);
  letter-spacing: 0.1px;
}

.dropdown {
  width: 100%;
}

.dropdown button svg {
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

.dashboard input {
  min-height: var(--size-56);
  max-height: var(--size-56);
  font-size: var(--text-xl) !important;
}

.dashboard .input-group button span {
  font-size: var(--text-xl) !important;
}
</style>
