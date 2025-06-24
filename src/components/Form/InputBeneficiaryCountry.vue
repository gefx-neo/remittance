<template>
  <div class="form-group" ref="dropdownContainer">
    <label :for="id">{{ label }}</label>
    <div class="input-group">
      <div class="phone-item">
        <div class="dropdown">
          <button
            type="button"
            @click="toggleDropdown"
            :class="{ open: isDropdownOpen }"
          >
            <!-- Display the name of the selected country -->
            <span>{{ selectedCountryName }}</span>
            <font-awesome-icon :icon="['fa', 'chevron-down']" />
          </button>
          <BeneficiaryCountryDropdown
            v-if="isDropdownOpen"
            :isDropdownOpen="isDropdownOpen"
            :selectedCountry="selectedCountry"
            :countries="beneficiaryCountries"
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
import BeneficiaryCountryDropdown from "@/components/Dropdown/BeneficiaryCountryDropdown.vue";
import { beneficiaryCountries } from "@/data/data"; // Static country data

const props = defineProps({
  label: String,
  id: String,
  modelValue: [String, Number], // Accept both String and Number for flexibility
  error: String, // Error message passed from the parent component
});

const emit = defineEmits(["update:modelValue"]);

// Local state for managing dropdown and selected country
const isDropdownOpen = ref(false);

const selectedCountry = ref(props.modelValue || null);

// Ref for the dropdown container to check clicks outside
const dropdownContainer = ref(null);

// Toggle dropdown state
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// Computed property to get the selected country name
const selectedCountryName = computed(() => {
  const country = beneficiaryCountries.find(
    (country) => country.id === selectedCountry.value
  );
  return country ? country.name : "Select a country"; // Default text when no country is selected
});

// Update country ID as an integer and emit it to the parent

const updateCountry = (countryId) => {
  selectedCountry.value = countryId; // No parsing, directly set the value
  emit("update:modelValue", countryId); // Emit the ID as is
  isDropdownOpen.value = false; // Close the dropdown after selection
};

// Watch for changes in the passed country prop and update the local state
watch(
  () => props.modelValue,
  (newCountryId) => {
    if (newCountryId) {
      selectedCountry.value = parseInt(newCountryId, 10); // Ensure it is an integer
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
