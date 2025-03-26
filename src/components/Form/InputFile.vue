<template>
  <div class="form-group">
    <div class="file-label">
      <label :for="id">{{ label }}</label>
      <Tooltip
        v-if="tooltip"
        :text="tooltipText"
        :isLongTooltip="isLongTooltip"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path
            d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"
          />
        </svg>
      </Tooltip>
    </div>

    <input
      class="file-input"
      :id="id"
      type="file"
      :multiple="multiple"
      accept=".jpg, .png, .pdf, .doc, .docx, .xls, .xlsx"
      @change="handleFileChange"
    />
    <div class="file-upload">
      <button type="button" @click="triggerFileInput">Upload file</button>
      <span v-if="files.length">
        {{ files.map((file) => file.name).join(", ") }}
      </span>
      <span v-else>JPG, PNG, PDF, DOC, DOCX, XLS, XLSX (Max: 5MB)</span>
    </div>
    <span v-if="error" class="error">{{ error }}</span>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import Tooltip from "@/components/Tooltip.vue";

const props = defineProps({
  label: String,
  id: String,
  multiple: Boolean,
  error: String,
  tooltip: Boolean,
  tooltipText: String,
  isLongTooltip: {
    type: Boolean,
    default: false,
  },
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
.file-label {
  display: flex;
  align-items: center;
  gap: var(--size-8);
}

.file-label .tooltip {
  margin-bottom: var(--size-4);
}

.file-label .tooltip svg {
  min-width: var(--size-16);
  max-width: var(--size-16);
  min-height: var(--size-16);
  max-height: var(--size-16);
  fill: var(--grey);
}

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
  font-weight: var(--semi-bold);
  white-space: nowrap;
  cursor: pointer;
}
</style>
