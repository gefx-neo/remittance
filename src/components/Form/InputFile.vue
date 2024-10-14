<template>
  <div class="form-group">
    <label :for="id">{{ label }}</label>
    <input
      :id="id"
      type="file"
      :multiple="multiple"
      @change="handleFileChange"
    />
    <span v-if="error" class="error">{{ error }}</span>
  </div>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  error: String,
});

const emit = defineEmits(["update:files"]);

// Handle file selection
const handleFileChange = (event) => {
  const files = Array.from(event.target.files);
  emit("update:files", files);
};
</script>

<style scoped>
.file-list p {
  margin: 0;
  padding: 0;
  font-size: 14px;
}

.error {
  color: red;
  font-size: 12px;
}
</style>
