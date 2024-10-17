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
            <!-- Display the name of the selected country -->
            <span>
              {{ selectedCountryName }}
            </span>
            <font-awesome-icon :icon="['fa', 'chevron-down']" />
          </button>
          <CountryDropdown
            :isDropdownOpen="countryStore.isDropdownOpen"
            @updateCountry="updateCountry"
          />
        </div>
      </div>
    </div>
    <!-- Error message display -->
    <span v-if="error" class="error">{{ error }}</span>
  </div>
</template>

<script setup>
import { computed, watch } from "vue";
import { useCountryStore } from "@/stores/countryStore";
import CountryDropdown from "@/components/CountryDropdown.vue";

const props = defineProps({
  label: String,
  id: String,
  modelValue: String, // Phone number
  country: String, // Country value (code) for submission
  error: String, // Error message passed from the parent component
});

const emit = defineEmits(["update:country"]);

// Access country store for managing country data
const countryStore = useCountryStore();

// Computed property to get the selected country name from the store
const selectedCountryName = computed(() => {
  const selectedCountry = countryStore.countries.find(
    (country) => country.value === countryStore.selectedCountry
  );
  return selectedCountry ? selectedCountry.name : ""; // Return country name or empty string if not found
});

// Update country code and emit it for form submission
const updateCountry = (countryValue) => {
  countryStore.setSelectedCountry(countryValue);
  emit("update:country", countryValue); // Emit the country value (for submission)
};

// Watch for changes in the passed country prop and update the countryStore
watch(
  () => props.country,
  (newCountryValue) => {
    countryStore.setSelectedCountry(newCountryValue); // Update the selected country value
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
  border: 1px solid var(--cool-blue);
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
