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
      v-if="selectedCustomerType === 'Corporate & Trading Company'"
    >
      <Input
        label="Registered name"
        id="registeredName"
        v-model="corporateForm.registeredName"
        :error="errors.registeredName"
      />

      <Input
        label="Business address"
        id="address"
        v-model="corporateForm.address"
        :error="errors.address"
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
        id="name"
        v-model="corporateForm.name"
        :error="errors.name"
      />

      <InputCountry
        label="Country of operation"
        id="operationCountry"
        v-model:modelCountry="corporateForm.operationCountry"
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

      <InputCountry
        label="Nationality"
        id="nationality"
        v-model:modelCountry="corporateForm.nationality"
        :error="errors.nationality"
      />

      <Input
        label="Date of birth"
        type="date"
        id="dob"
        v-model="corporateForm.dob"
        :error="errors.dob"
      />

      <InputCountry
        label="Place of registration"
        id="registrationPlace"
        v-model:modelCountry="corporateForm.registrationPlace"
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
        id="entity"
        v-model="corporateForm.entity"
        :options="entityTypes"
      />

      <Input
        label="Type of entity (others)"
        id="otherEntity"
        v-if="corporateForm.entity === 'Others'"
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

      <InputCountry
        label="Nationality"
        id="nationality"
        v-model:modelCountry="individualForm.nationality"
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
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/stores/useStore";
import { useAlertStore, useStore } from "@/stores/index.js";
import {
  Input,
  InputPhone,
  InputCountry,
  Select,
  RadioGroup,
} from "@/components/Form";
import {
  customerTypes,
  entityTypes,
  employmentTypes,
  titles,
} from "@/data/data";
import { useValidation } from "@/composables/useValidation";
import {
  corporateValidation,
  individualValidation,
} from "./schemas/stepOneSchema";

const props = defineProps({
  corporateForm: Object,
  individualForm: Object,
  profileDetails: Object,
  selectedCustomerType: String,
  naturalEmploymentType: String,
});

const emit = defineEmits(["nextStep", "updateCustomerType"]);
const router = useRouter();
const store = useStore();
const alertStore = useAlertStore();

// Composable for form validation
const { errors, validateForm, clearErrors, scrollToErrors } = useValidation();

// Initialize with the value passed from parent
const selectedCustomerType = ref(props.selectedCustomerType);

// Notify parent about customer type change
const emitCustomerType = () => {
  emit("updateCustomerType", selectedCustomerType.value);
};

// Watch for changes in selectedCustomerType and emit to parent
watch(
  () => selectedCustomerType.value,
  (newValue) => {
    emit("updateCustomerType", newValue);
    clearErrors(); // Clear errors when the customer type changes
  }
);

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

// Watch the employment type in the individual form to conditionally clear errors
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

const handleNext = () => {
  const form =
    selectedCustomerType.value === "Corporate & Trading Company"
      ? props.corporateForm
      : props.individualForm;

  // Set the correct validation schema based on selectedCustomerType
  const schema =
    selectedCustomerType.value === "Corporate & Trading Company"
      ? corporateValidation(form)
      : individualValidation(form, form.naturalEmploymentType);

  // If employment type is "employed", remove self-employed fields
  if (form.naturalEmploymentType === "employed") {
    delete form.businessName;
    delete form.businessRegistrationNo;
    delete form.businessAddress;
    delete form.businessPlace;
  }

  // If employment type is "selfEmployed", remove employed fields
  if (form.naturalEmploymentType === "selfEmployed") {
    delete form.employerName;
    delete form.employerJobTitle;
    delete form.employerAddress;
  }

  // Validate the form
  const isValid = validateForm(form, schema);
  console.log("Validation Errors:", errors);

  if (isValid) {
    emit("nextStep");
  } else {
    alertStore.alert("error", "Please fill in all the required inputs.");
    scrollToErrors();
  }
};

// Delete other entity from form if toggled open and close again
watch(
  () => props.corporateForm.entity,
  (newVal) => {
    if (newVal !== "Others") {
      delete props.corporateForm.otherEntity;
    }
  }
);

const handleCancel = () => {
  router.push({ path: "/profile" });
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
