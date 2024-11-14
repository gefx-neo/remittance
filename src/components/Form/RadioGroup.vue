<template>
  <div class="form-group">
    <label>{{ label }}</label>
    <div class="radio-group">
      <div v-for="(option, index) in options" :key="index" class="item">
        <input
          type="radio"
          :id="option.value"
          :value="option.value"
          :checked="modelValue === option.value"
          @change="updateValue"
        />
        <label :for="option.value">{{ option.name }}</label>
      </div>
    </div>
    <span v-if="error" class="error">{{ error }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  label: String,
  modelValue: [String, Number], // The value that indicates the selected radio
  options: Array, // { name: 'Option Name', value: 'optionValue' }
  error: String,
});

const emit = defineEmits(["update:modelValue"]);

// Emit selected value to parent on change

// Emit selected value to parent on change
const updateValue = (event) => {
  const selectedValue = event.target.value;
  // Find the matching option to preserve the original type
  const matchedOption = props.options.find(
    (option) => option.value.toString() === selectedValue
  );

  // Emit the value with its original type
  emit(
    "update:modelValue",
    matchedOption ? matchedOption.value : selectedValue
  );
};
</script>

<style scoped>
.radio-group {
  display: flex;
  gap: var(--size-24);
  margin-top: var(--size-4);
}

.radio-group .item {
  display: flex;
  align-items: center;
  gap: var(--size-8);
}

.radio-group .item label {
  margin-bottom: 0;
  cursor: pointer;
}
</style>
