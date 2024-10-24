<template>
  <div class="form-group">
    <label :for="id">{{ label }}</label>
    <input
      class="file-input"
      :id="id"
      type="file"
      :multiple="multiple"
      accept=".jpg, .png, .pdf, .doc, .docx, .xls, .xlsx"
      @change="handleFileChange"
    />
    <div class="file-upload">
      <button type="button" @click="triggerFileInput">Choose File</button>
      <span v-if="files.length">
        {{ files.map((file) => file.name).join(", ") }}
      </span>
      <span v-else
        >No files chosen (accepts .jpg, .png, .pdf, .doc, .xls format)</span
      >
    </div>
    <span v-if="error" class="error">{{ error }}</span>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  label: String,
  id: String,
  multiple: Boolean,
  error: String,
  modelValue: [Array, Object],
});

const emit = defineEmits(["update:modelValue"]);
const files = ref([]);

// Handle file selection
const handleFileChange = (event) => {
  const selectedFiles = Array.from(event.target.files);
  files.value = selectedFiles;
  emit("update:modelValue", files.value); // Emit the selected file(s) to the parent
};

// Trigger file input click
const triggerFileInput = () => {
  document.getElementById(props.id).click();
};

// Watch for changes in modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    files.value = newValue ? [...newValue] : [];
  },
  { immediate: true } // Ensure it runs on initial load
);
</script>

<style scoped>
.file-input {
  display: none;
}
.file-upload {
  display: flex;
  align-items: center;
}
.file-upload span {
  font-size: var(--text-sm);
  color: var(--grey);
}
.file-upload button {
  background: var(--light-grey);
  border: none;
  border-radius: var(--border-md);
  padding: var(--size-dropdown-item);
  margin-right: var(--size-8);
  cursor: pointer;
}
</style>
