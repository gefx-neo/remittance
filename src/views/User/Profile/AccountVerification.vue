<template>
  <div class="content-area">
    <div class="profile">
      <div class="title">
        <h3>Account Verification</h3>
      </div>
      <!-- <StepBullets
        :currentStep="currentStep"
        :steps="['Account', 'Compliance', 'Document']"
        @step-clicked="setStep"
      /> -->
      <form
        :class="{
          'step-one': currentStep === 1,
          'step-two': currentStep === 2,
          'step-three': currentStep === 3,
        }"
      >
        <StepOne
          v-if="stepStore.currentStep === 1"
          :corporate-form="corporateForm"
          :individual-form="individualForm"
          :profile-details="profileDetails"
          :selected-customer-type="selectedCustomerType"
          @nextStep="nextStep"
          @updateCustomerType="updateCustomerType"
        />
        <StepTwo
          v-if="stepStore.currentStep === 2"
          :corporate-form="corporateForm"
          :individual-form="individualForm"
          :profile-details="profileDetails"
          :selected-customer-type="selectedCustomerType"
          :is-agent="isAgent"
          @updateAgent="isAgent = $event"
          @nextStep="nextStep"
          @prevStep="prevStep"
        />
        <StepThree
          v-if="stepStore.currentStep === 3"
          :corporate-form="corporateForm"
          :individual-form="individualForm"
          :profile-details="profileDetails"
          :selected-customer-type="selectedCustomerType"
          @submit="handleSubmit"
          @prevStep="prevStep"
        />
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import StepOne from "./components/StepOne.vue";
import StepTwo from "./components/StepTwo.vue";
import StepThree from "./components/StepThree.vue";
import { useCountryCodeStore } from "@/stores/countryCodeStore";
import { useCountryStore } from "@/stores/countryStore";
import { useProfileStore } from "@/stores/profileStore";
import { useStepStore } from "@/stores/stepStore";
import {
  entityTypes,
  fundSource,
  purposeOfIntendedTransactions,
  titles,
  hearAboutUs,
} from "@/data/data";
import { getLocalStorageWithExpiry } from "@/services/localStorageService.js";
import { useValidation } from "@/composables/useValidation";

const countryCodeStore = useCountryCodeStore();
const countryStore = useCountryStore();

const profileStore = useProfileStore();
const stepStore = useStepStore();

const profileDetails = reactive({
  givenName: "",
  surname: "",
  accountType: "",
  email: "",
  phoneNumber: "",
  companyName: "",
});

const { scrollToTop } = useValidation();

const isAgent = ref("No"); // Store isAgent in the parent as a local ref
const username = ref("");

const corporateForm = reactive({
  username: "",
  customerType: "Corporate & Trading Comp",
  registeredName: profileDetails.companyName,
  businessAddress: "",
  postalCode: "",
  mailAddress: "",
  mailPostalCode: "",
  contactName: "",
  operationCountry: "",
  countryCode: countryCodeStore.selectedCode,
  telNum: "",
  contactHome: "",
  contactOffice: "",
  contactMobile: "",
  ic: "",
  jobTitle: "",
  nationality: countryStore.selectedCountry,
  dob: "",
  registrationPlace: "",
  registrationDate: "",
  registrationNo: "",
  entityType: entityTypes[0].value,
  title: titles[0].value,
  surname: profileDetails.surname,
  givenName: profileDetails.givenName,
  // agentCorporateCustomerType: agentCorporateCustomerType[0].value,
  // agentAddress: "", // Exclude here because condition to submit
  fundSource: fundSource[0].value,
  purposeOfIntendedTransactions: purposeOfIntendedTransactions[0].value,
  hearAboutUs: hearAboutUs[0].value,
  beneficiaryInvolvement: "0",
  beneficiaryFamilyInvolvement: "0",
  beneficiaryConnectionInvolvement: "1",
  docAccOpening: null, // Ensure file fields are declared
  docPhotoID: null,
  docSelfie: null,
  docDirectorIC: null,
  docAcra: null,
});

