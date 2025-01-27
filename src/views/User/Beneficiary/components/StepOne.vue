<template>
  <div class="first-form" @keydown.enter.prevent="handleNext">
    <fieldset>
      <RadioGroup
        label="Beneficiary type"
        v-model="localForm.beneficiaryType"
        :options="beneficiaryTypes"
      />
      <Select
        label="Are you adding your own account?"
        id="isYourAccount"
        v-model="localForm.isYourAccount"
        :options="isYourAccount"
      />
      <InputReceivingCurrency
        label="Receiving currency"
        id="currency"
        v-model:modelCurrency="localForm.currency"
      />

      <Input
        label="Beneficiary's friendly name"
        id="name"
        v-model="localForm.name"
        :error="errors.name"
      />

      <div v-if="localForm.beneficiaryType === 1">
        <Input
          v-if="fieldVisibility('registrationNo')"
          :label="generateLabel('registrationNo')"
          id="registrationNo"
          v-model="localForm.registrationNo"
          :error="errors.registrationNo"
        />
        <InputBeneficiaryCountry
          v-if="fieldVisibility('registrationPlace')"
          :label="generateLabel('registrationPlace')"
          id="registrationPlace"
          v-model:modelValue="localForm.registrationPlace"
          :error="errors.registrationPlace"
        />
        <Input
          v-if="localForm.registrationPlace === 280"
          label="Other beneficiary's country of incorporation"
          id="otherRegistrationPlace"
          v-model="localForm.otherRegistrationPlace"
          :error="errors.otherRegistrationPlace"
        />
        <InputBusinessCategory
          label="Business category"
          id="businessCategory"
          v-model:modelCategory="localForm.businessCategory"
          :error="errors.businessCategory"
        />
        <Input
          v-if="localForm.businessCategory === 331"
          label="Other business category"
          id="otherBusinessCategory"
          v-model="localForm.otherBusinessCategory"
          :error="errors.otherBusinessCategory"
        />
        <Input
          label="Company's contact number"
          id="companyContactNo"
          v-model="localForm.companyContactNo"
          :error="errors.companyContactNo"
        />
      </div>

      <div v-if="localForm.beneficiaryType === 0">
        <InputBeneficiaryCountry
          label="Nationality"
          id="nationality"
          v-model:modelValue="localForm.nationality"
          :error="errors.nationality"
        />
        <Input
          v-if="localForm.nationality === 280"
          label="Other nationality"
          id="otherNationality"
          v-model="localForm.otherNationality"
          :error="errors.otherNationality"
        />
        <InputFile
          label="Photocopy of IC (or valid Working Pass for non-Singaporean)"
          id="docIC"
          v-model="localForm.docIC"
          :multiple="false"
          @update:modelValue="(files) => handleFileUpload('docIC', files)"
          :error="errors.docIC"
        />

        <!-- <Input
          v-if="fieldVisibility('dob')"
          :label="generateLabel('dob')"
          type="date"
          id="dob"
          v-model="localForm.dob"
          :error="errors.dob"
        /> -->
      </div>

      <Input
        label="Contact no. (Mobile) (optional)"
        id="contactMobile"
        v-model="localForm.contactMobile"
      />

      <Input
        v-if="fieldVisibility('address')"
        :label="generateLabel('address')"
        id="address"
        v-model="localForm.address"
        :error="errors.address"
      />
      <!-- <InputPhone
          label="Telephone number"
          id="telNum"
          v-model="localForm.telNum"
          @update:countryID="localForm.telCode = $event"
          :error="errors.telNum"
        /> -->
    </fieldset>

    <div class="footer">
      <button type="button" @click="handleNext" class="btn-red standard-button">
        Next
      </button>
      <button
        type="button"
        @click="handleCancel"
        class="btn-back standard-button"
      >
        Cancel
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";
import {
  Input,
  InputBeneficiaryCountry,
  InputFile,
  InputReceivingCurrency,
  InputBusinessCategory,
  Select,
  RadioGroup,
} from "@/components/Form";
import { beneficiaryTypes, isYourAccount } from "@/data/data";
import { useValidation } from "@/composables/useValidation";
import { formValidation, fieldMapping } from "./schemas/stepOneSchema";
import { useAlertStore } from "@/stores/index.js";
import { useRouter } from "vue-router";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["update:modelValue", "nextStep"]);
const { errors, validateForm, clearErrors, scrollToErrors } = useValidation();
const router = useRouter();

