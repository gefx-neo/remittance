<template>
  <div class="form-group" ref="dropdownContainer">
    <label :for="id">{{ label }}</label>
    <div class="input-group">
      <div class="phone-item">
        <div class="dropdown">
          <button @click="toggleDropdown" :class="{ open: isDropdownOpen }">
            <!-- Display the name of the selected country -->
            <span>{{ selectedCountryName }}</span>
            <font-awesome-icon :icon="['fa', 'chevron-down']" />
          </button>
          <CountryDropdown
            :isDropdownOpen="isDropdownOpen"
            :selectedCountry="selectedCountry"
            :countries="countries"
            @updateCountry="updateCountry"
            @closeDropdown="isDropdownOpen = false"
          />
        </div>
      </div>
    </div>
    <!-- Error message display -->
    <span v-if="error" class="error">{{ error }}</span>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import CountryDropdown from "@/components/CountryDropdown.vue";
import { countries } from "@/data/data"; // Static country data

const props = defineProps({
  label: String,
  id: String,
  modelValue: String, // Phone number (not used in your example, but kept here if needed)
  modelCountry: String, // Country value (code) for submission
  error: String, // Error message passed from the parent component
});

const emit = defineEmits(["update:modelCountry"]);

// Local state for managing dropdown and selected country
const isDropdownOpen = ref(false);

const selectedCountry = ref(
  props.modelCountry ||
    countries.find((country) => country.name === "Singapore").value
);

// Ref for the dropdown container to check clicks outside
const dropdownContainer = ref(null);

// Toggle dropdown state
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// Computed property to get the selected country name
const selectedCountryName = computed(() => {
  const country = countries.find(
    (country) => country.value === selectedCountry.value
  );
  return country ? country.name : "";
});

// Update country code and emit the new value to the parent
const updateCountry = (countryValue) => {
  selectedCountry.value = countryValue;
  emit("update:modelCountry", countryValue); // Emit the selected country
  isDropdownOpen.value = false; // Close the dropdown after selection
};

// Watch for changes in the passed country prop and update the local state
watch(
  () => props.modelCountry,
  (newCountryValue) => {
    if (newCountryValue) {
      selectedCountry.value = newCountryValue;
    }
  }
);

// Handle click outside the dropdown
const handleClickOutside = (event) => {
  if (
    dropdownContainer.value &&
    !dropdownContainer.value.contains(event.target)
  ) {
    isDropdownOpen.value = false;
  }
};

// Add event listener for click outside
onMounted(() => {
  if (!props.modelCountry) {
    emit("update:modelCountry", selectedCountry.value); // Emit the default country value
  }
  document.addEventListener("click", handleClickOutside);
});

// Remove event listener when component is destroyed
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
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
