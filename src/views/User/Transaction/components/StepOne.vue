<template>
  <div class="first-form" @keydown.enter.prevent="handleNext">
    <fieldset>
      <div class="left-form">
        <InputAmount
          id="sendingAmount"
          label="Sending amount"
          :modelValue="localForm.sendingAmount ?? 0"
          :modelCurrency="localForm.sendingCurrency"
          :isSending="true"
          @update:modelValue="localForm.sendingAmount = $event"
          @update:modelCurrency="localForm.sendingCurrency = $event"
        />

        <InputAmount
          id="receivingAmount"
          label="Receiving amount"
          :modelValue="localForm.receivingAmount ?? 0"
          :modelCurrency="localForm.receivingCurrency"
          :isSending="false"
          @update:modelValue="localForm.receivingAmount = $event"
          @update:modelCurrency="localForm.receivingCurrency = $event"
        />

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
import { ref, toRef, watch, defineProps, defineEmits, onMounted } from "vue";
import { InputAmount, Select } from "@/components/Form";
import { paymentTypes, gefxBanks } from "@/data/data";
import { useValidation } from "@/composables/useValidation";
import { formValidation } from "./schemas/stepOneSchema";
import { useAlertStore } from "@/stores/alertStore";
import { useRoute, useRouter } from "vue-router";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["update:modelValue", "nextStep"]);
const { errors, validateForm, clearErrors, scrollToErrors } = useValidation();
const route = useRoute();
const router = useRouter();
const alertStore = useAlertStore();

const localForm = toRef(props, "modelValue");

const handleNext = () => {
  const form = localForm.value;
  const schema = formValidation(form);

  const isValid = validateForm(form, schema);

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
  if (
    localForm.value.sendingAmount === undefined ||
    localForm.value.sendingAmount === null
  ) {
    localForm.value.sendingAmount = route.query.sendingAmount
      ? parseFloat(route.query.sendingAmount)
      : 0.0;
  }

  if (!localForm.value.sendingCurrency) {
    localForm.value.sendingCurrency = route.query.sendingCurrency || "SGD";
  }

  if (
    localForm.value.receivingAmount === undefined ||
    localForm.value.receivingAmount === null
  ) {
    localForm.value.receivingAmount = route.query.receivingAmount
      ? parseFloat(route.query.receivingAmount)
      : 0.0;
  }

  if (!localForm.value.receivingCurrency) {
    localForm.value.receivingCurrency = route.query.receivingCurrency || "MYR";
  }
});

const handleCancel = () => {
  router.push({ path: "/dashboard" });
};
</script>

<style scoped>
@import "@/assets/dashboard.css";

.first-form {
  width: 100%;
  max-width: 900px;
}

.first-form fieldset {
  display: flex;
  justify-content: space-between;
}

.first-form .left-form,
.first-form .right-form {
  width: 400px;
  max-width: 400px;
}

.first-form .footer {
  display: flex;
  flex-direction: column;
  gap: var(--size-12);
}

.form-group {
  margin-bottom: var(--size-24);
}

@media (max-width: 1023px) {
  .first-form {
    display: flex;
    justify-content: center;
  }

  .first-form fieldset {
    flex-direction: column;
  }

  .first-form .left-form,
  .first-form .right-form {
    width: 100%;
    max-width: 400px;
  }
}
</style>
