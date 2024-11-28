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
      <button type="button" @click="handleSubmit">Submit</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore, useStepStore } from "@/stores/index.js";
import StepOne from "./components/StepOne.vue";
import StepTwo from "./components/StepTwo.vue";
import StepThree from "./components/StepThree.vue";
import { useValidation } from "@/composables/useValidation";
import { useRouter } from "vue-router";
const router = useRouter();
const authStore = useAuthStore();
const stepStore = useStepStore();
const { scrollToTop } = useValidation();

const form = ref({});
const handleSubmit = () => {
  form.value.username = authStore.username;
  console.log(form.value.username);
  // Logic for submitting form data
  const transactionForm = {
    username: form.value.username,
    ...form.value,
  };
  console.log(transactionForm);
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
  stepStore.setSteps(["Beneficiary", "Amount", "Final"]);
  stepStore.setCurrentStep(1);
});

const handleCancel = () => {
  router.push({ path: "/transaction" });
};
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
