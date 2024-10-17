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
          id="agentBasisAuth"
          v-model="corporateForm.agentBasisAuth"
          :multiple="true"
          :error="errors.agentBasisAuth"
          @update:modelValue="
            (files) => handleFileUpload('agentBasisAuth', files)
          "
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
      <RadioGroup
        label="Are you an agent acting on behalf of the customer?"
        v-model="isAgent"
        :options="agentTypes"
      />

      <div v-if="isAgent === 'Yes'">
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
          id="agentBasisAuth"
          v-model="individualForm.agentBasisAuth"
          :multiple="true"
          :error="errors.agentBasisAuth"
          @update:modelValue="
            (files) => handleFileUpload('agentBasisAuth', files)
          "
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
import { ref, watch } from "vue";
import { useStore } from "@/stores/useStore";
import { useValidation } from "@/composables/useValidation";
import {
  fundSource,
  purposeOfIntendedTransactions,
  agentCorporateCustomerType,
  hearAboutUs,
} from "@/data/data";
import {
  corporateValidation,
  individualValidation,
} from "./schemas/stepTwoSchema";
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
  isAgent: String,
});

const emit = defineEmits(["nextStep", "prevStep", "updateAgent"]);
const store = useStore();

// Initialize useValidation composables
const { errors, validateForm, clearErrors, scrollToErrors } = useValidation();

// Reactive state
const selectedCustomerType = ref(props.selectedCustomerType); // Initialize based on props
const isAgent = ref(props.isAgent); // Use isAgent as a local ref based on props

const agentTypes = [
  { name: "Yes", value: "Yes" },
  { name: "No", value: "No" },
];

// Watch for changes to isAgent and emit updated value to parent
watch(isAgent, (newValue) => {
  emit("updateAgent", newValue); // Emit the updated value to parent to retain state
});

// Generic file upload handler
const handleFileUpload = (field, files) => {
  if (selectedCustomerType.value === "Corporate & Trading Comp") {
    props.corporateForm[field] = files;
  } else {
    props.individualForm[field] = files;
  }
};

const handleNext = () => {
  const form =
    selectedCustomerType.value === "Corporate & Trading Comp"
      ? props.corporateForm
      : props.individualForm;

  // If isAgent is "No", remove agent-related fields
  if (isAgent.value === "No") {
    if (selectedCustomerType.value === "Corporate & Trading Comp") {
      delete form.agentCorporateCustomerType;
      delete form.agentAddress;
      delete form.agentRegistrationCountry;
      delete form.agentRegistrationNo;
      delete form.agentRegistrationDate;
      delete form.agentRelationship;
      delete form.agentBasisAuth; // Remove file input
    } else {
      // For Natural Person form
      delete form.agentName;
      delete form.agentAddress;
      delete form.agentNationality;
      delete form.agentIC;
      delete form.agentDOB;
      delete form.agentRelationship;
      delete form.agentBasisAuth; // Remove file input
    }
  }

  // Validate the form
  const schema =
    selectedCustomerType.value === "Corporate & Trading Comp"
      ? corporateValidation(form, isAgent.value)
      : individualValidation(form, isAgent.value);

  const isValid = validateForm(form, schema); // Validate form

  if (isValid) {
    emit("nextStep");
  } else {
    scrollToErrors();
    console.log("Validation Errors:", errors);
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

// Clear errors when agent type changes
watch(
  () => isAgent.value,
  () => {
    clearErrors();
  }
);

// Clear specific errors based on agentCorporateCustomerType changes
watch(
  () => props.corporateForm.agentCorporateCustomerType,
  () => {
    delete errors.agentRegistrationCountry;
    delete errors.agentRegistrationNo;
    delete errors.agentRegistrationDate;
    delete errors.agentAddress;
    delete errors.agentRelationship;
  },
  { immediate: true }
);

const handleBack = () => {
  emit("prevStep");
};
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
