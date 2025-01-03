<template>
  <div class="content-area">
    <div class="transaction">
      <div class="title">
        <h3>Remittance</h3>
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
          v-model="form"
          @nextStep="nextStep"
          :beneficiaries="beneficiaries"
        />

        <StepTwo
          v-if="stepStore.currentStep === 2"
          v-model="form"
          @nextStep="nextStep"
          @prevStep="prevStep"
          :isFromBeneficiaryDetail="isFromBeneficiaryDetail"
        />
        <StepThree
          v-if="stepStore.currentStep === 3"
          v-model="form"
          @nextStep="nextStep"
          @prevStep="prevStep"
          @submit="handleSubmit"
        />
      </form>
    </div>
  </div>
  <Timer />
</template>

<script setup>
import { ref, onMounted, watch, nextTick, onUnmounted } from "vue";
import {
  useAuthStore,
  useAlertStore,
  useStepStore,
  useBeneficiaryStore,
  useTransactionStore,
} from "@/stores/index.js";
import StepOne from "./components/StepOne.vue";
import StepTwo from "./components/StepTwo.vue";
import StepThree from "./components/StepThree.vue";
import { useValidation } from "@/composables/useValidation";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import Timer from "./components/Timer.vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const alertStore = useAlertStore();
const stepStore = useStepStore();
const beneficiaryStore = useBeneficiaryStore();
const transactionStore = useTransactionStore();

const { scrollToTop } = useValidation();

const form = ref({});
const beneficiaries = ref([]);
const isFromBeneficiaryDetail = ref(
  route.query.fromBeneficiaryDetail === "true"
); // const isFromTransactionList = ref(false);
// const isFromDashboard = ref(false);

