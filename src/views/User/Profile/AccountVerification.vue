<template>
  <div class="content-area">
    <div class="profile">
      <div class="title">
        <h3>Account Verification</h3>
      </div>
      <form
        :class="{
          'step-one': currentStep === 1,
          'step-two': currentStep === 2,
          'step-three': currentStep === 3,
        }"
      >
        <StepOne
          v-if="currentStep === 1"
          :corporate-form="corporateForm"
          :individual-form="individualForm"
          :profile-details="profileDetails"
          :selected-customer-type="selectedCustomerType"
          @nextStep="nextStep"
          @updateCustomerType="updateCustomerType"
        />
        <StepTwo
          v-if="currentStep === 2"
          :corporate-form="corporateForm"
          :individual-form="individualForm"
          :profile-details="profileDetails"
          :selected-customer-type="selectedCustomerType"
          @nextStep="nextStep"
          @prevStep="prevStep"
        />
        <!-- <StepThree v-if="currentStep === 3" v-model:form="form" /> -->

        <div class="footer">
          <button
            v-if="currentStep === 3"
            type="submit"
            class="btn-red standard-button"
            @click="handleSubmit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import StepOne from "./components/StepOne.vue";
import StepTwo from "./components/StepTwo.vue";
import { useCountryStore } from "@/stores/countryStore";
import { useProfileStore } from "@/stores/profileStore";
import {
  entityTypes,
  fundSource,
  purposeOfIntendedTransactions,
  titles,
  hearAboutUs,
} from "@/data/data";
import { scrollToTop } from "@/utils/scrollUtil";

const countryStore = useCountryStore();

const profileStore = useProfileStore();

const profileDetails = reactive({
  givenName: "",
  surname: "",
  accountType: "",
  email: "",
  phoneNumber: "",
  companyName: "",
});

const currentStep = ref(1);

// Corporate form with all fields explicitly declared
const corporateForm = reactive({
  customerType: "Corporate & Trading Comp",
  registeredName: profileDetails.companyName,
  businessAddress: "",
  postalCode: "",
  mailAddress: "",
  mailPostalCode: "",
  contactName: "",
  operationCountry: "",
  countryCode: countryStore.selectedCode,
  telNum: "",
  contactHome: "",
  contactOffice: "",
  contactMobile: "",
  ic: "",
  jobTitle: "",
  nationality: "",
  dob: "",
  registrationPlace: "",
  registrationDate: "",
  registrationNo: "",
  entityType: entityTypes[0].value,
  otherEntity: "",
  title: titles[0].value,
  surname: profileDetails.surname,
  givenName: profileDetails.givenName,
  // agentCorporateCustomerType: agentCorporateCustomerType[0].value,
  // agentAddress: "", // Exclude here because condition to submit
  fundSource: fundSource[0].value,
  purposeOfIntendedTransactions: purposeOfIntendedTransactions[0].value,
  hearAboutUs: hearAboutUs[0].value,
  beneficiaryInvolvement: false,
  beneficiaryFamilyInvolvement: false,
  beneficiaryConnectionInvolvement: false,
});

// Individual (Natural Person) form with all fields explicitly declared
const individualForm = reactive({
  customerType: "Natural Person",
  name: "",
  address: "",
  postalCode: "",
  mailAddress: "",
  mailPostalCode: "",
  nationality: "",
  ic: "",
  dob: "",
  contactHome: "",
  contactOffice: "",
  contactMobile: "",
  title: titles[0].value,
  surname: profileDetails.surname,
  givenName: profileDetails.givenName,
  naturalEmploymentType: "employed",
});

// Centralized customer type selection
const selectedCustomerType = ref(profileDetails.accountType);

// Update customer type from child component
const updateCustomerType = (newCustomerType) => {
  selectedCustomerType.value = newCustomerType;
};

// Handle form submission
const handleSubmit = () => {
  if (selectedCustomerType.value === "Corporate & Trading Comp") {
    console.log("Submitting Corporate form:", corporateForm);
    // Submission logic for corporate form
  } else if (selectedCustomerType.value === "Natural Person") {
    console.log("Submitting Individual form:", individualForm);
  }
};

const nextStep = () => {
  currentStep.value++;
  scrollToTop();
};

const prevStep = () => {
  currentStep.value > 1 && currentStep.value--;
  scrollToTop();
};

// Sync profileDetails with forms
watch(
  () => profileDetails,
  (newProfileDetails) => {
    selectedCustomerType.value = newProfileDetails.accountType;

    if (selectedCustomerType.value === "Corporate & Trading Comp") {
      corporateForm.registeredName = newProfileDetails.companyName;
      corporateForm.surname = newProfileDetails.surname;
      corporateForm.givenName = newProfileDetails.givenName;
    } else if (selectedCustomerType.value === "Natural Person") {
      individualForm.surname = newProfileDetails.surname;
      individualForm.givenName = newProfileDetails.givenName;
    }
  },
  { deep: true }
);

// Sync country code with forms
watch(
  () => countryStore.selectedCode,
  (newCode) => {
    if (selectedCustomerType.value === "Corporate & Trading Comp") {
      corporateForm.countryCode = newCode;
    } else if (selectedCustomerType.value === "Natural Person") {
      individualForm.nationality = newCode;
    }
  }
);

onMounted(async () => {
  await profileStore.getProfileDetail();
  Object.assign(profileDetails, profileStore.profileDetails);
  selectedCustomerType.value = profileDetails.accountType;
});
</script>

<style scoped>
.content-area {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100%;
  max-width: 100%;
  gap: var(--size-24);
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

/* form.step-one .footer {
  display: flex;
  flex-direction: column;
  gap: var(--size-12);
  width: 100%;
  max-width: 400px;
} */
</style>
