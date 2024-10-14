<template>
  <div class="second-form" @keydown.enter.prevent="handleNext">
    <!-- Corporate Form -->
    <fieldset
      :disabled="store.isLoading"
      v-if="selectedCustomerType === 'Corporate & Trading Comp'"
    >
      <RadioGroup
        label="Are you an agent acting on behalf of the customer?"
        v-model="isAgent"
        :options="agentTypes"
      />

      <RadioGroup
        v-if="isAgent === 'Yes'"
        label="If yes, what is your customer type?"
        v-model="corporateForm.agentCorporateCustomerType"
        :options="agentCorporateCustomerType"
        :error="errors.agentCorporateCustomerType"
      />

      <div
        v-if="
          isAgent === 'Yes' &&
          (corporateForm.agentCorporateCustomerType === 'Entity' ||
            corporateForm.agentCorporateCustomerType === 'Individual')
        "
      >
        <Input
          label="Address"
          id="agentAddress"
          v-model="corporateForm.agentAddress"
          :error="errors.agentAddress"
        />

        <Input
          :label="
            corporateForm.agentCorporateCustomerType === 'Entity'
              ? 'Place of registration'
              : 'Country'
          "
          id="agentRegistrationCountry"
          v-model="corporateForm.agentRegistrationCountry"
          :error="errors.agentRegistrationCountry"
        />

        <Input
          :label="
            corporateForm.agentCorporateCustomerType === 'Entity'
              ? 'Registration no.'
              : 'Identification no.'
          "
          id="agentRegistrationNo"
          v-model="corporateForm.agentRegistrationNo"
          :error="errors.agentRegistrationNo"
        />

        <Input
          :label="
            corporateForm.agentCorporateCustomerType === 'Entity'
              ? 'Date of registration'
              : 'Date of birth'
          "
          type="date"
          id="agentRegistrationDate"
          v-model="corporateForm.agentRegistrationDate"
          :error="errors.agentRegistrationDate"
        />

        <Input
          label="Relationship between agent(s) and client"
          id="agentRelationship"
          v-model="corporateForm.agentRelationship"
          :error="errors.agentRelationship"
        />
        <InputFile
          label="Basis of authority"
          id="agentBasicAuth"
          :multiple="true"
          :error="errors.agentBasicAuth"
          @update:files="handleFileUpload"
        />
      </div>

      <Select
        label="Source of funds"
        id="fundSource"
        v-model="corporateForm.fundSource"
        :options="fundSource"
      />

      <Input
        label="Source of funds (others)"
        id="otherFundSource"
        v-if="corporateForm.fundSource === 'Others'"
        v-model="corporateForm.otherFundSource"
        :error="errors.otherFundSource"
      />

      <Select
        label="Purpose of intended transactions"
        id="purposeOfIntendedTransactions"
        v-model="corporateForm.purposeOfIntendedTransactions"
        :options="purposeOfIntendedTransactions"
      />

      <Select
        label="Where did you hear about us?"
        id="hearAboutUs"
        v-model="corporateForm.hearAboutUs"
        :options="hearAboutUs"
      />

      <Switch
        label="Beneficial owner's involvement in public functions"
        id="beneficiaryInvolvement"
        v-model="corporateForm.beneficiaryInvolvement"
        content="Has the beneficial owner ever been entrusted with prominent public functions, whether in Singapore, in a foreign country, or in an international organisation?"
      />

      <Switch
        label="Beneficial owner's family ties to individuals with public functions"
        id="beneficiaryFamilyInvolvement"
        v-model="corporateForm.beneficiaryFamilyInvolvement"
        content="Has the beneficial owner ever been a parent, step-parent, step-child, adopted child, spouse, sibling, step-sibling, or adopted sibling of anyone who has been entrusted with prominent public functions, whether in Singapore, in a foreign country, or in an international organisation?"
      />

      <Switch
        label="Beneficial owner's connections to individuals with public functions"
        id="beneficiaryConnectionInvolvement"
        v-model="corporateForm.beneficiaryConnectionInvolvement"
        content="Has the beneficial owner ever been closely connected, either socially or professionally, with anyone who is or has been entrusted with prominent public functions, whether in Singapore, in a foreign country, or in an international organisation?"
      />
    </fieldset>

    <!-- Individual Form -->
    <fieldset
      :disabled="store.isLoading"
      v-if="selectedCustomerType === 'Natural Person'"
    >
      <Input
        label="Name"
        id="agentName"
        v-model="individualForm.agentName"
        :error="errors.agentName"
      />

      <Input
        label="Address"
        id="agentAddress"
        v-model="individualForm.agentAddress"
        :error="errors.agentAddress"
      />

      <Input
        label="Nationality"
        id="agentNationality"
        v-model="individualForm.agentNationality"
        :error="errors.agentNationality"
      />

      <Input
        label="IC / Passport no."
        id="agentIC"
        v-model="individualForm.agentIC"
        :error="errors.agentIC"
      />

      <Input
        label="Date of birth"
        type="date"
        id="agentDOB"
        v-model="individualForm.agentDOB"
        :error="errors.agentDOB"
      />

      <Input
        label="Relationship between agent(s) and client"
        id="agentRelationship"
        v-model="individualForm.agentRelationship"
        :error="errors.agentRelationship"
      />

      <InputFile
        label="Basis of authority"
        id="agentBasicAuth"
        :multiple="false"
        :error="errors.agentBasicAuth"
        @update:files="handlePersonFileUpload"
      />
    </fieldset>

    <div class="footer">
      <button type="button" @click="handleNext" class="btn-red standard-button">
        Next
      </button>
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
import { ref, reactive, watch } from "vue";
import { useStore } from "@/stores/useStore";
import { validationService } from "@/services/validationService.js";
import {
  fundSource,
  purposeOfIntendedTransactions,
  agentCorporateCustomerType,
  hearAboutUs,
} from "@/data/data";
import { useRouter } from "vue-router";
import { corporateValidation, personValidation } from "./schemas/stepTwoSchema";
import {
  Input,
  InputFile,
  Select,
  RadioGroup,
  Switch,
} from "@/components/Form";

