<template>
  <div class="content-area">
    <div class="profile">
      <div class="title">
        <h3>Add Beneficiary</h3>
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
        />
        <StepTwo
          v-if="stepStore.currentStep === 2"
          v-model="form"
          @nextStep="nextStep"
          @prevStep="prevStep"
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
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useBeneficiaryStore } from "@/stores/beneficiaryStore";
import { useStepStore } from "@/stores/stepStore";
import StepOne from "./components/StepOne.vue";
import StepTwo from "./components/StepTwo.vue";
import StepThree from "./components/StepThree.vue";
import { getLocalStorageWithExpiry } from "@/services/localStorageService.js";
import { useValidation } from "@/composables/useValidation";
import { useRouter } from "vue-router";

const router = useRouter();
const beneficiaryStore = useBeneficiaryStore();
const stepStore = useStepStore();
const { scrollToTop } = useValidation();

const username = ref("");
const form = ref({});

const handleSubmit = async () => {
  form.value.username = username.value;

  let allUploadPromises = [];
  let fileNames = {};

  // Only perform file upload if beneficiaryType === 0
  if (form.value.beneficiaryType === 0) {
    // Helper function to upload a single file
    const uploadFile = async (file) => {
      const formData = new FormData();
      formData.append("file", file); // Add the file to FormData

      // Log the time before the upload starts
      const fileStartTime = new Date();
      console.log(
        `Uploading ${
          file.name
        } started at: ${fileStartTime.toLocaleTimeString()}`
      );

      // Upload the file
      await beneficiaryStore.uploadFiles(formData);

      // Log the time after the upload finishes
      const fileEndTime = new Date();
      console.log(
        `Finished uploading ${
          file.name
        } at: ${fileEndTime.toLocaleTimeString()}`
      );
      console.log(
        `Time taken to upload ${file.name}: ${
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
          fileNames.push(file.name); // Collect file names
        });
      } else if (files) {
        uploadPromises.push(uploadFile(files[0])); // Single file upload
        fileNames.push(files[0].name); // Collect file name
      }

      return { uploadPromises, fileNames };
    };

    // Prepare files for upload
    const ic = prepareFileUploads(form.value.docIC);

    // Collect all promises
    allUploadPromises = [...ic.uploadPromises];

    // Collect file names
    fileNames = {
      docIC: ic.fileNames.join(","),
    };
  }

  try {
    // Await all upload promises (if any)
    await Promise.all(allUploadPromises);

    console.log(
      "Form value after file uploads:",
      JSON.stringify(form.value, null, 2)
    );

    // After successful uploads, add the beneficiary
    const beneficiaryForm = {
      username: form.value.username,
      ...form.value,
      ...fileNames,
    };
    const response = await beneficiaryStore.addBeneficiary(beneficiaryForm);

    if (response.status === 1) {
      console.log("Beneficiary added successfully:", response);
      router.push({ path: "/beneficiary" });
    } else {
      console.error("Error adding beneficiary:", response.message);
    }
  } catch (error) {
    console.error("Error during file upload or beneficiary addition:", error);
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

onMounted(() => {
  stepStore.setSteps(["Particulars", "Bank", "Payment"]);
  stepStore.setCurrentStep(1);
  username.value = getLocalStorageWithExpiry("username");
  form.value.username = username.value;
});

const handleCancel = () => {
  router.push({ path: "/beneficiary" });
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
