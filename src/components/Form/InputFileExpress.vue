<template>
  <div class="form-group">
    <label :for="id">{{ label }}</label>
    <input
      type="file"
      :id="id"
      @change="onFileSelected"
      :multiple="allowMultiple"
    />
    <span v-if="error" class="error">{{ error }}</span>

    <div v-if="uploadSuccess">File uploaded successfully!</div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

// Props definition
const props = defineProps({
  label: String,
  id: String,
  error: String,
  allowMultiple: {
    type: Boolean,
    default: false, // Default to single file upload
  },
});

// Emit event definition
const emit = defineEmits(["fileUploaded"]);

const selectedFiles = ref([]); // Holds selected files (single or multiple)
const uploadSuccess = ref(false); // Success indicator

// Handle file selection
const onFileSelected = (event) => {
  if (props.allowMultiple) {
    selectedFiles.value = [...event.target.files]; // Store multiple files
  } else {
    selectedFiles.value = [event.target.files[0]]; // Store a single file
  }

  if (selectedFiles.value.length > 0) {
    uploadFiles(); // Automatically call upload when file(s) are selected
  }
};

// Upload files using Axios
const uploadFiles = async () => {
  const formData = new FormData();

  // Append each file to the FormData object
  selectedFiles.value.forEach((file) => {
    formData.append("files", file); // 'files' key for multiple files
  });

  try {
    const response = await axios.post(
      "http://localhost:3000/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status === 200) {
      uploadSuccess.value = true;
      emit("fileUploaded", response.data); // Emit the event with uploaded file(s) data
    }
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};
</script>
