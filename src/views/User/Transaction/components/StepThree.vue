<template>
  <div class="third-form" @keydown.enter.prevent="handleSubmit">
    <fieldset>
      <div class="left-form">
        <div class="item-group">
          <div class="header">Remittance Application</div>
          <div class="body">
            <InputFile
              label="Supporting documents"
              id="beneficiaryUploadSupportingFile"
              v-model="localForm.beneficiaryUploadSupportingFile"
              :multiple="false"
              @update:modelValue="
                (files) =>
                  handleFileUpload('beneficiaryUploadSupportingFile', files)
              "
              :error="errors.beneficiaryUploadSupportingFile"
              :tooltip="true"
              tooltipText="Upload supporting documents for your application"
            />
            <Input
              label="Remarks (optional)"
              id="remarks"
              v-model="localForm.customerRemarks"
              :error="errors.customerRemarks"
            />
          </div>
        </div>
        <div class="item-group">
          <div class="header">Beneficiary Information</div>
          <div class="body">
            <div class="item">
              <div class="label">Account holder name</div>
              <div class="value">
                {{ localForm.selectedBeneficiary?.beneName || "" }}
              </div>
            </div>
            <div class="item">
              <div class="label">Bank name</div>
              <div class="value">
                {{ localForm.selectedBeneficiary?.bankName || "" }}
              </div>
            </div>
            <div class="item">
              <div class="label">Bank account number</div>
              <div class="value">
                {{ localForm.selectedBeneficiary?.bankAccountNo || "" }}
              </div>
            </div>
            <div class="item">
              <div class="label">Bank country</div>
              <div class="value">
                {{
                  getNationality(localForm.selectedBeneficiary?.bankCountry) ||
                  ""
                }}
              </div>
            </div>
            <div class="item">
              <div class="label">Payment type</div>
              <div class="value">
                {{ localForm.selectedBeneficiary?.paymentType || "" }}
              </div>
            </div>
            <div class="item">
              <div class="label">Currency</div>
              <div class="value">
                {{ localForm.selectedBeneficiary?.currency || "" }}
              </div>
            </div>
            <div class="item">
              <div class="label">Swift code</div>
              <div class="value">
                {{ localForm.selectedBeneficiary?.swiftCode || "" }}
              </div>
            </div>
            <div class="item">
              <div class="label">Account type</div>
              <div class="value">
                {{
                  getAccountType(
                    localForm.selectedBeneficiary?.accountType || ""
                  )
                }}
              </div>
            </div>
          </div>
        </div>
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
    </fieldset>
    <Modal
      :isModalOpen="store.isModalOpen"
      :title="'Transaction Confirmation'"
      :showAction="true"
      @close="store.closeModal"
      @submit="emitSubmit"
      @cancel="store.closeModal"
    >
      <template #body>
        <p>
          By confirming this transaction, you agree to complete the payment to
          us within the next hour. Failure to make the payment within this
          timeframe may result in the cancellation of your transaction and
          additional penalties or fees as per our terms and conditions.
        </p>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import TransactionSummary from "./TransactionSummary.vue";
import {
  reactive,
  watch,
  defineProps,
  defineEmits,
  onMounted,
  nextTick,
} from "vue";
import { Input, InputFile } from "@/components/Form";
import { useValidation } from "@/composables/useValidation";
import { formValidation } from "./schemas/stepThreeSchema";
import {
  useAlertStore,
  useBeneficiaryStore,
  useTransactionStore,
  useStore,
} from "@/stores/index.js";
import Modal from "@/components/Modal/Modal.vue";
import { useRoute } from "vue-router";
import { getAccountType, getNationality } from "@/utils/beneficiaryUtils.js";
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["update:modelValue", "submit", "prevStep", "submit"]);
const { errors, validateForm, clearErrors, scrollToErrors } = useValidation();
const route = useRoute();
const store = useStore();
const alertStore = useAlertStore();
const beneficiaryStore = useBeneficiaryStore();
const transactionStore = useTransactionStore();

const localForm = reactive({
  selectedBeneficiary: beneficiaryStore.selectedBeneficiary || null,
  ...props.modelValue,
});

const emitSubmit = () => {
  emit("submit");
};

const handleSubmit = () => {
  const schema = formValidation(localForm);

  const isValid = validateForm(localForm, schema);
  console.log("Validation Errors:", errors);

  if (isValid) {
    store.openModal();
  } else {
    alertStore.alert("error", "Please fill in all the required inputs.");
    scrollToErrors();
  }
};

// Generic file upload handler
const handleFileUpload = (field, files) => {
  if (Array.isArray(files)) {
    localForm.value[field] = files;
  } else {
    localForm.value[field] = [files];
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

const handleBack = () => {
  emit("prevStep");
};

// *** Maintain beneficiary state at StepTwo and StepThree ***
onMounted(async () => {
  beneficiaryStore.setSelectedBeneficiary(localForm.selectedBeneficiary);
});
</script>

<style scoped>
@import "@/assets/dashboard.css";

.third-form {
  width: 100%;
  max-width: 1000px;
}

.third-form fieldset {
  display: flex;
  justify-content: space-between;
}

.third-form .left-form {
  width: 550px;
  max-width: 550px;
}

.third-form .right-form {
  width: 400px;
  max-width: 400px;
}

.third-form .left-form .item-group {
  border: 1px solid var(--light-grey);
  border-radius: var(--border-md);
  margin-bottom: var(--size-24);
}

.third-form .left-form .item-group .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--size-dropdown-item);
  border-bottom: 1px solid var(--light-grey);
  font-weight: var(--semi-bold);
}

.third-form .left-form .item-group .body {
  padding: var(--size-16);
  border-bottom: 1px solid var(--light-grey);
}

.third-form .left-form .item-group .body .form-group:last-child {
  margin-bottom: 0;
}

.third-form .left-form .item-group .body .item {
  display: flex;
  justify-content: space-between;
  padding-bottom: var(--size-8);
}

.third-form .left-form .item-group .body .item:last-child {
  padding-bottom: 0;
}

.third-form .left-form .item-group .body .item .label {
  color: var(--grey);
}

.third-form .left-form .item-group .body .item .value {
  color: var(--black);
  text-align: end;
}

.third-form .footer {
  display: flex;
  flex-direction: column;
  gap: var(--size-12);
}

.form-group {
  margin-bottom: var(--size-24);
}

@media (max-width: 1023px) {
  .third-form {
    max-width: 400px;
  }

  .third-form fieldset {
    flex-direction: column;
  }

  .third-form .left-form,
  .third-form .right-form {
    width: 100%;
    max-width: 400px;
  }
}
</style>