const props = defineProps({
  corporateForm: Object,
  individualForm: Object,
  selectedCustomerType: String,
});

const emit = defineEmits(["nextStep", "prevStep"]);
const router = useRouter();
const store = useStore();
const errors = reactive({});
const isAgent = ref("No");

const agentTypes = [
  { name: "Yes", value: "Yes" },
  { name: "No", value: "No" },
];

const handleFileUpload = (files) => {
  props.corporateForm.agentBasicAuth = files;
};

// Handle form submission
const handleNext = () => {
  validateForm();

  // Proceed to the next step only if there are no errors
  if (!Object.values(errors).some((error) => error)) {
    emit("nextStep");
  } else {
    console.log("Form has errors", errors); // Log errors if any
  }
};

// Validate the form fields
const validateForm = () => {
  clearErrors();

  // Use selectedCustomerType to determine schema
  const schemas =
    props.selectedCustomerType === "Corporate & Trading Comp"
      ? corporateValidation(props.corporateForm, isAgent.value) // Pass isAgent value
      : personValidation(props.individualForm);

  // Hide validation for 'Other fund source' if not displayed with v-if
  if (props.corporateForm.fundSource !== "Others") {
    delete schemas.otherFundSource;
  }

  const validationErrors = validationService.validateForm(schemas);

  // Clear errors for valid fields and assign validation errors
  Object.keys(schemas).forEach((field) => {
    if (!validationErrors[field]) {
      errors[field] = ""; // Clear if no error
    }
  });
  Object.assign(errors, validationErrors); // Assign validation errors
};

// Clear all errors
const clearErrors = () =>
  Object.keys(errors).forEach((key) => (errors[key] = ""));

// Handle the back button functionality
const handleBack = () => {
  emit("prevStep");
};

watch(
  () => props.corporateForm.agentCorporateCustomerType, // Watch for changes to the agent customer type
  () => {
    // Clear errors for fields regardless of 'Entity' or 'Individual'
    delete errors.agentRegistrationCountry;
    delete errors.agentRegistrationNo;
    delete errors.agentRegistrationDate;
    delete errors.agentAddress;
    delete errors.agentRelationship;
  },
  { immediate: true }
);
</script>

<style scoped>
.second-form {
  width: 100%;
  max-width: 600px;
}

.second-form .footer {
  display: flex;
  flex-direction: column;
  gap: var(--size-12);
}

.form-group {
  margin-bottom: var(--size-24);
}
</style>
