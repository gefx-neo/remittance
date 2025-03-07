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
import {
  useAlertStore,
  useAuthStore,
  useBeneficiaryStore,
  useStepStore,
} from "@/stores/index.js";
import StepOne from "./components/StepOne.vue";
import StepTwo from "./components/StepTwo.vue";
import StepThree from "./components/StepThree.vue";
import { useValidation } from "@/composables/useValidation";
import { useRouter } from "vue-router";

const router = useRouter();
const beneficiaryStore = useBeneficiaryStore();
const stepStore = useStepStore();
const alertStore = useAlertStore();
const authStore = useAuthStore();
const { scrollToTop } = useValidation();
const redirectParams = ref(null);

const form = ref({});

const handleSubmit = async () => {
  form.value.username = authStore.username;

  let allUploadPromises = [];
  let fileNames = {};

  // Only perform file upload if beneficiaryType === 0
  if (form.value.beneficiaryType === 0) {
    // Helper function to generate a random string
    const generateRandomString = (length) => {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
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
      await beneficiaryStore.uploadFiles(formData);

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
      alertStore.alert("success", "You have added a new beneficiary");
      // Redirect back to the original route if specified
      if (redirectParams.value) {
        const { redirectTo } = redirectParams.value;
        if (redirectTo === "addtransaction") {
          router.push({ path: "/transaction/addtransaction" });
          return;
        }
      }

      // Default fallback redirection
      window.location.href = "/#/beneficiary";
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
});

onMounted(() => {
  const { from, redirectTo } = router.currentRoute.value.query;
  if (from && redirectTo) {
    redirectParams.value = { from, redirectTo };
  }
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
  min-height: calc(100vh - 140.79px);
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
