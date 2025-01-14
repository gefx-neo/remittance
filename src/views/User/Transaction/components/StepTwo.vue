<template>
  <div class="second-form" @keydown.enter.prevent="handleNext">
    <fieldset>
      <div class="left-form">
        <!-- Sending Amount Input -->
        <InputAmount
          id="sendingAmount"
          label="Sending amount"
          :modelValue="localForm.sendingAmount"
          :modelCurrency="localForm.sendingCurrency"
          :isSending="true"
          @update:modelValue="updateSendingAmount"
          @update:modelCurrency="updateSendingCurrency"
          :error="errors.sendingAmount"
        />

        <InputAmount
          id="receivingAmount"
          label="Receiving amount"
          :modelValue="localForm.receivingAmount"
          :modelCurrency="localForm.receivingCurrency"
          :isSending="false"
          @update:modelValue="updateReceivingAmount"
          @update:modelCurrency="updateReceivingCurrency"
          :disableDropdown="true"
          :error="errors.receivingAmount"
        />

        <Select
          label="Payment type"
          id="paymentType"
          v-model="localForm.paymentType"
          :options="paymentTypes"
          :error="errors.paymentType"
          :tooltip="true"
          tooltipText="1. No preference: The best payment type for the transaction will be recommended <br/> 2. Local Payment: Domestic payment with lower fees. <br/> 3. Swift SHA (Shared): Sender and beneficiary split bank charges. <br/> 4. Swift BEN (Beneficiary): Beneficiary pays all bank charges. <br/> 5. Swift OUR (US): Sender pays all bank charges, beneficiary gets full amount.
"
        />

        <Select
          label="GEFX banks"
          id="gefxBank"
          v-model="localForm.gefxBank"
          :options="gefxBanks"
          :error="errors.gefxBank"
          submitKey="id"
        />
      </div>
      <div class="right-form">
        <TransactionSummary
          :sendingAmount="localForm.sendingAmount"
          :sendingCurrency="localForm.sendingCurrency"
          :receivingAmount="localForm.receivingAmount"
          :receivingCurrency="localForm.receivingCurrency"
          :fee="transactionStore.fee"
          :rate="transactionStore.rate"
        />

        <div class="footer">
          <ButtonAPI
            type="button"
            :disabled="isProcessing || store.isMoneyLoading"
            @click="handleNext"
            class="btn-red standard-button"
          >
            Next
          </ButtonAPI>
          <button
            type="button"
            @click="handleBack"
            class="btn-back standard-button"
          >
            Back
          </button>
        </div>
      </div>
    </fieldset>
  </div>
</template>

<script setup>
import TransactionSummary from "./TransactionSummary.vue";
import { onMounted, ref, reactive, watch, defineProps, defineEmits } from "vue";
import { InputAmount, Select, ButtonAPI } from "@/components/Form";
import { paymentTypes, gefxBanks } from "@/data/data";
import { useValidation } from "@/composables/useValidation";
import { formValidation, currencySchema } from "./schemas/stepTwoSchema";
import {
  useStore,
  useAlertStore,
  useBeneficiaryStore,
  useTransactionStore,
} from "@/stores/index.js";
import { useRoute, useRouter } from "vue-router";
import { decryptQueryParams } from "@/services/encryptionService";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  beneficiaries: {
    type: Array,
    default: () => [], // Default to an empty array
  },
  selectedBeneficiary: Object,
  isFromBeneficiaryDetail: {
    type: Boolean,
    default: false, // Default to false if not passed
  },
});
const emit = defineEmits(["update:modelValue", "nextStep", "prevStep"]);
const {
  errors,
  validateForm,
  validateSendingAmount,
  validateReceivingAmount,
  scrollToErrors,
} = useValidation();
const route = useRoute();
const router = useRouter();

const store = useStore();
const alertStore = useAlertStore();
const beneficiaryStore = useBeneficiaryStore();
const transactionStore = useTransactionStore();

const localForm = reactive({
  selectedBeneficiary: beneficiaryStore.selectedBeneficiary || null,
  sendingAmount: props.modelValue.sendingAmount || 0,
  receivingAmount: props.modelValue.receivingAmount || 0,
  paymentType: props.modelValue.paymentType,
  gefxBank: props.modelValue.gefxBank,
  ...props.modelValue,
});

