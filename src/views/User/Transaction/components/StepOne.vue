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
          @update:modelValue="updateSendingAmount"
          @update:modelCurrency="updateSendingCurrency"
          :isSending="true"
          :error="errors.sendingAmount"
        />

        <InputAmount
          id="receivingAmount"
          label="Receiving amount"
          :modelValue="localForm.receivingAmount"
          :modelCurrency="localForm.receivingCurrency"
          @update:modelValue="updateReceivingAmount"
          @update:modelCurrency="updateReceivingCurrency"
          :isSending="false"
          :error="errors.receivingAmount"
          :disableDropdown="isFromBeneficiaryDetail"
        />

        <Select
          label="Payment type"
          id="paymentType"
          v-model="localForm.paymentType"
          :options="availablePaymentTypes"
          :error="errors.paymentType"
          :tooltip="true"
          :isLongTooltip="true"
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
            :disabled="isLocking"
            :loading="isLocking"
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
import {
  onMounted,
  ref,
  reactive,
  computed,
  watch,
  nextTick,
  defineProps,
  defineEmits,
} from "vue";
import { InputAmount, Select, ButtonAPI } from "@/components/Form";
import { paymentTypes, gefxBanks, standardFees } from "@/data/data";
import { useValidation } from "@/composables/useValidation";
import { formValidation, currencySchema } from "./schemas/stepOneSchema";
import {
  useStore,
  useAlertStore,
  useBeneficiaryStore,
  useTransactionStore,
} from "@/stores/index.js";
import { useRoute, useRouter } from "vue-router";
import { DEFAULT_ERROR_MESSAGE } from "@/services/apiService";

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
  isFromDashboard: { type: Boolean, default: false },
  isFromBeneficiaryDetail: { type: Boolean, default: false },
  isFromTransactionList: { type: Boolean, default: false },
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
  paymentType: props.modelValue.paymentType || transactionStore.paymentType,
  gefxBank: props.modelValue.gefxBank,
  ...props.modelValue,
});

onMounted(async () => {
  const query = route.query;

  // ✅ Initialize localForm from store and query (important step preserved)
  Object.assign(localForm, {
    sendingAmount: transactionStore.sendingAmount || 0,
    sendingCurrency: transactionStore.sendingCurrency || "SGD",
    receivingAmount: transactionStore.receivingAmount || 0,
    receivingCurrency: transactionStore.receivingCurrency || "MYR",
    paymentType: transactionStore.paymentType || "localpayment",
  });

  const { sendingCurrency, receivingCurrency } = localForm;

  // 🟡 Optional debug log
  if (props.isFromDashboard) {
    // console.log("🔁 StepOne: from Dashboard");
  }

  // ✅ From Beneficiary Detail
  if (props.isFromBeneficiaryDetail) {
    const first = sessionStorage.getItem("firstTimeFromBeneficiaryDetail");

    if (!first) {
      shouldAllowLock.value = false;
      sessionStorage.setItem("firstTimeFromBeneficiaryDetail", "true");
      await nextTick();
      await transactionStore.getParticularRate(
        sendingCurrency,
        receivingCurrency
      );
      shouldAllowLock.value = true;
      await performFullLock();
    } else {
      shouldAllowLock.value = true;
    }
  }

  // ✅ From Transaction List
  if (props.isFromTransactionList) {
    const first = sessionStorage.getItem("firstTimeFromTransactionList");

    if (!first) {
      shouldAllowLock.value = false;
      sessionStorage.setItem("firstTimeFromTransactionList", "true");
      await nextTick();
      await transactionStore.getParticularRate(
        sendingCurrency,
        receivingCurrency
      );
      shouldAllowLock.value = true;
      await performFullLock();
    } else {
      shouldAllowLock.value = true;
    }
  }

  if (!localStorage.getItem("transaction") || !transactionStore.memoId) {
    await performFullLock();
  }
});

const handleNext = () => {
  const schema = formValidation(localForm);

  const isValid = validateForm(localForm, schema);
  // console.log("Validation Errors:", errors);

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

const updateSendingAmount = (val) => {
  localForm.sendingAmount = parseFloat(val);
  performFullLock();
};

const updateReceivingAmount = (val) => {
  localForm.receivingAmount = parseFloat(val);
  performFullLock("receiving");
};

const updateSendingCurrency = async (currency) => {
  localForm.sendingCurrency = currency;
  await nextTick();
  await transactionStore.getParticularRate(
    currency,
    localForm.receivingCurrency
  );
  await performFullLock();
};

const updateReceivingCurrency = async (currency) => {
  localForm.receivingCurrency = currency;
  await nextTick();
  await transactionStore.getParticularRate(localForm.sendingCurrency, currency);
  await performFullLock();
};

const isLocking = ref(false); // already defined above
const shouldAllowLock = ref(true); // control gate

const performFullLock = async (direction = "sending") => {
  if (!shouldAllowLock.value) return;

  const {
    sendingAmount,
    sendingCurrency,
    receivingAmount,
    receivingCurrency,
    paymentType,
  } = localForm;

  isLocking.value = true;

  try {
    const amount = direction === "receiving" ? receivingAmount : sendingAmount;

    const result = await transactionStore.getLockedTransaction(
      amount,
      sendingCurrency,
      receivingCurrency,
      paymentType,
      direction
    );
    // result.rate here refers to the rate from getParticularRate
    if (result?.status === 1 && !isNaN(parseFloat(result.rate))) {
      const lockedRate = parseFloat(result.rate);

      localForm.sendingAmount = result.payAmount;
      localForm.receivingAmount = result.getAmount;

      transactionStore.setTransactionData({
        sendingAmount: result.payAmount,
        sendingCurrency,
        receivingAmount: result.getAmount,
        receivingCurrency,
        memoId: result.memoId,
        rate: lockedRate,
        fee: result.fee,
        paymentType,
      });
    } else {
      alertStore.alert("error", "Failed to lock transaction.");
    }
  } catch (err) {
    alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
  } finally {
    isLocking.value = false;
  }
};

watch(
  () => localForm.paymentType,
  (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      performFullLock();
    }
  }
);

const availablePaymentTypes = computed(() => {
  const base = localForm.sendingCurrency;
  const quote = localForm.receivingCurrency;

  const feeObj = standardFees[base]?.[quote];
  if (!feeObj) return [];

  const availableKeys = Object.keys(feeObj);

  const filtered = paymentTypes.filter(
    (type) =>
      type.name !== "No preference" && availableKeys.includes(type.value)
  );

  if (filtered.length > 1) {
    const noPref = paymentTypes.find((type) => type.name === "No preference");
    return [noPref, ...filtered];
  }

  return filtered;
});

const handleCancel = () => {
  router.push({ path: "/dashboard" });
  transactionStore.resetStore();
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
