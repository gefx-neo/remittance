<template>
  <div class="second-form" @keydown.enter.prevent="handleNext">
    <fieldset>
      <div class="left-form">
        <InputAmount
          id="sendingAmount"
          label="Sending amount"
          :modelValue="localForm.sendingAmount ?? 0"
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
          :modelValue="localForm.receivingAmount ?? 0"
          :modelCurrency="localForm.receivingCurrency"
          :isSending="false"
          :disableDropdown="
            !!route.query.receivingCurrency ||
            !!route.query.currency ||
            localForm.selectedBeneficiary.currency
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
import { onMounted, reactive, watch, defineProps, defineEmits } from "vue";
import { InputAmount, Select } from "@/components/Form";
import { paymentTypes, gefxBanks } from "@/data/data";
import { useValidation } from "@/composables/useValidation";
import { formValidation } from "./schemas/stepOneSchema";
import { useAlertStore, useBeneficiaryStore } from "@/stores/index.js";
import { useRoute } from "vue-router";

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
const alertStore = useAlertStore();
const beneficiaryStore = useBeneficiaryStore();

const localForm = reactive({
  selectedBeneficiary: beneficiaryStore.selectedBeneficiary || null,
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
      sendingAmount: Number(query.sendingAmount) || 0,
      sendingCurrency: query.sendingCurrency || "SGD",
      receivingAmount: Number(query.receivingAmount) || 0,
      receivingCurrency:
        query.currency || localForm.selectedBeneficiary?.currency,
    });
    emit("update:modelValue", { ...localForm });
  },
  { immediate: true, deep: true }
);

watch(
  () => props.modelValue,
  (newVal) => {
    Object.assign(localForm, newVal);
    if (localForm.selectedBeneficiary) {
      console.log(
        "Updated Selected Beneficiary in StepTwo:",
        localForm.selectedBeneficiary
      );
    }
  },
  { immediate: true }
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

onMounted(() => {
  const query = route.query;

  // Check for required query parameters
  const hasAllQueryParams =
    query.sendingAmount &&
    query.sendingCurrency &&
    query.receivingAmount &&
    query.receivingCurrency &&
    query.beneName &&
    query.currency;

  if (hasAllQueryParams) {
    // Initialize form values from the query
    Object.assign(localForm, {
      sendingAmount: Number(query.sendingAmount),
      sendingCurrency: query.sendingCurrency,
      receivingAmount: Number(query.receivingAmount),
      receivingCurrency: query.receivingCurrency,
      selectedBeneficiary: {
        beneName: query.beneName,
        currency: query.currency,
      },
    });

    // Emit the form model to parent
    emit("update:modelValue", { ...localForm });
    console.log("Navigated directly to Step 2 with query parameters.");
  } else {
    console.log("Required query parameters are missing. Default behavior.");
  }
});

watch(
  () => props.modelValue,
  (newVal) => {
    Object.assign(localForm, newVal);
    if (localForm.selectedBeneficiary) {
      console.log(
        "Selected Beneficiary in StepTwo after update:",
        localForm.selectedBeneficiary
      );
    }
  },
  { immediate: true, deep: true }
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
