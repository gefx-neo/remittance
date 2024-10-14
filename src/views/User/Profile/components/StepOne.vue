<template>
  <div class="first-form" @keydown.enter.prevent="handleNext">
    <!-- Customer Type Selection - Centralized -->
    <Select
      label="Customer Type"
      id="customerType"
      v-model="selectedCustomerType"
      :options="customerTypes"
      @change="emitCustomerType"
    />

    <!-- Corporate Form -->
    <fieldset
      :disabled="store.isLoading"
      v-if="selectedCustomerType === 'Corporate & Trading Comp'"
    >
      <Input
        label="Registered name"
        id="registeredName"
        v-model="corporateForm.registeredName"
        :error="errors.registeredName"
      />

      <Input
        label="Business address"
        id="businessAddress"
        v-model="corporateForm.businessAddress"
        :error="errors.businessAddress"
      />

      <Input
        label="Postal code"
        id="postalCode"
        v-model="corporateForm.postalCode"
        :error="errors.postalCode"
      />

      <Input
        label="Mailing address"
        id="mailAddress"
        v-model="corporateForm.mailAddress"
        :error="errors.mailAddress"
      />

      <Input
        label="Mailing postal code"
        id="mailPostalCode"
        v-model="corporateForm.mailPostalCode"
        :error="errors.mailPostalCode"
      />

      <Input
        label="Contact name"
        id="contactName"
        v-model="corporateForm.contactName"
        :error="errors.contactName"
      />

      <Input
        label="Country of operation"
        id="operationCountry"
        v-model="corporateForm.operationCountry"
        :error="errors.operationCountry"
      />

      <InputPhone
        label="Telephone number"
        id="telNum"
        v-model="corporateForm.telNum"
        :error="errors.telNum"
      />

      <Input
        label="Contact no. (Home)"
        id="contactHome"
        v-model="corporateForm.contactHome"
      />

      <Input
        label="Contact no. (Office)"
        id="contactOffice"
        v-model="corporateForm.contactOffice"
      />

      <Input
        label="Contact no. (Mobile)"
        id="contactMobile"
        v-model="corporateForm.contactMobile"
        :error="errors.contactMobile"
      />

      <Input
        label="IC / Passport No."
        id="ic"
        v-model="corporateForm.ic"
        :error="errors.ic"
      />

      <Input
        label="Job title"
        id="jobTitle"
        v-model="corporateForm.jobTitle"
        :error="errors.jobTitle"
      />

      <Input
        label="Nationality"
        id="nationality"
        v-model="corporateForm.nationality"
        :error="errors.nationality"
      />

      <Input
        label="Date of birth"
        type="date"
        id="dob"
        v-model="corporateForm.dob"
        :error="errors.dob"
      />

      <Input
        label="Place of registration"
        id="registrationPlace"
        v-model="corporateForm.registrationPlace"
        :error="errors.registrationPlace"
      />

      <Input
        label="Date of registration"
        type="date"
        id="registrationDate"
        v-model="corporateForm.registrationDate"
        :error="errors.registrationDate"
      />

      <Input
        label="Registration no."
        id="registrationNo"
        v-model="corporateForm.registrationNo"
        :error="errors.registrationNo"
      />

      <Select
        label="Type of entity"
        id="entityType"
        v-model="corporateForm.entityType"
        :options="entityTypes"
      />

      <Input
        label="Type of entity (others)"
        id="otherEntity"
        v-if="corporateForm.entityType === 'Others'"
        v-model="corporateForm.otherEntity"
        :error="errors.otherEntity"
      />

      <Select
        label="Title"
        id="title"
        v-model="corporateForm.title"
        :options="titles"
      />

      <Input
        label="Surname"
        id="surname"
        v-model="corporateForm.surname"
        :error="errors.surname"
      />

      <Input
        label="Given name"
        id="givenName"
        v-model="corporateForm.givenName"
        :error="errors.givenName"
      />
    </fieldset>

    <!-- Natural Person Form -->
    <fieldset
      :disabled="store.isLoading"
      v-if="selectedCustomerType === 'Natural Person'"
    >
      <Input
        label="Name"
        id="name"
        v-model="individualForm.name"
        :error="errors.name"
      />

      <Input
        label="Permanent address"
        id="address"
        v-model="individualForm.address"
        :error="errors.address"
      />

      <Input
        label="Permanent postal code"
        id="postalCode"
        v-model="individualForm.postalCode"
        :error="errors.postalCode"
      />

      <Input
        label="Mail address"
        id="mailAddress"
        v-model="individualForm.mailAddress"
        :error="errors.mailAddress"
      />

      <Input
        label="Mailing postal code"
        id="mailPostalCode"
        v-model="individualForm.mailPostalCode"
        :error="errors.mailPostalCode"
      />

      <Input
        label="Nationality"
        id="nationality"
        v-model="individualForm.nationality"
        :error="errors.nationality"
      />

      <Input
        label="IC"
        id="ic"
        v-model="individualForm.ic"
        :error="errors.ic"
      />

      <Input
        label="Date of birth"
        type="date"
        id="dob"
        v-model="individualForm.dob"
        :error="errors.dob"
      />

      <Input
        label="Contact no. (Home)"
        id="contactHome"
        v-model="individualForm.contactHome"
      />

      <Input
        label="Contact no. (Office)"
        id="contactOffice"
        v-model="individualForm.contactOffice"
      />

      <Input
        label="Contact no. (Mobile)"
        id="contactMobile"
        v-model="individualForm.contactMobile"
        :error="errors.contactMobile"
      />

      <Select
        label="Title"
        id="title"
        v-model="individualForm.title"
        :options="titles"
      />

      <Input
        label="Surname"
        id="surname"
        v-model="individualForm.surname"
        :error="errors.surname"
      />

      <Input
        label="Given name"
        id="givenName"
        v-model="individualForm.givenName"
        :error="errors.givenName"
      />

      <RadioGroup
        label="Employment type"
        v-model="individualForm.naturalEmploymentType"
        :options="employmentTypes"
      />

      <Input
        v-if="individualForm.naturalEmploymentType === 'employed'"
        label="Name of employer"
        id="employerName"
        v-model="individualForm.employerName"
        :error="errors.employerName"
      />

      <Input
        v-if="individualForm.naturalEmploymentType === 'employed'"
        label="Job title"
        id="jobTitle"
        v-model="individualForm.employerJobTitle"
        :error="errors.employerJobTitle"
      />

      <Input
        v-if="individualForm.naturalEmploymentType === 'employed'"
        label="Registered address of employer"
        id="employerAddress"
        v-model="individualForm.employerAddress"
        :error="errors.employerAddress"
      />

      <Input
        v-if="individualForm.naturalEmploymentType === 'selfEmployed'"
        label="Name of business"
        id="businessName"
        v-model="individualForm.businessName"
        :error="errors.businessName"
      />

      <Input
        v-if="individualForm.naturalEmploymentType === 'selfEmployed'"
        label="Business registration no."
        id="businessRegistrationNo"
        v-model="individualForm.businessRegistrationNo"
        :error="errors.businessRegistrationNo"
      />

      <Input
        v-if="individualForm.naturalEmploymentType === 'selfEmployed'"
        label="Registered business address"
        id="businessAddress"
        v-model="individualForm.businessAddress"
        :error="errors.businessAddress"
      />

      <Input
        v-if="individualForm.naturalEmploymentType === 'selfEmployed'"
        label="Principal place of business"
        id="businessPlace"
        v-model="individualForm.businessPlace"
        :error="errors.businessPlace"
      />
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
import { ref, reactive, watch } from "vue";
import { useStore } from "@/stores/useStore";
import { useAlertStore } from "@/stores/alertStore"; // Import the alert store
import { Input, InputPhone, Select, RadioGroup } from "@/components/Form";

