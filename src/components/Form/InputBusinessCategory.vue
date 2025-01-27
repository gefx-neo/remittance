<template>
  <div class="form-group" ref="dropdownContainer">
    <label :for="id">{{ label }}</label>
    <div class="input-group">
      <div class="category-item">
        <div class="dropdown">
          <button
            type="button"
            @click="toggleDropdown"
            :class="{ open: isDropdownOpen }"
          >
            <span>{{ selectedCategoryName }}</span>
            <font-awesome-icon :icon="['fa', 'chevron-down']" />
          </button>
          <BusinessCategoryDropdown
            :isDropdownOpen="isDropdownOpen"
            :selectedCategory="selectedCategory"
            :businessCategories="businessCategories"
            @updateCategory="updateCategory"
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
import BusinessCategoryDropdown from "@/components/Dropdown/BusinessCategoryDropdown.vue";
import { businessCategories } from "@/data/data"; // Business categories data import

// Props
const props = defineProps({
  label: String,
  id: String,
  modelCategory: [String, Number], // Accepts both String and Number types
  error: String,
});

// Emits for v-model binding
const emit = defineEmits(["update:modelCategory"]);

const isDropdownOpen = ref(false);
const selectedCategory = ref(props.modelCategory || "");

// Ref for dropdown container to manage click outside
const dropdownContainer = ref(null);

// Toggle dropdown state
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// Computed property to get the selected category name based on the ID
const selectedCategoryName = computed(() => {
  for (const category of businessCategories) {
    const subCategory = category.subcategories.find(
      (sub) => sub.id === selectedCategory.value
    );
    if (subCategory) return subCategory.name;
  }
  return "Select a category"; // Fallback label if none is selected
});

// Update selected category and emit to parent for v-model support
const updateCategory = (categoryValue) => {
  selectedCategory.value = categoryValue;
  emit("update:modelCategory", categoryValue);
  isDropdownOpen.value = false;
};

// Watch for changes in `modelCategory` and update `selectedCategory` locally
watch(
  () => props.modelCategory,
  (newCategoryValue) => {
    selectedCategory.value = newCategoryValue;
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

onMounted(() => {
  if (!props.modelCategory) {
    emit("update:modelCategory", selectedCategory.value); // Emit initial value
  }
  document.addEventListener("click", handleClickOutside);
});

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
