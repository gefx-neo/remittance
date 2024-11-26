<template>
  <div
    class="form-group"
    ref="dropdownContainer"
    :class="{ dashboard: isDashboard }"
  >
    <label :for="id">{{ label }}</label>
    <div class="input-group">
      <div class="input-item">
        <input
          type="text"
          :id="id"
          v-model="formattedValue"
          @blur="onBlur"
          @input="onInput"
          @keypress="preventInvalidCharacters"
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import CurrencyDropdown from "@/components/Dropdown/CurrencyDropdown.vue";
import { sendingCurrencies, receivingCurrencies } from "@/data/data";
import { useStore } from "@/stores/useStore";
import { useAlertStore } from "@/stores/alertStore";

const props = defineProps({
  label: String,
  id: String,
  modelValue: {
    type: [Number, String],
    required: true,
  },
  modelCurrency: String,
  error: String,
  isSending: Boolean,
  isDashboard: Boolean,
});

const emit = defineEmits(["update:modelValue", "update:modelCurrency"]);
const store = useStore();
const alertStore = useAlertStore();

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

const updateCurrency = (currencyCode) => {
  selectedCurrency.value = currencyCode;
  emit("update:modelCurrency", currencyCode);
  isDropdownOpen.value = false;
};

const handleClickOutside = (event) => {
  if (
    dropdownContainer.value &&
    !dropdownContainer.value.contains(event.target)
  ) {
    isDropdownOpen.value = false;
  }
};

const formatNumber = (value) => {
  const number = parseFloat(value);
  if (isNaN(number)) return "";
  return number % 1 === 0
    ? number.toLocaleString(undefined) // Add commas for integers
    : number.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }); // Add commas for decimals
};

const formattedValue = ref(formatNumber(props.modelValue));
const debounceTimeout = ref(null);

const onInput = (event) => {
  const inputElement = event.target;

  let inputValue = inputElement.value;

  // Ensure only one decimal point
  const parts = inputValue.split(".");
  if (parts.length > 2) {
    inputValue = parts[0] + "." + parts.slice(1).join("");
  }

  // Update the input field value
  formattedValue.value = inputValue;

  // Cancel previous debounce
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value);
  }

  // Trigger formatting after a delay
  debounceTimeout.value = setTimeout(() => {
    if (formattedValue.value !== "") {
      const rawValue = parseFloat(formattedValue.value.replace(/,/g, "")) || 0;
      const formatted = formatNumber(rawValue);

      formattedValue.value = formatted; // Update display value with commas
      emit("update:modelValue", rawValue); // Emit raw numeric value
    } else {
      // Handle the case where the input is cleared
      emit("update:modelValue", null); // Emit null or 0 depending on your requirements
    }

    // Remove focus from the input and set loading to false
    inputElement.blur();
  }, 1000);
};

const onBlur = () => {
  // Ensure formatting and emit on blur
  const rawValue = parseFloat(formattedValue.value.replace(/,/g, ""));
  const formatted = formatNumber(rawValue);

  formattedValue.value = formatted; // Update the input with the formatted value
  emit("update:modelValue", rawValue); // Emit raw numeric value
};

const preventInvalidCharacters = (event) => {
  const invalidCharacters = /[^0-9.,]/; // Regex for invalid characters
  if (invalidCharacters.test(event.key)) {
    event.preventDefault(); // Prevent the invalid character from being typed
  }
};

watch(
  () => store.isLoading,
  (isLoading) => {
    if (isLoading) {
      alertStore.alert("loading");
    } else {
      // Clear all alerts once loading is done
      alertStore.alerts = alertStore.alerts.filter(
        (alert) => alert.type !== "loading"
      );
    }
  },
  { immediate: true } // Ensures the watcher reacts immediately on mount
);

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);

  // Clear any pending debounce
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value);
  }
});
</script>

<style scoped>
@import "@/assets/dashboard.css";

.input-item {
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

.form-group .input-item {
  position: relative;
  width: 100%;
}

.form-group .input-item button {
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

.form-group .input-item button img {
  min-width: var(--size-24);
  max-width: var(--size-24);
  min-height: var(--size-24);
  max-height: var(--size-24);
}

.form-group .input-item button span {
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

.dashboard .input-item button span {
  font-size: var(--text-xl) !important;
}
</style>
