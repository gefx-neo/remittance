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
          :error="errors.receivingAmount"
          :disableDropdown="isFromBeneficiaryDetail"
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
            :disabled="store.isMoneyLoading"
            @click="handleNext"
            class="btn-red standard-button"
          >
            Next
          </ButtonAPI>
          <button
            type="button"
            @click="handleCancel"
            class="btn-back standard-button"
          >
            Cancel
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
import { formValidation, currencySchema } from "./schemas/stepOneSchema";
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

onMounted(async () => {
  const query = route.query;

  Object.assign(localForm, {
    sendingAmount: transactionStore.sendingAmount,
    sendingCurrency: transactionStore.sendingCurrency,
    receivingAmount: transactionStore.receivingAmount,
    receivingCurrency: query.currency || transactionStore.receivingCurrency,
  });
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

watch(
  localForm,
  (newVal) => {
    if (JSON.stringify(newVal) !== JSON.stringify(props.modelValue)) {
      emit("update:modelValue", { ...newVal });
    }
  },
  { deep: true }
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
      transactionStore.setTransactionData({
        sendingAmount: localForm.sendingAmount,
        sendingCurrency: localForm.sendingCurrency,
        receivingAmount: localForm.receivingAmount,
        receivingCurrency: localForm.receivingCurrency,
      });
    }
  } catch (error) {
    alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
  } finally {
    validateSendingAmount(
      localForm.sendingAmount,
      localForm.sendingCurrency,
      currencySchema,
      "sending"
    );
    validateReceivingAmount(
      localForm.receivingAmount,
      localForm.receivingCurrency,
      currencySchema,
      "receiving"
    );
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
      localForm.sendingAmount = parseFloat(
        response.payAmount - transactionStore.fee
      );
      transactionStore.setTransactionData({
        sendingAmount: localForm.sendingAmount,
        sendingCurrency: localForm.sendingCurrency,
        receivingAmount: localForm.receivingAmount,
        receivingCurrency: localForm.receivingCurrency,
      });
    }
  } catch (error) {
    alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
  } finally {
    validateSendingAmount(
      localForm.sendingAmount,
      localForm.sendingCurrency,
      currencySchema,
      "sending"
    );
    validateReceivingAmount(
      localForm.receivingAmount,
      localForm.receivingCurrency,
      currencySchema,
      "receiving"
    );
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
          transactionStore.setTransactionData({
            sendingAmount: localForm.sendingAmount,
            sendingCurrency: localForm.sendingCurrency,
            receivingAmount: localForm.receivingAmount,
            receivingCurrency: localForm.receivingCurrency,
          });
        }
      }
    }
  } catch (error) {
    alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
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
      if (localForm.sendingAmount) {
        const response = await transactionStore.getLockedAmount(
          localForm.sendingAmount,
          "pay"
        );
        if (response && response.status === 1) {
          localForm.receivingAmount = parseFloat(response.getAmount);
          transactionStore.setTransactionData({
            sendingAmount: localForm.sendingAmount,
            sendingCurrency: localForm.sendingCurrency,
            receivingAmount: localForm.receivingAmount,
            receivingCurrency: localForm.receivingCurrency,
          });
        }
      }
    }
  } catch (error) {
    alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
  }
};

const handleCancel = () => {
  router.push({ path: "/dashboard" });
};
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
