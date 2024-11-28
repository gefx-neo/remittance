<template>
  <div class="third-form" @keydown.enter.prevent="handleSubmit">
    <fieldset>
      <Input
        label="Payment details / instructions"
        id="paymentDetail"
        v-model="localForm.paymentDetail"
        :error="errors.paymentDetail"
      />

      <Input
        label="Purpose and intended nature of account relationship and/or relevant business transaction undertaken"
        id="rel"
        v-model="localForm.rel"
        :error="errors.rel"
      />

      <Select
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
      <button
        type="button"
        @click="handleSubmit"
        class="btn-red standard-button"
      >
        Submit
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
import { Input, Select } from "@/components/Form";
import { purposeOfIntendedTransactions, fundSource } from "@/data/data";
import { useValidation } from "@/composables/useValidation";
import { formValidation } from "./schemas/stepThreeSchema";
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
  purposeOfIntendedTransactions:
    props.modelValue.purposeOfIntendedTransactions ?? 1,
  fundSource: props.modelValue.fundSource ?? 1,
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
  console.log("Validation Errors:", errors);

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
