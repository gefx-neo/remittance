<template>
  <div class="form-group">
    <label :for="id">{{ label }}</label>
    <div class="select-item">
      <select :id="id" :value="modelValue" @change="updateValue">
        <option
          v-for="(option, index) in options"
          :key="index"
          :value="option.value"
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
const props = defineProps({
  label: String,
  id: String,
  modelValue: [String, Number],
  options: Array, // { name: 'Option Name', value: 'optionValue' }
  error: String,
});

const emit = defineEmits(["update:modelValue"]);

// Emit selected value to parent on change
// Emit selected value to parent on change
const updateValue = (event) => {
  const selectedValue = event.target.value;
  // Check if the selected value exists in the options and convert it accordingly
  const matchedOption = props.options.find(
    (option) => option.value.toString() === selectedValue
  );

  // Emit the value as its original type
  emit(
    "update:modelValue",
    matchedOption ? matchedOption.value : selectedValue
  );
};
</script>
