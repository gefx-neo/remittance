<template>
  <div class="form-group">
    <label :for="id">{{ label }}</label>
    <div class="input-group">
      <div class="phone-item">
        <div class="dropdown">
          <button
            @click="countryStore.toggleDropdown"
            :class="{ open: countryStore.isDropdownOpen }"
          >
            <span>
              {{
                countryStore.selectedCode.startsWith("+")
                  ? countryStore.selectedCode
                  : `+${countryStore.selectedCode}`
              }}
            </span>
            <font-awesome-icon :icon="['fa', 'chevron-down']" />
          </button>
          <PhoneDropdown
            :isDropdownOpen="countryStore.isDropdownOpen"
            @updateTelCode="updateCountryCode"
          />
        </div>
        <input
          type="text"
          :id="id"
          v-model="phoneNumber"
          @input="emitPhoneNumber"
        />
      </div>
    </div>
    <!-- Error message display -->
    <span v-if="error" class="error">{{ error }}</span>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useCountryStore } from "@/stores/countryStore";
import PhoneDropdown from "@/components/PhoneDropdown.vue";

const props = defineProps({
  label: String,
  id: String,
  modelValue: String, // Phone number
  countryCode: String, // Country code
  error: String, // Error message passed from the parent component
});

const emit = defineEmits(["update:modelValue", "update:countryCode"]);

// Access country store for managing country code
const countryStore = useCountryStore();

// Ref for phone number input
const phoneNumber = ref(props.modelValue);

// Emit phone number separately
const emitPhoneNumber = () => {
  emit("update:modelValue", phoneNumber.value); // Emit only the phone number
};

// Update country code separately
const updateCountryCode = (code) => {
  countryStore.setSelectedCode(code);
  emit("update:countryCode", code); // Emit only the country code
};

// Watch for changes in modelValue (phone number) to update phoneNumber ref
watch(
  () => props.modelValue,
  (newValue) => {
    phoneNumber.value = newValue;
  }
);

// Watch for changes in countryCode to update the country store
watch(
  () => props.countryCode,
  (newCode) => {
    countryStore.setSelectedCode(newCode); // Update the country code
  }
);
</script>

<style scoped>
.input-group {
  position: relative;
  width: 100%;
}

.phone-item {
  display: flex;
  align-items: center;
  gap: var(--size-12);
}

.dropdown {
  width: 30%;
}

.dropdown button {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  min-height: var(--size-48);
  max-height: var(--size-48);
  padding: var(--size-dropdown-item);
  border: 1px solid var(--cool-blue);
  border-radius: var(--border-md);
}

.dropdown button:hover {
  box-shadow: inset 0 0 0 2px var(--cool-blue);
}

.dropdown button.open {
  box-shadow: inset 0 0 0 3px var(--slate-blue);
}

.dropdown button span {
  font-weight: var(--semi-bold);
}

.dropdown button svg {
  position: absolute;
  right: var(--size-12);
  min-width: var(--size-12);
  max-width: var(--size-12);
  min-height: var(--size-12);
  max-height: var (--size-12);
  color: var(--cool-blue);
}

.dropdown button.open svg {
  color: var(--slate-blue);
  transition: color 0.3s ease-in-out;
}

.phone-item input {
  width: 70%;
}
</style>
