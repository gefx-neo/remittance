<template>
  <div class="form-group">
    <label :for="id">{{ label }}</label>
    <div class="select-item">
      <select :id="id" :value="selectedOption" @change="updateValue">
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
