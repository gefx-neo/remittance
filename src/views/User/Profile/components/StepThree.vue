<template>
  <div class="third-form">
    <!-- Corporate Form -->
    <fieldset
      :disabled="store.isLoading"
      v-if="selectedCustomerType === 'Corporate & Trading Company'"
    >
      <InputFile
        label="Account opening form (completed and signed by Authorizing Director)"
        id="docAccOpening"
        v-model="corporateForm.docAccOpening"
        :multiple="true"
        :error="errors.docAccOpening"
        @update:modelValue="(files) => handleFileUpload('docAccOpening', files)"
      />

      <InputFile
        label="Photo ID (Passport and valid Working Pass for non-Singaporean)"
        id="docPhotoID"
        v-model="corporateForm.docPhotoID"
        :multiple="false"
        :error="errors.docPhotoID"
        @update:modelValue="(files) => handleFileUpload('docPhotoID', files)"
      />

      <InputFile
        label="Selfie with Photo ID"
        id="docSelfie"
        v-model="corporateForm.docSelfie"
        :multiple="false"
        :error="errors.docSelfie"
        @update:modelValue="(files) => handleFileUpload('docSelfie', files)"
      />

      <InputFile
        label="Photocopy of Identity Card (or Passport for non-Singaporean) with photograph of Director(s)"
        id="docDirectorIC"
        v-model="corporateForm.docDirectorIC"
        :multiple="false"
        :error="errors.docDirectorIC"
        @update:modelValue="(files) => handleFileUpload('docDirectorIC', files)"
      />

      <InputFile
        label="Company business profile from ACRA (not older than 6 months)"
        id="docAcra"
        v-model="corporateForm.docAcra"
        :multiple="true"
        :error="errors.docAcra"
        @update:modelValue="(files) => handleFileUpload('docAcra', files)"
      />
    </fieldset>

    <!-- Individual Form -->
    <fieldset
      :disabled="store.isLoading"
      v-if="selectedCustomerType === 'Natural Person'"
    >
      <InputFile
        label="Photocopy of IC (or valid Working Pass for non-Singaporean)"
        id="docIC"
        v-model="individualForm.docIC"
        :multiple="false"
        :error="errors.docIC"
        @update:modelValue="(files) => handleFileUpload('docIC', files)"
      />

      <InputFile
        label="Selfie with Photo ID"
        id="docSelfie"
        v-model="individualForm.docSelfie"
        :multiple="false"
        :error="errors.docSelfie"
        @update:modelValue="(files) => handleFileUpload('docSelfie', files)"
      />

      <InputFile
        label="Business / Name card"
        id="docCard"
        v-model="individualForm.docCard"
        :multiple="false"
        :error="errors.docCard"
        @update:modelValue="(files) => handleFileUpload('docCard', files)"
      />

      <!-- <InputFile
        label="Signed KYC form"
        id="docKYC"
        v-model="individualForm.docKYC"
        :multiple="false"
        :error="errors.docKYC"
        @update:modelValue="(files) => handleFileUpload('docKYC', files)"
      /> -->
    </fieldset>

    <div class="footer">
      <ButtonAPI
        :disabled="isLoading"
        type="button"
        class="btn-red standard-button"
        @click="handleSubmit"
      >
        Submit
      </ButtonAPI>
      <button
        type="button"
        @click="handleBack"
        class="btn-back standard-button"
      >
        Back
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useStore } from "@/stores/useStore";
import { useValidation } from "@/composables/useValidation";
import { InputFile, ButtonAPI } from "@/components/Form";
import {
  corporateValidation,
  individualValidation,
} from "./schemas/stepThreeSchema"; // Import validation schema

const props = defineProps({
  corporateForm: Object,
  individualForm: Object,
  selectedCustomerType: String,
  isLoading: Boolean,
});

const emit = defineEmits(["submit"]);
const store = useStore();

// Initialize validation composables
const { errors, validateForm, scrollToErrors } = useValidation();

const selectedCustomerType = ref(props.selectedCustomerType); // Track customer type

// Generic file upload handler
const handleFileUpload = (field, files) => {
  if (selectedCustomerType.value === "Corporate & Trading Company") {
    // Handle multiple files if :multiple="true"
    if (Array.isArray(files)) {
      props.corporateForm[field] = files;
    } else {
      props.corporateForm[field] = [files];
    }
  } else {
    if (Array.isArray(files)) {
      props.individualForm[field] = files;
    } else {
      props.individualForm[field] = [files];
    }
  }
};

// Validate and handle submit
const handleSubmit = () => {
  const form =
    selectedCustomerType.value === "Corporate & Trading Company"
      ? props.corporateForm
      : props.individualForm;

  // Set the correct validation schema based on selectedCustomerType
  const schema =
    selectedCustomerType.value === "Corporate & Trading Company"
      ? corporateValidation(form)
      : individualValidation(form);

  // Validate the form
  const isValid = validateForm(form, schema);
  console.log("Validation Errors:", errors);

  if (isValid) {
    emit("submit");
  } else {
    scrollToErrors();
  }
};

// To avoid resetting selectedCustomerType when navigating back
watch(
  () => props.selectedCustomerType,
  (newVal) => {
    if (!selectedCustomerType.value || selectedCustomerType.value === "") {
      selectedCustomerType.value = newVal;
    }
  },
  { immediate: true }
);

const handleBack = () => {
  emit("prevStep");
};
</script>

<style scoped>
.third-form {
  width: 100%;
  max-width: 500px;
}

.third-form .footer {
  display: flex;
  flex-direction: column;
  gap: var(--size-12);
}

.form-group {
  margin-bottom: var(--size-24);
}
</style>