const handleSubmit = async () => {
  form.value.username = authStore.username;

  let allUploadPromises = [];
  let fileNames = {};

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

  // Helper function to upload a single file
  const uploadFile = async (file) => {
    const randomString = generateRandomString(5); // Generate a random string of 5 characters
    const newFileName = `${file.name
      .split(".")
      .slice(0, -1)
      .join(".")}_${randomString}.${file.name.split(".").pop()}`;

    const formData = new FormData();
    formData.append("file", file, newFileName); // Add the file to FormData with the new name

    // Log the time before the upload starts
    const fileStartTime = new Date();
    console.log(
      `Uploading ${newFileName} started at: ${fileStartTime.toLocaleTimeString()}`
    );

    // Upload the file
    await transactionStore.uploadFiles(formData);

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
  const prepareFileUploads = (files) => {
    const uploadPromises = [];
    const fileNames = [];

    if (Array.isArray(files)) {
      files.forEach((file) => {
        uploadPromises.push(uploadFile(file));
        const randomString = generateRandomString(5); // Generate a random string of 5 characters
        const newFileName = `${file.name
          .split(".")
          .slice(0, -1)
          .join(".")}_${randomString}.${file.name.split(".").pop()}`;
        fileNames.push(newFileName); // Collect new file names
      });
    } else if (files) {
      uploadPromises.push(uploadFile(files[0])); // Single file upload
      const randomString = generateRandomString(5); // Generate a random string of 5 characters
      const newFileName = `${files[0].name
        .split(".")
        .slice(0, -1)
        .join(".")}_${randomString}.${files[0].name.split(".").pop()}`;
      fileNames.push(newFileName); // Collect new file name
    }

    return { uploadPromises, fileNames };
  };

  // Prepare files for upload
  const file = prepareFileUploads(form.value.beneficiaryUploadSupportingFile);

  // Collect all promises
  allUploadPromises = [...file.uploadPromises];

  // Collect file names
  fileNames = {
    beneficiaryUploadSupportingFile: file.fileNames.join(","),
  };

  try {
    await Promise.all(allUploadPromises);

    console.log(
      "Form value after file uploads:",
      JSON.stringify(form.value, null, 2)
    );

    const {
      selectedBeneficiary,
      sendingAmount,
      sendingCurrency,
      receivingAmount,
      receivingCurrency,
      ...rest
    } = form.value;

    // Explicitly assign the required fields
    const transactionForm = {
      username: form.value.username,
      beneficiaryId: Number(selectedBeneficiary?.id),
      memoId: transactionStore.memoId,
      rate: transactionStore.rate,
      fee: transactionStore.fee,
      payAmount: sendingAmount,
      payCurrency: sendingCurrency,
      getAmount: receivingAmount,
      getCurrency: receivingCurrency,
      contactNo:
        selectedBeneficiary?.accountType === "1"
          ? selectedBeneficiary?.companyContactNo
          : selectedBeneficiary?.contactMobile,
      address1: selectedBeneficiary?.address,
      customerRemarks: form.customerRemarks || "",
      ...rest,
      ...fileNames,
    };

    const response = await transactionStore.addTransaction(transactionForm);

    if (response.status === 1) {
      alertStore.alert("success", "You have added a new transaction");
      window.location.href = "/#/transaction";
    } else {
      console.error("Error adding transaction:", response.message);
    }
  } catch (error) {
    console.error("Error during file upload or transaction addition:", error);
  }
};

const nextStep = () => {
  stepStore.nextStep();
  scrollToTop();
};

const prevStep = () => {
  stepStore.prevStep();
  scrollToTop();
};

// onMounted(async () => {
//   try {
//     // Step 1: Fetch beneficiary list when the component mounts
//     const response = await beneficiaryStore.getBeneficiaryList();
//     beneficiaries.value = response.beneficiaries || [];
//     beneficiaries.value.sort((a, b) => b.isFav - a.isFav);

//     // Step 2: If beneId exists in query, fetch its details on mount
//     const beneId = router.currentRoute.value.query.beneId;
//     if (beneId) {
//       console.log("Fetching details for beneId on mount:", beneId);
//       await fetchBeneficiaryDetail(beneId);
//     }
//   } catch (error) {
//     console.error("Error fetching beneficiary list or details:", error);
//   }
// });

// Watcher to track changes to beneId and fetch details
watch(
  () => router.currentRoute.value.query.beneId,
  async (newBeneId, oldBeneId) => {
    if (newBeneId && newBeneId !== oldBeneId) {
      console.log("Detected beneId change:", newBeneId);
      await fetchBeneficiaryDetail(newBeneId);
    }
  }
);

// When user clicks Send Money from Beneficiary detail

onMounted(async () => {
  try {
    const query = router.currentRoute.value.query;

    // Detect if coming from BeneficiaryDetail.vue
    isFromBeneficiaryDetail.value = query.fromBeneficiaryDetail === "true";

    // Step 1: Fetch Beneficiary List if not already loaded
    if (!beneficiaries.value.length) {
      const response = await beneficiaryStore.getBeneficiaryList();
      beneficiaries.value = response.beneficiaries || [];
      beneficiaries.value.sort((a, b) => b.isFav - a.isFav);
    }

    // Step 2: Fetch Beneficiary Details if beneId is present
    if (query.beneId) {
      await fetchBeneficiaryDetail(query.beneId);
    }

    // Step 3: Preload Locked Rate if entering from BeneficiaryDetail
    if (isFromBeneficiaryDetail.value) {
      const payCurrency = "SGD";
      const getCurrency = query.currency;
      await transactionStore.getLockedRate(payCurrency, getCurrency);

      // Land directly on Step Two
      stepStore.setCurrentStep(2);
      console.log(
        "Landing on Step Two because isFromBeneficiaryDetail is true."
      );
    } else {
    }
  } catch (error) {
    console.error("Error during initialization:", error);
  }
});

// Function to fetch beneficiary details
const fetchBeneficiaryDetail = async (beneId) => {
  try {
    const detailResponse = await beneficiaryStore.getBeneficiaryDetail(beneId);
    if (detailResponse?.beneDetails) {
      const beneDetails = detailResponse.beneDetails;

      // Ensure selectedBeneficiary exists
      if (!form.value.selectedBeneficiary) {
        form.value.selectedBeneficiary = {};
      }

      // Merge beneDetails without overwriting existing values
      Object.keys(beneDetails).forEach((key) => {
        if (
          beneDetails[key] !== null &&
          beneDetails[key] !== "" &&
          form.value.selectedBeneficiary[key] === undefined
        ) {
          form.value.selectedBeneficiary[key] = beneDetails[key];
        }
      });

      // Force Vue reactivity
      form.value.selectedBeneficiary = { ...form.value.selectedBeneficiary };

      // Set to store
      beneficiaryStore.setSelectedBeneficiary(form.value.selectedBeneficiary);

      console.log(
        "Updated selectedBeneficiary:",
        form.value.selectedBeneficiary
      );
    }
  } catch (error) {
    console.error("Error fetching beneficiary details:", error);
  }
};

onMounted(() => {
  const query = router.currentRoute.value.query;

  stepStore.setSteps(["Beneficiary", "Amount", "Final"]);

  nextTick(() => {
    if (query.beneId) {
      stepStore.setCurrentStep(2);
    } else {
      // No query.beneId, force Step 1
      stepStore.setCurrentStep(1);
      console.log("Staying on Step 1 as no query.beneId exists.");
    }
  });
});

// onMounted(() => {
//   const lockedRate = transactionStore.lockedRate; // Access locked rate from the store
//   console.log("Locked Rate:", lockedRate);
// });

const handleCancel = () => {
  router.push({ path: "/dashboard" });
};

onUnmounted(() => {
  localStorage.removeItem("transaction");
  localStorage.removeItem("beneficiary");
  console.log("Local storage cleared on component unmount.");
});
</script>

<style scoped>
.content-area {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.transaction {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100%;
  max-width: 100%;
  gap: var(--size-24);
}

.transaction .title {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.transaction .title .btn-round {
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
  .transaction .title .btn-round {
    display: none;
  }
}
</style>