const alertStore = useAlertStore();

const localForm = reactive({
  beneficiaryType: props.modelValue.beneficiaryType ?? 1,
  isYourAccount: props.modelValue.isYourAccount ?? 0,
  ...props.modelValue,
});

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      Object.assign(localForm, { ...newVal });
    }
  },
  { immediate: true, deep: true }
);

// Generic file upload handler
const handleFileUpload = (field, files) => {
  if (localForm.beneficiaryType === 0) {
    // Corporate type
    if (Array.isArray(files)) {
      localForm[field] = files;
    } else {
      localForm[field] = [files];
    }
  } else {
    // Individual type
    if (Array.isArray(files)) {
      localForm[field] = files;
    } else {
      localForm[field] = [files];
    }
  }
};

const handleNext = () => {
  const schema = formValidation(localForm);

  const isValid = validateForm(localForm, schema);
  console.log("Validation Errors:", errors);

  if (isValid) {
    emit("nextStep");
  } else {
    alertStore.alert("error", "Please fill in all the required inputs.");
    scrollToErrors();
  }
};

watch(
  localForm,
  (newVal) => {
    if (newVal.beneficiaryType === 1) {
      // Corporate-specific cleanup
      delete newVal.nationality;
      delete newVal.docIC;
      // delete newVal.dob;
    } else if (newVal.beneficiaryType === 0) {
      // Individual-specific cleanup
      delete newVal.registrationNo;
      delete newVal.registrationPlace;
      delete newVal.otherRegistrationPlace;
      delete newVal.businessCategory;
      delete newVal.companyContactNo;
    }

    // Handle conditional fields
    if (newVal.registrationPlace !== 280) {
      delete newVal.otherRegistrationPlace;
    }
    if (newVal.nationality !== 280) {
      delete newVal.otherNationality;
    }

    emit("update:modelValue", { ...newVal }); // Emit updated form
  },
  { deep: true }
);

const fieldVisibility = (field) => {
  const mapping = fieldMapping[localForm.beneficiaryType] || {};
  const currentMapping = mapping[localForm.currency] || {};
  return currentMapping[field]?.include || false;
};

const generateLabel = (fieldName) => {
  const mapping = fieldMapping[localForm.beneficiaryType] || {};
  const currentMapping = mapping[localForm.currency] || {};

  const field = currentMapping[fieldName];
  let baseLabel = "";

  if (fieldName === "address") {
    baseLabel =
      localForm.beneficiaryType === 1 ? "Business address" : "Address";
  }
  if (fieldName === "registrationNo") {
    baseLabel = "Beneficiary's company registration number";
  }
  if (fieldName === "registrationPlace") {
    baseLabel = "Beneficiary's country of incorporation";
  }
  // if (fieldName === "dob") {
  //   baseLabel = "Date of birth";
  // }

  const isOptional =
    field?.include && (!field.rules || field.rules.length === 0);

  return isOptional ? `${baseLabel} (optional)` : baseLabel;
};

watch(
  () => localForm.beneficiaryType,
  () => {
    clearErrors();
  }
);

const handleCancel = () => {
  router.push({ path: "/beneficiary" });
};
</script>

<style scoped>
.first-form {
  width: 100%;
  max-width: 400px;
}

.first-form .footer {
  display: flex;
  flex-direction: column;
  gap: var(--size-12);
}

.form-group {
  margin-bottom: var(--size-24);
}
</style>