import { useRouter } from "vue-router";
import { corporateValidation, personValidation } from "./schemas/stepOneSchema";
import { validationService } from "@/services/validationService";
import {
  customerTypes,
  entityTypes,
  employmentTypes,
  titles,
} from "@/data/data";
import { scrollToFirstError } from "@/utils/scrollUtil";

const props = defineProps({
  corporateForm: Object,
  individualForm: Object,
  profileDetails: Object,
  selectedCustomerType: String,
});

const emit = defineEmits(["nextStep", "updateCustomerType"]);

const router = useRouter();
const store = useStore();
const alertStore = useAlertStore();
const errors = reactive({});

// To notify parent which form to submit
const emitCustomerType = () => {
  emit("updateCustomerType", selectedCustomerType.value);
};

const handleNext = () => {
  validateForm();

  if (!Object.values(errors).some((error) => error)) {
    emit("nextStep");
  } else {
    alertStore.alert("error", "Please fill in all the required inputs.");
    scrollToFirstError(errors);
    console.log("Form has errors", errors);
  }
};

const validateForm = () => {
  clearErrors();

  // Trim form fields using the computed selectedCustomerType value
  validationService.trimFormFields(
    selectedCustomerType.value === "Corporate & Trading Comp"
      ? props.corporateForm
      : props.individualForm
  );

  // Dynamically set the validation schema based on selectedCustomerType
  const schemas =
    selectedCustomerType.value === "Corporate & Trading Comp"
      ? corporateValidation(props.corporateForm)
      : personValidation(props.individualForm);

  // Hide validation for 'Other Entity' if not displayed with v-if
  if (props.corporateForm.entityType !== "Others") {
    delete schemas.otherEntity;
  }

  // Conditionally validate 'employed' and 'Self Employed' based on naturalEmploymentType
  if (selectedCustomerType.value === "Natural Person") {
    if (props.individualForm.naturalEmploymentType === "employed") {
      delete schemas.businessName;
      delete schemas.businessRegistrationNo;
      delete schemas.businessAddress;
      delete schemas.businessPlace;
    } else if (props.individualForm.naturalEmploymentType === "selfEmployed") {
      delete schemas.employerName;
      delete schemas.employerJobTitle;
      delete schemas.employerAddress;
    }
  }

  const validationErrors = validationService.validateForm(schemas);

  // Clear errors if validation passes for the field
  Object.keys(schemas).forEach((field) => {
    if (!validationErrors[field]) errors[field] = ""; // Clear if no error
  });
  Object.assign(errors, validationErrors);
};

