<template>
  <div class="second-form" @keydown.enter.prevent="handleNext">
    <fieldset>
      <Input
        label="Beneficiary's bank name"
        id="bankName"
        v-model="localForm.bankName"
        :error="errors.bankName"
      />

      <Input
        label="Beneficiary's bank account number"
        id="bankAccountNo"
        v-model="localForm.bankAccountNo"
        :error="errors.bankAccountNo"
      />

      <InputCountry
        label="Beneficiary's bank country"
        id="bankCountry"
        v-model:modelCountry="localForm.bankCountry"
        :showOthers="true"
        :error="errors.bankCountry"
      />

      <Input
        v-if="localForm.bankCountry === 'OTHERS'"
        label="Other beneficiary's bank country"
        id="otherBankCountry"
        v-model="localForm.otherBankCountry"
        :error="errors.otherBankCountry"
      />

      <Input
        label="Bank address"
        id="bankAddress"
        v-model="localForm.bankAddress"
        :error="errors.bankAddress"
      />

      <Input
        label="Bank code / Swift"
        id="swiftCode"
        v-model="localForm.swiftCode"
        :error="errors.swiftCode"
      />

      <Input
        label="ACH routing number / IBAN no / BSB / ABA / Sort code / Bank code"
        id="primaryBIC"
        v-model="localForm.primaryBIC"
        :error="errors.primaryBIC"
      />

      <Input
        label="Branch code"
        id="branchCode"
        v-model="localForm.branchCode"
        :error="errors.branchCode"
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
import { watch, toRef } from "vue";
import { Input, InputCountry } from "@/components/Form";
import { useValidation } from "@/composables/useValidation";
import { formValidation } from "./schemas/stepTwoSchema";
import { useAlertStore } from "@/stores/alertStore";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["update:modelValue", "nextStep", "prevStep"]);
const { errors, validateForm, clearErrors, scrollToErrors } = useValidation();
const alertStore = useAlertStore();

const localForm = toRef(props, "modelValue");

const handleNext = () => {
  const form = localForm.value;
  const schema = formValidation(form);

  const isValid = validateForm(form, schema);
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
    if (newVal.bankCountry !== "OTHERS") {
      delete newVal.otherBankCountry;
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
