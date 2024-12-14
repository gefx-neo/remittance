<template>
  <div class="second-form" @keydown.enter.prevent="handleNext">
    <fieldset>
      <div class="left-form">
        <InputAmount
          id="sendingAmount"
          label="Sending amount"
          v-model:modelValue="localForm.sendingAmount"
          :modelCurrency="localForm.sendingCurrency"
          :isSending="true"
          @update:modelValue="(value) => (localForm.sendingAmount = value)"
          @update:modelCurrency="
            (currency) => (localForm.sendingCurrency = currency)
          "
        />

        <InputAmount
          id="receivingAmount"
          label="Receiving amount"
          :modelValue="localForm.receivingAmount"
          :modelCurrency="localForm.receivingCurrency"
          :isSending="false"
          :disableDropdown="
            !!route.query.currency || localForm.selectedBeneficiary.currency
          "
          @update:modelValue="(value) => (localForm.receivingAmount = value)"
          @update:modelCurrency="
            (currency) => (localForm.receivingCurrency = currency)
          "
        />
        <div>
          {{ localForm.selectedBeneficiary?.beneName || "" }}
        </div>

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
        />
      </div>
      <div class="right-form">
        <TransactionSummary
          :sendingAmount="localForm.sendingAmount"
          :sendingCurrency="localForm.sendingCurrency"
          :receivingAmount="localForm.receivingAmount"
          :receivingCurrency="localForm.receivingCurrency"
          processingFees="8 SGD"
          exchangeRate="1 SGD = 0.7424 USD"
          totalPayment="2,000 SGD"
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
import { formValidation } from "./schemas/stepOneSchema";
import { useAlertStore, useBeneficiaryStore } from "@/stores/index.js";
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
});
const emit = defineEmits(["update:modelValue", "nextStep", "prevStep"]);
const { errors, validateForm, clearErrors, scrollToErrors } = useValidation();
const route = useRoute();
const router = useRouter();

const alertStore = useAlertStore();
const beneficiaryStore = useBeneficiaryStore();

const localForm = reactive({
  selectedBeneficiary: beneficiaryStore.selectedBeneficiary || null,
  sendingAmount: props.modelValue.sendingAmount,
  paymentType: props.modelValue.paymentType,
  gefxBank: props.modelValue.gefxBank ?? "dbs_sgd",
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
      sendingAmount: Number(query.sendingAmount) || localForm.sendingAmount,
      sendingCurrency: query.sendingCurrency || "SGD",
      receivingAmount:
        Number(query.receivingAmount) || localForm.receivingAmount,
      receivingCurrency: query.currency,
    });
    emit("update:modelValue", { ...localForm });
  },
  { immediate: true, deep: true }
);

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

onMounted(async () => {
  await nextTick(); // Wait for the router to fully update the query params
  const query = route.query;
  console.log("local form sending", localForm.sendingAmount);

  const hasAllQueryParams = query.beneName && query.currency;

  if (hasAllQueryParams) {
    Object.assign(localForm, {
      selectedBeneficiary: {
        beneName: query.beneName,
        currency: query.currency,
      },
    });

    emit("update:modelValue", { ...localForm });
    console.log("Initialized StepTwo with updated query parameters.");
  } else {
    console.log("Required query parameters are missing.");
  }
});

watch(
  () => route.query,
  (query) => {
    const hasAllQueryParams = query.beneName && query.currency;

    if (hasAllQueryParams) {
      Object.assign(localForm, {
        selectedBeneficiary: {
          beneName: query.beneName,
          currency: query.currency,
        },
      });

      emit("update:modelValue", { ...localForm });
      console.log("Updated StepTwo with new query parameters.");
    }
  },
  { immediate: true }
);

watch(
  () => localForm.sendingAmount,
  (newValue) => {
    console.log("sendingAmount updated:", newValue);
  }
);

watch(
  () => props.modelValue,
  (newVal) => {
    Object.assign(localForm, newVal); // Sync localForm with the updated props
    if (localForm.selectedBeneficiary) {
      console.log(
        "Updated Selected Beneficiary in StepTwo:",
        localForm.selectedBeneficiary
      );
    }
  },
  { immediate: true, deep: true }
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