// Individual (Natural Person) form with all fields explicitly declared
const individualForm = reactive({
  username: "",
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
  fundSource: fundSource[0].value,
  purposeOfIntendedTransactions: purposeOfIntendedTransactions[0].value,
  hearAboutUs: hearAboutUs[0].value,
  beneficiaryInvolvement: "0",
  beneficiaryFamilyInvolvement: "0",
  beneficiaryConnectionInvolvement: "1",
  docIC: null,
  docSelfie: null,
  docCard: null,
  docKYC: null,
});

// Centralized customer type selection
const selectedCustomerType = ref(profileDetails.accountType);

// Update customer type from child component
const updateCustomerType = (newCustomerType) => {
  selectedCustomerType.value = newCustomerType;
};

// const handleSubmit = async () => {
//   const formData = new FormData();

//   // Ensure each file is paired with its corresponding folder
//   const appendFilesWithFolder = (files, folderName) => {
//     if (Array.isArray(files)) {
//       files.forEach((file) => {
//         formData.append("file", file); // Add file
//         formData.append("folder", folderName); // Add folder name as text
//       });
//     } else if (files) {
//       formData.append("file", files[0]); // Add single file
//       formData.append("folder", folderName); // Add folder name as text
//     }
//   };

//   // Example for corporate form
//   if (selectedCustomerType.value === "Corporate & Trading Comp") {
//     appendFilesWithFolder(corporateForm.docAccOpening, "AccountOpening");
//     appendFilesWithFolder(corporateForm.docPhotoID, "BusinessAcra");
//     appendFilesWithFolder(corporateForm.docSelfie, "CompanySelfiePhoto");
//     appendFilesWithFolder(corporateForm.docDirectorIC, "ICWithDirector");
//     appendFilesWithFolder(corporateForm.docAcra, "BusinessAcra");

//     // Append agent files if isAgent is "Yes"
//     if (isAgent.value === "Yes") {
//       appendFilesWithFolder(corporateForm.agentBasisAuth, "BasisOfAuthority");
//     }
//   } else if (selectedCustomerType.value === "Natural Person") {
//     // Individual customer
//     appendFilesWithFolder(individualForm.docIC, "ICOfCustomer");
//     appendFilesWithFolder(individualForm.docSelfie, "NaturalSelfiePhoto");
//     appendFilesWithFolder(individualForm.docCard, "BusinessNameCard");
//     appendFilesWithFolder(individualForm.docKYC, "KYCForm");
//   }

//   try {
//     const uploadResponse = await profileStore.uploadFiles(formData);
//     console.log("Upload Response:", uploadResponse);
//   } catch (error) {
//     console.error("File upload failed:", error);
//   }
// };

