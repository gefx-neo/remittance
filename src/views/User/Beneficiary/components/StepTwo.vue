<template>
  <div class="second-form" @keydown.enter.prevent="handleNext">
    <fieldset>
      <Input
        v-if="fieldVisibility('bankName')"
        label="Beneficiary's bank name"
        id="bankName"
        v-model="localForm.bankName"
        :error="errors.bankName"
      />

      <Input
        v-if="fieldVisibility('bankAccountNo')"
        label="Beneficiary's bank account number"
        id="bankAccountNo"
        v-model="localForm.bankAccountNo"
        :error="errors.bankAccountNo"
      />

      <Input
        v-if="fieldVisibility('fullName')"
        label="Account holder name"
        id="name"
        v-model="localForm.fullName"
        :error="errors.fullName"
      />

      <InputBeneficiaryCountry
        v-if="fieldVisibility('bankCountry')"
        :label="generateLabel('bankCountry')"
        id="bankCountry"
        v-model:modelValue="localForm.bankCountry"
        :error="errors.bankCountry"
      />

      <Input
        v-if="localForm.bankCountry === 280 && fieldVisibility('bankCountry')"
        label="Other beneficiary's bank country"
        id="otherBankCountry"
        v-model="localForm.otherBankCountry"
        :error="errors.otherBankCountry"
      />

      <Input
        v-if="fieldVisibility('bankAddress')"
        label="Bank address"
        id="bankAddress"
        v-model="localForm.bankAddress"
        :error="errors.bankAddress"
      />

      <Select
        v-if="fieldVisibility('paymentType')"
        label="Payment type"
        id="paymentType"
        v-model="localForm.paymentType"
        :options="paymentTypes"
        :error="errors.paymentType"
        :tooltip="true"
        tooltipText=" <div>1. No preference: The best payment type for the transaction will be recommended.</div>
    <div>2. Local Payment: Domestic payment with lower fees.</div>
    <div>3. Swift SHA (Shared): Sender and beneficiary split bank charges.</div>
    <div>4. Swift BEN (Beneficiary): Beneficiary pays all bank charges.</div>
    <div>5. Swift OUR (US): Sender pays all bank charges, beneficiary gets full amount.</div>"
        :isLongTooltip="true"
      />

      <Input
        v-if="fieldVisibility('swiftCode')"
        label="Bank code / Swift"
        id="swiftCode"
        v-model="localForm.swiftCode"
        :error="errors.swiftCode"
      />

      <Input
        v-if="fieldVisibility('primaryBIC')"
        label="ACH routing number / IBAN no / BSB / ABA / Sort code / Bank code"
        id="primaryBIC"
        v-model="localForm.primaryBIC"
        :error="errors.primaryBIC"
      />

      <Input
        v-if="fieldVisibility('secondaryBIC')"
        label="Branch code"
        id="secondaryBIC"
        v-model="localForm.secondaryBIC"
        :error="errors.secondaryBIC"
      />
    </fieldset>

    <div class="footer">
      <button type="button" @click="handleNext" class="btn-red standard-button">
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
</template>

<script setup>
import { watch, reactive } from "vue";
import { Input, InputBeneficiaryCountry, Select } from "@/components/Form";
import { useValidation } from "@/composables/useValidation";
import { formValidation, fieldMapping } from "./schemas/stepTwoSchema";
import { useAlertStore } from "@/stores/index.js";
import { paymentTypes } from "@/data/data";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["update:modelValue", "nextStep", "prevStep"]);
const { errors, validateForm, clearErrors, scrollToErrors } = useValidation();
const alertStore = useAlertStore();

const localForm = reactive({
  paymentType: props.modelValue.paymentType,
  ...props.modelValue,
});

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      Object.assign(localForm, { ...newVal });
    }
  },
  { immediate: true, deep: true }
);

const handleNext = () => {
  const schema = formValidation(localForm);

  const isValid = validateForm(localForm, schema);

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
    if (newVal.bankCountry !== "OTHERS") {
      delete newVal.otherBankCountry;
    }
    emit("update:modelValue", newVal);
  },
  { deep: true }
);

const fieldVisibility = (field) => {
  const mapping = fieldMapping[localForm.beneficiaryType] || {};
  const currentMapping = mapping[localForm.currency] || {};
  return currentMapping[field]?.include || false;
};

const generateLabel = (fieldName) => {
  const mapping = fieldMapping[localForm.beneficiaryType] || {};
  const currentMapping = mapping[localForm.currency] || {};

  const field = currentMapping[fieldName];
  let baseLabel = "";

  if (fieldName === "bankCountry") {
    baseLabel = "Beneficiary's bank country";
  }

  const isOptional =
    field?.include && (!field.rules || field.rules.length === 0);

  return isOptional ? `${baseLabel} (optional)` : baseLabel;
};

const handleBack = () => {
  emit("prevStep");
};
</script>

<style scoped>
.second-form {
  width: 100%;
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
</style>