watch(
  () => [
    localForm.sendingAmount,
    localForm.receivingAmount,
    localForm.sendingCurrency,
    localForm.receivingCurrency,
  ],
  ([
    newSendingAmount,
    newReceivingAmount,
    newSendingCurrency,
    newReceivingCurrency,
  ]) => {
    // Validate sending amount
    validateSendingAmount(
      newSendingAmount,
      newSendingCurrency,
      currencySchema,
      "sending"
    );

    // Validate receiving amount
    validateReceivingAmount(
      newReceivingAmount,
      newReceivingCurrency,
      currencySchema,
      "receiving"
    );
  },
  { immediate: false }
);

const handleNext = () => {
  const schema = formValidation(localForm);

  const isValid = validateForm(localForm, schema);
  console.log("Validation Errors:", errors);

  if (isValid) {
    emit("nextStep");
  } else {
    alertStore.alert("error", "Please fill in all the required inputs.");
    scrollToErrors();
  }
};

watch(
  localForm,
  (newVal) => {
    if (JSON.stringify(newVal) !== JSON.stringify(props.modelValue)) {
      emit("update:modelValue", { ...newVal });
    }
  },
  { deep: true }
);
onMounted(() => {
  // Retrieve encrypted data from the route query
  const encryptedData = route.query.data;

  if (encryptedData) {
    try {
      // Decrypt the data
      const decryptedData = decryptQueryParams(encryptedData);

      // Check if decrypted data is valid
      if (decryptedData) {
        // Update localForm with decrypted values
        Object.assign(localForm, {
          sendingAmount: parseFloat(decryptedData.sendingAmount) || 0,
          sendingCurrency:
            route.query.sendingCurrency ||
            decryptedData.sendingCurrency ||
            localForm.sendingCurrency,
          receivingAmount: parseFloat(decryptedData.receivingAmount) || 0,
          receivingCurrency:
            decryptedData.receivingCurrency || localForm.receivingCurrency,
        });

        console.log(
          "Decrypted data successfully applied to localForm:",
          decryptedData
        );
      } else {
        console.error("Failed to decrypt data: Data is null or invalid.");
      }
    } catch (error) {
      console.error("Error decrypting query data:", error);
    }
  }
});

watch(
  () => route.query,
  (query) => {
    Object.assign(localForm, {
      sendingAmount: parseFloat(query.sendingAmount) || localForm.sendingAmount,
      sendingCurrency: query.sendingCurrency || "SGD",
      receivingAmount:
        parseFloat(query.receivingAmount) || localForm.receivingAmount,
      receivingCurrency: query.currency || localForm.receivingCurrency,
    });
    emit("update:modelValue", { ...localForm });
  },
  { immediate: true, deep: true }
);

const updateSendingAmount = async (amount) => {
  const formattedAmount = parseFloat(amount).toFixed(2);

  if (localForm.sendingAmount === formattedAmount) return;

  localForm.sendingAmount = parseFloat(formattedAmount); // Convert back to number

  try {
    const response = await transactionStore.getLockedAmount(
      localForm.sendingAmount,
      "pay"
    );
    if (response && response.status === 1) {
      localForm.receivingAmount = parseFloat(response.getAmount);
    }
  } catch (error) {
    console.error("Error in updateSendingAmount:", error);
  } finally {
  }
};

const updateReceivingAmount = async (amount) => {
  const formattedAmount = parseFloat(amount).toFixed(2);
  if (localForm.receivingAmount === formattedAmount) return;

  localForm.receivingAmount = parseFloat(formattedAmount); // Convert back to number

  try {
    const response = await transactionStore.getLockedAmount(
      localForm.receivingAmount,
      "get"
    );
    if (response && response.status === 1) {
      localForm.sendingAmount = parseFloat(response.payAmount);
      console.log(typeof localForm.sendingAmount, localForm.sendingAmount); // Should output: "number"
    }
  } catch (error) {
    console.error("Error in updateReceivingAmount:", error);
  } finally {
  }
};