const handleSubmit = async () => {
  const formData = new FormData();

  // Helper function to append and upload each file individually
  const appendAndUploadFile = async (file, folderName) => {
    const fileFormData = new FormData();
    fileFormData.append("file", file); // Add file
    fileFormData.append("folder", folderName); // Add folder name as text

    // Log the time before the upload starts
    const fileStartTime = new Date();
    console.log(
      `Uploading ${file.name} started at: ${fileStartTime.toLocaleTimeString()}`
    );

    // Upload the file
    await profileStore.uploadFiles(fileFormData);

    // Log the time after the upload finishes
    const fileEndTime = new Date();
    console.log(
      `Finished uploading ${file.name} at: ${fileEndTime.toLocaleTimeString()}`
    );
    console.log(
      `Time taken to upload ${file.name}: ${
        (fileEndTime - fileStartTime) / 1000
      } seconds`
    );
  };

  // Helper function to gather all file upload promises
  const appendFilesWithFolder = (files, folderName) => {
    const uploadPromises = [];

    if (Array.isArray(files)) {
      files.forEach((file) => {
        uploadPromises.push(appendAndUploadFile(file, folderName));
      });
    } else if (files) {
      uploadPromises.push(appendAndUploadFile(files[0], folderName)); // Single file upload
    }

    return uploadPromises;
  };

  // Array to store all upload promises
  let allUploadPromises = [];

  // Append files for corporate or individual form and gather upload promises
  if (selectedCustomerType.value === "Corporate & Trading Comp") {
    allUploadPromises = [
      ...appendFilesWithFolder(corporateForm.docAccOpening, "AccountOpening"),
      ...appendFilesWithFolder(corporateForm.docPhotoID, "BusinessAcra"),
      ...appendFilesWithFolder(corporateForm.docSelfie, "CompanySelfiePhoto"),
      ...appendFilesWithFolder(corporateForm.docDirectorIC, "ICWithDirector"),
      ...appendFilesWithFolder(corporateForm.docAcra, "BusinessAcra"),
    ];

    // Append agent files if isAgent is "Yes"
    if (isAgent.value === "Yes") {
      allUploadPromises.push(
        ...appendFilesWithFolder(
          corporateForm.agentBasisAuth,
          "BasisOfAuthority"
        )
      );
    }
  } else if (selectedCustomerType.value === "Natural Person") {
    allUploadPromises = [
      ...appendFilesWithFolder(individualForm.docIC, "ICOfCustomer"),
      ...appendFilesWithFolder(individualForm.docSelfie, "NaturalSelfiePhoto"),
      ...appendFilesWithFolder(individualForm.docCard, "BusinessNameCard"),
      ...appendFilesWithFolder(individualForm.docKYC, "KYCForm"),
    ];
  }

  try {
    // Upload all files in parallel
    console.log("Starting file uploads in parallel...");
    await Promise.all(allUploadPromises);
    console.log("All files uploaded successfully.");

    // After file upload completes, proceed with account verification
    const verificationForm =
      selectedCustomerType.value === "Corporate & Trading Comp"
        ? corporateForm
        : individualForm;

    const verifyResponse = await profileStore.verifyAccount(verificationForm);

    if (verifyResponse.status === 1) {
      console.log("Account verification successful!");
    } else {
      console.error("Account verification failed:", verifyResponse.message);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

onMounted(() => {
  stepStore.setSteps(["Account", "Compliance", "Document"]);
  stepStore.setCurrentStep(1);
});

const nextStep = () => {
  stepStore.nextStep();
  scrollToTop();
};

const prevStep = () => {
  stepStore.prevStep();
  scrollToTop();
};

//   currentStep.value++;
//   scrollToTop();
// };

// const prevStep = () => {
//   currentStep.value > 1 && currentStep.value--;
//   scrollToTop();
// };

// Sync profileDetails with forms
watch(
  () => profileDetails,
  (newProfileDetails) => {
    selectedCustomerType.value = newProfileDetails.accountType;
    corporateForm.registeredName = newProfileDetails.companyName;
    corporateForm.surname = newProfileDetails.surname;
    corporateForm.givenName = newProfileDetails.givenName;
    individualForm.surname = newProfileDetails.surname;
    individualForm.givenName = newProfileDetails.givenName;
  },
  { deep: true }
);

// Sync country code with forms
watch(
  () => countryCodeStore.selectedCode,
  (newCode) => {
    if (selectedCustomerType.value === "Corporate & Trading Comp") {
      corporateForm.countryCode = newCode;
    } else if (selectedCustomerType.value === "Natural Person") {
      individualForm.nationality = newCode;
    }
  }
);

watch(
  () => countryStore.selectedCountry,
  (newCountry) => {
    if (selectedCustomerType.value === "Corporate & Trading Comp") {
      corporateForm.nationality = newCountry;
    } else if (selectedCustomerType.value === "Natural Person") {
      individualForm.nationality = newCountry;
    }
  }
);

onMounted(async () => {
  await profileStore.getProfileDetail();
  Object.assign(profileDetails, profileStore.profileDetails);
  username.value = getLocalStorageWithExpiry("username");
  corporateForm.username = username.value;
  individualForm.username = username.value;
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
