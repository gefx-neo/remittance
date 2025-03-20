<template>
  <div class="third-form" @keydown.enter.prevent="handleSubmit">
    <fieldset>
      <TextArea
        label="Payment details"
        id="paymentDetail"
        v-model="localForm.paymentDetail"
        :error="errors.paymentDetail"
      />

      <Input
        v-if="fieldVisibility('rel')"
        label="Purpose of account relationship/transaction"
        id="rel"
        v-model="localForm.rel"
        :error="errors.rel"
      />

      <Select
        v-if="fieldVisibility('purposeOfIntendedTransactions')"
        label="Purpose of intended transactions"
        id="purposeOfIntendedTransactions"
        v-model="localForm.purposeOfIntendedTransactions"
        :options="purposeOfIntendedTransactions"
        :error="errors.purposeOfIntendedTransactions"
        submitKey="id"
      />

      <Input
        v-if="localForm.purposeOfIntendedTransactions === 52"
        label="Other purpose of intended transactions"
        id="otherPurposeOfIntendedTransactions"
        v-model="localForm.otherPurposeOfIntendedTransactions"
        :error="errors.otherPurposeOfIntendedTransactions"
      />

      <Select
        v-if="fieldVisibility('fundSource')"
        label="Source of funds"
        id="fundSource"
        v-model="localForm.fundSource"
        :options="fundSource"
        :error="errors.fundSource"
        submitKey="id"
      />

      <Input
        v-if="localForm.fundSource === 20"
        label="Other source of funds"
        id="otherFundSource"
        v-model="localForm.otherFundSource"
        :error="errors.otherFundSource"
      />
    </fieldset>

    <div class="footer">
      <ButtonAPI
        :disabled="isLoading"
        type="button"
        class="btn-red standard-button"
        @click="handleSubmit"
      >
        Submit
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
</template>

<script setup>
import { watch, reactive } from "vue";
import { Input, Select, TextArea, ButtonAPI } from "@/components/Form";
import { purposeOfIntendedTransactions, fundSource } from "@/data/data";
import { useValidation } from "@/composables/useValidation";
import { formValidation, fieldMapping } from "./schemas/stepThreeSchema";
import { useAlertStore } from "@/stores/index.js";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["update:modelValue", "submit", "prevStep"]);
const { errors, validateForm, clearErrors, scrollToErrors } = useValidation();
const alertStore = useAlertStore();

const localForm = reactive({
  purposeOfIntendedTransactions: props.modelValue.purposeOfIntendedTransactions,
  fundSource: props.modelValue.fundSource,
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

const handleSubmit = () => {
  const schema = formValidation(localForm);

  const isValid = validateForm(localForm, schema);

  if (isValid) {
    emit("submit");
  } else {
    alertStore.alert("error", "Please fill in all the required inputs.");
    scrollToErrors();
  }
};

watch(
  localForm,
  (newVal) => {
    if (newVal.purposeOfIntendedTransactions !== 52) {
      delete newVal.otherPurposeOfIntendedTransactions;
    }
    if (newVal.fundSource !== 20) {
      delete newVal.otherFundSource;
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

const handleBack = () => {
  emit("prevStep");
};
</script>

<style scoped>
.third-form {
  width: 100%;
  max-width: 400px;
}

.third-form .footer {
  display: flex;
  flex-direction: column;
  gap: var(--size-12);
}

.form-group {
  margin-bottom: var(--size-24);
}
</style>
