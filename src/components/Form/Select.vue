<template>
  <div class="form-group">
    <div class="label">
      <label :for="id">{{ label }}</label>
      <Tooltip
        v-if="tooltip"
        :text="tooltipText"
        :customClass="tooltipCustomClass"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path
            d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"
          />
        </svg>
      </Tooltip>
    </div>
    <div class="select-item">
      <select :id="id" :value="selectedOption" @change="updateValue">
        <option disabled value="" selected>Select an option</option>

        <option
          v-for="(option, index) in options"
          :key="index"
          :value="option[submitKey]"
        >
          {{ option.name }}
        </option>
      </select>
      <font-awesome-icon :icon="['fa', 'chevron-down']" />
    </div>
    <span v-if="error" class="error">{{ error }}</span>
  </div>
</template>

<script setup>
import { computed } from "vue";
import Tooltip from "@/components/Tooltip.vue";

const props = defineProps({
  label: String,
  id: String,
  modelValue: [String, Number],
  options: Array, // Array of objects: { id, name, value }
  error: String,
  submitKey: {
    type: String,
    default: "value", // Default to emitting the 'value'
    validator: (key) => ["id", "value"].includes(key),
  },
  tooltip: Boolean,
  tooltipText: String,
  tooltipCustomClass: String,
});

const emit = defineEmits(["update:modelValue"]);

// Compute the currently selected option based on modelValue
const selectedOption = computed(() => {
  const matchedOption = props.options.find(
    (option) => option[props.submitKey] === props.modelValue
  );
  return matchedOption ? matchedOption[props.submitKey] : "";
});

// Emit the selected key (id or value) based on the submitKey prop
const updateValue = (event) => {
  const selectedValue = event.target.value;

  // Find the selected option in the options array
  const matchedOption = props.options.find(
    (option) => option[props.submitKey].toString() === selectedValue
  );

  // Emit the selected key's value
  emit(
    "update:modelValue",
    matchedOption ? matchedOption[props.submitKey] : selectedValue
  );
};
</script>

<style scoped>
.label {
  display: flex;
  align-items: center;
  gap: var(--size-6);
}

.label .tooltip {
  margin-bottom: var(--size-4);
}

.label .tooltip svg {
  min-width: var(--size-16);
  max-width: var(--size-16);
  min-height: var(--size-16);
  max-height: var(--size-16);
  fill: var(--grey);
}
</style>
