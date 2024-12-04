<template>
  <div class="content-area">
    <div class="profile">
      <div class="title">
        <h3>Account Verification</h3>
        <button class="btn-round" @click="handleCancel">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
            <path
              d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
            ></path>
          </svg>
        </button>
      </div>

      <form>
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
          :is-loading="store.isLoading"
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
import {
  useAlertStore,
  useCountryCodeStore,
  useProfileStore,
  useStepStore,
  useStore,
} from "@/stores/index.js";
import {
  entityTypes,
  fundSource,
  purposeOfIntendedTransactions,
  titles,
  hearAboutUs,
  annualIncome,
} from "@/data/data";
import { getLocalStorageWithExpiry } from "@/services/localStorageService.js";
import { useValidation } from "@/composables/useValidation";
import { useRouter } from "vue-router";

const router = useRouter();
const countryCodeStore = useCountryCodeStore();

const profileStore = useProfileStore();
const stepStore = useStepStore();
const store = useStore();
const alertStore = useAlertStore();

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

// Corporate form with all fields declared except the conditional ones
const corporateForm = reactive({
  username: "",
  customerType: "Corporate & Trading Company",
  registeredName: profileDetails.companyName,
  address: "",
  postalCode: "",
  mailAddress: "",
  mailPostalCode: "",
  name: "",
  operationCountry: "",
  telCode: countryCodeStore.selectedID,
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
  entity: entityTypes[0].value,
  title: titles[0].value,
  surname: profileDetails.surname,
  givenName: profileDetails.givenName,
  // agentCorporateCustomerType: agentCorporateCustomerType[0].value,
  // agentAddress: "", // Exclude here because condition to submit
  purposeAccRel: "",
  fundSource: fundSource[0].value,
  purposeOfIntendedTransactions: purposeOfIntendedTransactions[0].value,
  hearAboutUs: hearAboutUs[0].value,
  beneficiaryInvolvement: "0",
  beneficiaryFamilyInvolvement: "0",
  beneficiaryConnectionInvolvement: "0",
  docAccOpening: null,
  docPhotoID: null,
  docSelfie: null,
  docDirectorIC: null,
  docAcra: null,
});

// Individual (Natural Person) form with all fields declared except the conditional ones
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
  annualIncome: annualIncome[0].value,
  beneficiaryInvolvement: "0",
  beneficiaryFamilyInvolvement: "0",
  beneficiaryConnectionInvolvement: "0",
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