const updateSendingCurrency = async (currency) => {
  if (localForm.sendingCurrency === currency) return;

  localForm.sendingCurrency = currency;

  try {
    const lockedRateResponse = await transactionStore.getLockedRate(
      localForm.sendingCurrency,
      localForm.receivingCurrency
    );
    if (lockedRateResponse && lockedRateResponse.status === 1) {
      if (localForm.sendingAmount) {
        const response = await transactionStore.getLockedAmount(
          localForm.sendingAmount,
          "pay"
        );
        if (response && response.status === 1) {
          localForm.receivingAmount = parseFloat(response.getAmount);
        }
      }
    }
  } catch (error) {
    console.error("Failed to update sending currency:", error);
  } finally {
  }
};

const updateReceivingCurrency = async (currency) => {
  if (localForm.receivingCurrency === currency) return;

  localForm.receivingCurrency = currency;

  try {
    const lockedRateResponse = await transactionStore.getLockedRate(
      localForm.sendingCurrency,
      localForm.receivingCurrency
    );
    if (lockedRateResponse && lockedRateResponse.status === 1) {
      if (localForm.receivingAmount) {
        const response = await transactionStore.getLockedAmount(
          localForm.receivingAmount,
          "get"
        );
        if (response && response.status === 1) {
          localForm.sendingAmount = parseFloat(response.payAmount);
        }
      }
    }
  } catch (error) {
    console.error("Failed to update receiving currency:", error);
  } finally {
  }
};

// If no transaction store, then call getLockedRate API to get memoId, fee and rate
onMounted(async () => {
  const transactionData = localStorage.getItem("transaction");

  if (!transactionData) {
    try {
      const lockedRateResponse = await transactionStore.getLockedRate(
        localForm.sendingCurrency,
        localForm.receivingCurrency
      );

      if (lockedRateResponse && lockedRateResponse.status === 1) {
        console.log("Locked rate fetched successfully:", lockedRateResponse);
      }
    } catch (error) {
      console.error("Error fetching locked rate:", error);
    }
  } else {
    console.log(
      "Transaction exists in localStorage. Skipping locked rate fetch."
    );
  }
});

// This is to track when user enters Amount on Step2 and goes back to
// Step1 to change beneficiary to different currency to reupdate the amount
const isFromDashboard =
  route.query.data &&
  decryptQueryParams(route.query.data)?.fromDashboard === "true";

const isProcessing = ref(false);

watch(
  () => localForm.receivingCurrency,
  async (newCurrency, oldCurrency) => {
    if (newCurrency !== oldCurrency && !isFromDashboard) {
      console.log(
        "Beneficiary's currency changed, updating amounts and rates."
      );
      isProcessing.value = true;
      try {
        await transactionStore.getLockedRate(
          localForm.sendingCurrency,
          newCurrency
        );

        await new Promise((resolve) => setTimeout(resolve, 500));

        const response = await transactionStore.getLockedAmount(
          localForm.sendingAmount,
          "pay"
        );
        if (response && response.status === 1) {
          localForm.receivingAmount = parseFloat(response.getAmount);
        }
      } catch (error) {
        console.error("Error updating rates and amounts:", error);
      } finally {
        isProcessing.value = false;
      }
    }
  }
);

const handleBack = () => {
  emit("prevStep");
};

// *** Maintain beneficiary state at StepTwo and StepThree ***
onMounted(async () => {
  beneficiaryStore.setSelectedBeneficiary(localForm.selectedBeneficiary);
});

watch(
  () => localForm.sendingCurrency,
  (newCurrency) => {
    console.log("Sending Currency Updated:", newCurrency);
    // Update the query parameter without reloading the page
    router.replace({
      query: {
        ...route.query,
        sendingCurrency: newCurrency,
      },
    });
  }
);
</script>

<style scoped>
@import "@/assets/dashboard.css";

.second-form {
  width: 100%;
  max-width: 900px;
}

.second-form fieldset {
  display: flex;
  justify-content: space-between;
}

.second-form .left-form,
.second-form .right-form {
  width: 400px;
  max-width: 400px;
}

.second-form .footer {
  display: flex;
  flex-direction: column;
  gap: var(--size-12);
}

.form-group {
  margin-bottom: var(--size-24);
}

@media (max-width: 1023px) {
  .second-form {
    max-width: 400px;
  }

  .second-form fieldset {
    flex-direction: column;
  }

  .second-form .left-form,
  .second-form .right-form {
    width: 100%;
    max-width: 400px;
  }
}
</style>