const clearErrors = () =>
  Object.keys(errors).forEach((key) => (errors[key] = ""));

const selectedCustomerType = ref(props.selectedCustomerType); // Initialize with the value passed from parent

// Watch for changes to selectedCustomerType and emit to parent
watch(
  () => selectedCustomerType.value,
  (newValue) => {
    emit("updateCustomerType", newValue); // Emit changes to parent
  }
);

// To avoid resetting selectedCustomerType when navigating back
watch(
  () => props.selectedCustomerType,
  (newVal) => {
    if (!selectedCustomerType.value || selectedCustomerType.value === "") {
      selectedCustomerType.value = newVal; // Set it only if it's empty
    }
  },
  { immediate: true } // Run on mount
);

watch(selectedCustomerType, () => {
  clearErrors(); // Clear errors when customer type changes
});

watch(
  () => props.individualForm.naturalEmploymentType,
  (newVal) => {
    if (newVal === "employed") {
      delete errors.businessName;
      delete errors.businessRegistrationNo;
      delete errors.businessAddress;
      delete errors.businessPlace;
    } else if (newVal === "selfEmployed") {
      delete errors.employerName;
      delete errors.employerJobTitle;
      delete errors.employerAddress;
    }
  },
  { immediate: true }
);

const handleCancel = () => {
  router.go(-1);
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
