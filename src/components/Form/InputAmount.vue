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
            :class="{ open: isDropdownOpen, disabled: props.disableDropdown }"
            :disabled="props.disableDropdown"
          >
            <img :src="getCurrencyImagePath(selectedCurrency)" />
            <span>{{ selectedCurrency }}</span>
            <font-awesome-icon
              :icon="['fa', 'chevron-down']"
              v-if="!props.disableDropdown"
            />
          </button>
          <CurrencyDropdown
            :isDropdownOpen="isDropdownOpen"
            :selectedCurrency="selectedCurrency"
            :currencies="currencies"
            @updateCurrency="updateCurrency"
            @closeDropdown="isDropdownOpen = false"
            customClass="transaction"
          />
        </div>
      </div>
    </div>
    <span v-if="error" class="error">{{ error }}</span>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
  watchEffect,
} from "vue";
import CurrencyDropdown from "@/components/Dropdown/CurrencyDropdown.vue";
import { sendingCurrencies, receivingCurrencies } from "@/data/data";
import { useStore } from "@/stores/store";
import { useAlertStore } from "@/stores/index.js";
import { getCurrencyImagePath } from "@/utils/beneficiaryUtils";

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
  disableDropdown: {
    type: [String, Boolean], // Accept both String and Boolean
    default: false, // Default value if none is provided
  },
});

const emit = defineEmits(["update:modelValue", "update:modelCurrency"]);
const store = useStore();
const alertStore = useAlertStore();

const isDropdownOpen = ref(false);
const selectedCurrency = ref(props.modelCurrency || "");
const dropdownContainer = ref(null);

const toggleDropdown = () => {
  if (props.disableDropdown) {
    return;
  }
  isDropdownOpen.value = !isDropdownOpen.value;
};

const currencies = computed(() =>
  props.isSending ? sendingCurrencies : receivingCurrencies
);

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

  // Remove leading zeros unless it's "0" or "0."
  if (/^0[0-9]/.test(inputValue)) {
    inputValue = inputValue.replace(/^0+/, "");
  }

  // Ensure only one decimal point
  const parts = inputValue.split(".");
  if (parts.length > 2) {
    inputValue = parts[0] + "." + parts.slice(1).join("");
  }

  // Debug: Show the value being entered
  // console.log("User Input (raw):", inputValue);

  // Update the input field value
  formattedValue.value = inputValue;

  // Cancel previous debounce
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value);
  }

  debounceTimeout.value = setTimeout(() => {
    if (formattedValue.value !== "") {
      const rawValue = parseFloat(formattedValue.value.replace(/,/g, "")) || 0;

      // Debug: Show the parsed numeric value being emitted
      // console.log("Emitted Value (numeric):", rawValue);

      emit("update:modelValue", rawValue); // Emit numeric value
      formattedValue.value = formatNumber(rawValue); // Update display value
    } else {
      emit("update:modelValue", 0); // Emit 0 for cleared input
    }
  }, 1000);
};

const onBlur = () => {
  const rawValue = parseFloat(formattedValue.value.replace(/,/g, "")) || 0;

  // Debug: Show the value being emitted on blur
  // console.log("Blur Event Emitted Value (numeric):", rawValue);

  formattedValue.value = formatNumber(rawValue); // Update with formatted value
  emit("update:modelValue", rawValue); // Emit numeric value
};

const preventInvalidCharacters = (event) => {
  const invalidCharacters = /[^0-9.,]/; // Regex for invalid characters
  if (invalidCharacters.test(event.key)) {
    event.preventDefault(); // Prevent the invalid character from being typed
  }
};

watch(
  () => props.modelValue,
  (newValue) => {
    formattedValue.value = formatNumber(newValue); // Update local formattedValue
  },
  { immediate: true } // Ensure it runs on component initialization
);

// watch(
//   () => store.isMoneyLoading,
//   (isMoneyLoading) => {
//     if (isMoneyLoading) {
//       alertStore.alert("loading");
//     } else {
//       // Clear all alerts once loading is done
//       alertStore.alerts = alertStore.alerts.filter(
//         (alert) => alert.type !== "loading"
//       );
//     }
//   },
//   { immediate: true } // Ensures the watcher reacts immediately on mount
// );

watch(
  () => props.modelCurrency,
  (newCurrency) => {},
  { immediate: true }
);

watchEffect(() => {
  selectedCurrency.value = props.modelCurrency || "";
});

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
.input-item {
  position: relative;
  width: 100%;
}

.form-group {
  display: flex;
  margin-bottom: var(--size-24);
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
  gap: var(--size-6);
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
</style>
