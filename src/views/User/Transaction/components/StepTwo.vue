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
          :disableDropdown="localForm.selectedBeneficiary.currency"
          :error="errors.receivingAmount"
        />
        <!-- :disableDropdown="
            !!route.query.currency || localForm.selectedBeneficiary.currency
          " -->
        <!-- <div>
          {{ localForm.selectedBeneficiary?.beneName || "" }}
          {{ localForm.selectedBeneficiary?.id || "" }}
        </div> -->

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
          <button
            type="button"
            @click="handleNext"
            class="btn-red standard-button"
          >
            Next
          </button>
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
import {
  onMounted,
  reactive,
  watch,
  defineProps,
  defineEmits,
  nextTick,
} from "vue";
import { InputAmount, Select } from "@/components/Form";
import { paymentTypes, gefxBanks } from "@/data/data";
import { useValidation } from "@/composables/useValidation";
import { formValidation } from "./schemas/stepTwoSchema";
import {
  useStore,
  useAlertStore,
  useBeneficiaryStore,
  useTransactionStore,
} from "@/stores/index.js";
import { useRoute, useRouter } from "vue-router";

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
});
const emit = defineEmits(["update:modelValue", "nextStep", "prevStep"]);
const { errors, validateForm, clearErrors, scrollToErrors } = useValidation();
const route = useRoute();
const router = useRouter();

const store = useStore();
const alertStore = useAlertStore();
const beneficiaryStore = useBeneficiaryStore();
const transactionStore = useTransactionStore();

const localForm = reactive({
  selectedBeneficiary: beneficiaryStore.selectedBeneficiary || null,
  sendingAmount: props.modelValue.sendingAmount,
  paymentType: props.modelValue.paymentType,
  gefxBank: props.modelValue.gefxBank,
  ...props.modelValue,
});

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

// *** Maintain beneficiary state at StepTwo and StepThree ***
onMounted(async () => {
  beneficiaryStore.setSelectedBeneficiary(localForm.selectedBeneficiary);
});
// *** Maintain beneficiary state at StepTwo and StepThree ***

watch(
  localForm,
  (newVal) => {
    if (JSON.stringify(newVal) !== JSON.stringify(props.modelValue)) {
      emit("update:modelValue", { ...newVal });
    }
  },
  { deep: true }
);

watch(
  () => route.query,
  (query) => {
    Object.assign(localForm, {
      sendingAmount: parseFloat(query.sendingAmount) || localForm.sendingAmount,
      sendingCurrency: query.sendingCurrency || "SGD",
      receivingAmount:
        parseFloat(query.receivingAmount) || localForm.receivingAmount,
      receivingCurrency: query.currency,
    });
    emit("update:modelValue", { ...localForm });
  },
  { immediate: true, deep: true }
);

const updateSendingAmount = async (amount) => {
  const formattedAmount = parseFloat(amount).toFixed(2);

  if (localForm.sendingAmount === formattedAmount) return;

  localForm.sendingAmount = parseFloat(formattedAmount); // Convert back to number
  store.setLoading(true);

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
    store.setLoading(false);
  }
};

// Update receiving amount logic (from Dashboard.vue)
const updateReceivingAmount = async (amount) => {
  const formattedAmount = parseFloat(amount).toFixed(2);
  if (localForm.receivingAmount === formattedAmount) return;

  localForm.receivingAmount = parseFloat(formattedAmount); // Convert back to number
  store.setLoading(true);

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
    store.setLoading(false);
  }
};

// Update sending currency logic (from Dashboard.vue)
const updateSendingCurrency = async (currency) => {
  if (localForm.sendingCurrency === currency) return;

  localForm.sendingCurrency = currency;
  store.setLoading(true);

  try {
    const lockedRateResponse = await transactionStore.getLockedRate(
      localForm.receivingCurrency,
      localForm.sendingCurrency
    );
    if (lockedRateResponse && lockedRateResponse.status === 1) {
      transactionStore.setLockedRate(lockedRateResponse.rate);

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
    store.setLoading(false);
  }
};

// Update receiving currency logic (from Dashboard.vue)
const updateReceivingCurrency = async (currency) => {
  if (localForm.receivingCurrency === currency) return;

  localForm.receivingCurrency = currency;
  store.setLoading(true);

  try {
    const lockedRateResponse = await transactionStore.getLockedRate(
      localForm.receivingCurrency,
      localForm.sendingCurrency
    );
    if (lockedRateResponse && lockedRateResponse.status === 1) {
      transactionStore.setLockedRate(lockedRateResponse.rate);

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
    store.setLoading(false);
  }
};

onMounted(() => {
  if (route.query.sendingAmount) {
    localForm.sendingAmount = parseFloat(route.query.sendingAmount) || 0;
  }
  if (route.query.receivingAmount) {
    localForm.receivingAmount = parseFloat(route.query.receivingAmount) || 0;
  }
  if (route.query.sendingCurrency) {
    localForm.sendingCurrency = route.query.sendingCurrency;
  }
  if (route.query.receivingCurrency) {
    localForm.receivingCurrency = route.query.receivingCurrency;
  }
});

watch(
  () => localForm.receivingCurrency,
  (newCurrency) => {
    console.log("Receiving Currency Updated in Parent:", newCurrency);
  },
  { immediate: true }
);

const handleBack = () => {
  emit("prevStep");
};

watch(
  () => localForm.sendingAmount,
  (newValue) => {
    console.log("sendingAmount updated:", newValue);
  }
);

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
