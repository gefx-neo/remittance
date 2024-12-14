<template>
  <div class="form-group">
    <label :for="id">{{ label }}</label>
    <textarea :id="id" :value="modelValue" @input="updateValue"></textarea>
    <span v-if="error" class="error">{{ error }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  label: String,
  id: String,
  type: {
    type: String,
    default: "text",
  },
  modelValue: String,
  error: String,
});

const emit = defineEmits(["update:modelValue"]);

// Emit value update for v-model
const updateValue = (event) => {
  emit("update:modelValue", event.target.value);
};
</script>

<style scoped>
textarea {
  width: 100%;
  resize: vertical;
  box-sizing: border-box;
}
</style>