const handleSubmit = async () => {
  // Helper function to generate a random string
  const generateRandomString = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  // Helper function to append and upload each file individually
  const appendAndUploadFile = async (file, folderName) => {
    const randomString = generateRandomString(5); // Generate a random string of 5 characters
    const newFileName = `${file.name
      .split(".")
      .slice(0, -1)
      .join(".")}_${randomString}.${file.name.split(".").pop()}`;

    const formData = new FormData();
    formData.append("file", file, newFileName); // Add file with new name
    formData.append("folder", folderName); // Add folder name as text

    // Log the time before the upload starts
    const fileStartTime = new Date();
    console.log(
      `Uploading ${newFileName} started at: ${fileStartTime.toLocaleTimeString()}`
    );

    // Upload the file
    await profileStore.uploadFiles(formData);

    // Log the time after the upload finishes
    const fileEndTime = new Date();
    console.log(
      `Finished uploading ${newFileName} at: ${fileEndTime.toLocaleTimeString()}`
    );
    console.log(
      `Time taken to upload ${newFileName}: ${
        (fileEndTime - fileStartTime) / 1000
      } seconds`
    );
  };

  // Helper function to gather all file upload promises and return file names
  const appendFilesWithFolder = (files, folderName) => {
    const uploadPromises = [];
    const fileNames = [];

    if (Array.isArray(files)) {
      files.forEach((file) => {
        uploadPromises.push(appendAndUploadFile(file, folderName));
        const randomString = generateRandomString(5); // Generate a random string of 5 characters
        const newFileName = `${file.name
          .split(".")
          .slice(0, -1)
          .join(".")}_${randomString}.${file.name.split(".").pop()}`;
        fileNames.push(newFileName); // Collect new file names
      });
    } else if (files) {
      uploadPromises.push(appendAndUploadFile(files[0], folderName)); // Single file upload
      const randomString = generateRandomString(5); // Generate a random string of 5 characters
      const newFileName = `${files[0].name
        .split(".")
        .slice(0, -1)
        .join(".")}_${randomString}.${files[0].name.split(".").pop()}`;
      fileNames.push(newFileName); // Collect new file name
    }

    return { uploadPromises, fileNames };
  };

  let allUploadPromises = [];
  let fileNames = {};

  // Append files for corporate or individual form and gather upload promises
  if (selectedCustomerType.value === "Corporate & Trading Company") {
    const accountOpening = appendFilesWithFolder(
      corporateForm.docAccOpening,
      "AccountOpening"
    );
    const photoID = appendFilesWithFolder(
      corporateForm.docPhotoID,
      "BusinessAcra"
    );
    const selfie = appendFilesWithFolder(
      corporateForm.docSelfie,
      "CompanySelfiePhoto"
    );
    const directorIC = appendFilesWithFolder(
      corporateForm.docDirectorIC,
      "ICWithDirector"
    );
    const acra = appendFilesWithFolder(corporateForm.docAcra, "BusinessAcra");

    allUploadPromises = [
      ...accountOpening.uploadPromises,
      ...photoID.uploadPromises,
      ...selfie.uploadPromises,
      ...directorIC.uploadPromises,
      ...acra.uploadPromises,
    ];

    fileNames = {
      docAccOpening: accountOpening.fileNames.join(","),
      docPhotoID: photoID.fileNames.join(","),
      docSelfie: selfie.fileNames.join(","),
      docDirectorIC: directorIC.fileNames.join(","),
      docAcra: acra.fileNames.join(","),
    };

    // **Handle agent-related files if `isAgent` is 'Yes'**
    if (isAgent.value === "Yes") {
      const agentBasisAuth = appendFilesWithFolder(
        corporateForm.agentBasisAuth,
        "BasisOfAuthority"
      );
      allUploadPromises.push(...agentBasisAuth.uploadPromises);
      fileNames.agentBasisAuth = agentBasisAuth.fileNames.join(",");
    }
  } else if (selectedCustomerType.value === "Natural Person") {
    const ic = appendFilesWithFolder(individualForm.docIC, "ICOfCustomer");
    const selfie = appendFilesWithFolder(
      individualForm.docSelfie,
      "NaturalSelfiePhoto"
    );
    const card = appendFilesWithFolder(
      individualForm.docCard,
      "BusinessNameCard"
    );
    const kyc = appendFilesWithFolder(individualForm.docKYC, "KYCForm");

    allUploadPromises = [
      ...ic.uploadPromises,
      ...selfie.uploadPromises,
      ...card.uploadPromises,
      ...kyc.uploadPromises,
    ];

    fileNames = {
      docIC: ic.fileNames.join(","),
      docSelfie: selfie.fileNames.join(","),
      docCard: card.fileNames.join(","),
      docKYC: kyc.fileNames.join(","),
    };

    // **Handle agent-related files if `isAgent` is 'Yes'**
    if (isAgent.value === "Yes") {
      const agentBasisAuth = appendFilesWithFolder(
        individualForm.agentBasisAuth,
        "BasisOfAuthority"
      );
      allUploadPromises.push(...agentBasisAuth.uploadPromises);
      fileNames.agentBasisAuth = agentBasisAuth.fileNames.join(",");
    }
  }

  try {
    // Upload all files in parallel
    console.log("Starting file uploads in parallel...");
    await Promise.all(allUploadPromises);
    console.log("All files uploaded successfully.");

    // After file upload completes, proceed with account verification
    const verificationForm =
      selectedCustomerType.value === "Corporate & Trading Company"
        ? { ...corporateForm, ...fileNames }
        : { ...individualForm, ...fileNames };

    const verifyResponse = await profileStore.verifyAccount(verificationForm);

    if (verifyResponse.status === 1) {
      alertStore.alert("success", "You have submitted successfully.");
      window.location.href = "/#/profile";

      console.log("Account verification successful!");
    } else {
      alertStore.alert("error", verifyResponse.message);
      console.error("Account verification failed:", verifyResponse.message);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

// const handleSubmit = async () => {
//   // Helper function to append and upload each file individually
//   const appendAndUploadFile = async (file, folderName) => {
//     const formData = new FormData();
//     formData.append("file", file); // Add file
//     formData.append("folder", folderName); // Add folder name as text

//     // Log the time before the upload starts
//     const fileStartTime = new Date();
//     console.log(
//       `Uploading ${file.name} started at: ${fileStartTime.toLocaleTimeString()}`
//     );

//     // Upload the file
//     await profileStore.uploadFiles(formData);

//     // Log the time after the upload finishes
//     const fileEndTime = new Date();
//     console.log(
//       `Finished uploading ${file.name} at: ${fileEndTime.toLocaleTimeString()}`
//     );
//     console.log(
//       `Time taken to upload ${file.name}: ${
//         (fileEndTime - fileStartTime) / 1000
//       } seconds`
//     );
//   };

//   // Helper function to gather all file upload promises and return file names
//   const appendFilesWithFolder = (files, folderName) => {
//     const uploadPromises = [];
//     const fileNames = [];

//     if (Array.isArray(files)) {
//       files.forEach((file) => {
//         uploadPromises.push(appendAndUploadFile(file, folderName));
//         fileNames.push(file.name); // Collect file names
//       });
//     } else if (files) {
//       uploadPromises.push(appendAndUploadFile(files[0], folderName)); // Single file upload
//       fileNames.push(files[0].name); // Collect file name
//     }

//     return { uploadPromises, fileNames };
//   };

//   let allUploadPromises = [];
//   let fileNames = {};

//   // Append files for corporate or individual form and gather upload promises
//   if (selectedCustomerType.value === "Corporate & Trading Company") {
//     const accountOpening = appendFilesWithFolder(
//       corporateForm.docAccOpening,
//       "AccountOpening"
//     );
//     const photoID = appendFilesWithFolder(
//       corporateForm.docPhotoID,
//       "BusinessAcra"
//     );
//     const selfie = appendFilesWithFolder(
//       corporateForm.docSelfie,
//       "CompanySelfiePhoto"
//     );
//     const directorIC = appendFilesWithFolder(
//       corporateForm.docDirectorIC,
//       "ICWithDirector"
//     );
//     const acra = appendFilesWithFolder(corporateForm.docAcra, "BusinessAcra");

//     allUploadPromises = [
//       ...accountOpening.uploadPromises,
//       ...photoID.uploadPromises,
//       ...selfie.uploadPromises,
//       ...directorIC.uploadPromises,
//       ...acra.uploadPromises,
//     ];

//     fileNames = {
//       docAccOpening: accountOpening.fileNames.join(","),
//       docPhotoID: photoID.fileNames.join(","),
//       docSelfie: selfie.fileNames.join(","),
//       docDirectorIC: directorIC.fileNames.join(","),
//       docAcra: acra.fileNames.join(","),
//     };

//     // **Handle agent-related files if `isAgent` is 'Yes'**
//     if (isAgent.value === "Yes") {
//       const agentBasisAuth = appendFilesWithFolder(
//         corporateForm.agentBasisAuth,
//         "BasisOfAuthority"
//       );
//       allUploadPromises.push(...agentBasisAuth.uploadPromises);
//       fileNames.agentBasisAuth = agentBasisAuth.fileNames.join(",");
//     }
//   } else if (selectedCustomerType.value === "Natural Person") {
//     const ic = appendFilesWithFolder(individualForm.docIC, "ICOfCustomer");
//     const selfie = appendFilesWithFolder(
//       individualForm.docSelfie,
//       "NaturalSelfiePhoto"
//     );
//     const card = appendFilesWithFolder(
//       individualForm.docCard,
//       "BusinessNameCard"
//     );
//     const kyc = appendFilesWithFolder(individualForm.docKYC, "KYCForm");

//     allUploadPromises = [
//       ...ic.uploadPromises,
//       ...selfie.uploadPromises,
//       ...card.uploadPromises,
//       ...kyc.uploadPromises,
//     ];

//     fileNames = {
//       docIC: ic.fileNames.join(","),
//       docSelfie: selfie.fileNames.join(","),
//       docCard: card.fileNames.join(","),
//       docKYC: kyc.fileNames.join(","),
//     };

//     // **Handle agent-related files if `isAgent` is 'Yes'**
//     if (isAgent.value === "Yes") {
//       const agentBasisAuth = appendFilesWithFolder(
//         individualForm.agentBasisAuth,
//         "BasisOfAuthority"
//       );
//       allUploadPromises.push(...agentBasisAuth.uploadPromises);
//       fileNames.agentBasisAuth = agentBasisAuth.fileNames.join(",");
//     }
//   }

//   try {
//     // Upload all files in parallel
//     console.log("Starting file uploads in parallel...");
//     await Promise.all(allUploadPromises);
//     console.log("All files uploaded successfully.");

//     // After file upload completes, proceed with account verification
//     const verificationForm =
//       selectedCustomerType.value === "Corporate & Trading Company"
//         ? { ...corporateForm, ...fileNames }
//         : { ...individualForm, ...fileNames };

//     const verifyResponse = await profileStore.verifyAccount(verificationForm);

//     if (verifyResponse.status === 1) {
//       alertStore.alert("success", "You have submitted successfully.");
//       window.location.href = "/#/profile";

//       console.log("Account verification successful!");
//     } else {
//       alertStore.alert("error", verifyResponse.message);
//       console.error("Account verification failed:", verifyResponse.message);
//     }
//   } catch (error) {
//     console.error("An error occurred:", error);
//   }
// };

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
    corporateForm.operationCountry = newProfileDetails.operationCountry;
    corporateForm.nationality = newProfileDetails.nationality;
    individualForm.surname = newProfileDetails.surname;
    individualForm.givenName = newProfileDetails.givenName;
  },
  { deep: true }
);

// Sync country code with forms
watch(
  () => countryCodeStore.selectedID,
  (newCode) => {
    if (selectedCustomerType.value === "Corporate & Trading Company") {
      corporateForm.telCode = newCode;
    } else if (selectedCustomerType.value === "Natural Person") {
      // individualForm.nationality = newCode;
    }
  }
);

onMounted(async () => {
  await profileStore.getProfileDetail();
  Object.assign(profileDetails, profileStore.profileDetails);
  console.log(profileDetails);
  username.value = getLocalStorageWithExpiry("username");
  corporateForm.username = username.value;
  individualForm.username = username.value;
  selectedCustomerType.value = profileDetails.accountType;
});

const handleCancel = () => {
  router.push({ path: "/profile" });
};
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

.profile .title {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.profile .title .btn-round {
  position: absolute;
  right: 0;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

@media (max-width: 767px) {
  .profile .title .btn-round {
    display: none;
  }
}
</style>
