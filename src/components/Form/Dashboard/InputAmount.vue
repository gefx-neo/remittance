<template>
  <div class="form-group" ref="dropdownContainer">
    <label :for="id">{{ label }}</label>

    <input
      type="text"
      :id="id"
      v-model="formattedValue"
      @blur="onBlur"
      @input="onInput"
      @keypress="preventInvalidCharacters"
    />
  </div>

  <!-- <span v-if="error" class="error">{{ error }}</span> -->
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
import { useStore } from "@/stores/useStore";
import { useAlertStore } from "@/stores/index.js";
import { getCurrencyImagePath } from "@/utils/beneficiaryUtils";

const props = defineProps({
  label: String,
  id: String,
  modelValue: {
    type: [Number, String],
    required: true,
  },
  error: String,
});

const emit = defineEmits(["update:modelValue"]);

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
</script>

<style scoped>
@import "@/assets/dashboard.css";

.form-group {
  display: flex;
  width: 100%;
}

.form-group label {
  font-weight: var(--semi-bold);
}

.form-group input {
  width: 100%;
  font-size: var(--text-lg);
  color: var(--slate-blue);
  font-weight: var(--semi-bold);
  letter-spacing: 0.3px;
}

input {
  min-height: var(--size-56);
  max-height: var(--size-56);
  font-size: var(--text-xl) !important;
}

.input-item button span {
  font-size: var(--text-xl) !important;
}
</style>
