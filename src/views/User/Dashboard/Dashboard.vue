<template>
  <div class="content-area">
    <div class="exchange-rate">
      <div class="form-section">
        <InputAmount
          :key="sendingAmount"
          id="sendingAmount"
          label="Sending Amount"
          :modelValue="sendingAmount"
          :modelCurrency="sendingCurrency"
          :isSending="true"
          @update:modelValue="updateSendingAmount"
          @update:modelCurrency="updateSendingCurrency"
          :isDashboard="true"
          :error="errors.sendingAmount"
        />

        <InputAmount
          :key="receivingAmount"
          id="receivingAmount"
          label="Receiving Amount"
          :modelValue="receivingAmount"
          :modelCurrency="receivingCurrency"
          :isSending="false"
          @update:modelValue="updateReceivingAmount"
          @update:modelCurrency="updateReceivingCurrency"
          :isDashboard="true"
          :error="errors.receivingAmount"
        />
      </div>

      <div class="rate-group">
        <div>1 SGD</div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path
            d="M438.6 150.6c12.5-12.5 12.5-32.8 0-45.3l-96-96c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.7 96 32 96C14.3 96 0 110.3 0 128s14.3 32 32 32l306.7 0-41.4 41.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l96-96zm-333.3 352c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 416 416 416c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0 41.4-41.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3l96 96z"
          />
        </svg>
        <div class="equal">=</div>
        <div>0.7424 USD</div>
      </div>

      <div class="button-group">
        <ButtonAPI
          :disabled="store.isLoading"
          class="btn-red standard-button"
          @click="handleSubmit"
        >
          Calculate
        </ButtonAPI>
      </div>
    </div>

    <div class="transaction">
      <div class="history">
        <div class="title">
          <h3>Transaction History</h3>
          <router-link to="/history">View all</router-link>
        </div>
        <div class="item-section">
          <div
            v-for="(transaction, index) in transactions"
            :key="index"
            class="item"
            tabindex="0"
          >
            <div class="icon-round">
              <font-awesome-icon :icon="['fas', 'dollar-sign']" />
            </div>
            <div class="detail">
              <div class="first-column">
                <div class="first-row">{{ transaction.number }}</div>
                <div class="second-row">
                  <span
                    :class="{
                      unpaid: transaction.status === 'Unpaid',
                      pending: transaction.status.includes('Pending'),
                      completed: transaction.status === 'Completed',
                      failed: transaction.status === 'Failed',
                    }"
                    >{{ transaction.status }}</span
                  >
                  <span
                    :class="{
                      unpaid: transaction.status === 'Unpaid',
                      pending: transaction.status.includes('Pending'),
                      completed: transaction.status === 'Completed',
                      failed: transaction.status === 'Failed',
                    }"
                  ></span>
                  <span>{{ transaction.date }}</span>
                </div>
              </div>
              <div class="second-column">
                <div class="first-row">
                  {{ transaction.sendingAmount }}
                </div>
                <div class="second-row">
                  {{ transaction.receivingAmount }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="currency">
        <div class="title">
          <h3>Current Rates</h3>
          <router-link to="/history">View all</router-link>
        </div>
        <div class="item-section">
          <div
            v-for="(currency, index) in currencies"
            :key="index"
            class="item in currencies"
          >
            <div class="country">
              <div class="icon-round">
                <img :src="currency.icon" />
              </div>
              <div class="name">{{ currency.code }}</div>
            </div>
            <div class="rate">{{ currency.rate }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useTransactionStore } from "@/stores/transactionStore";
import { InputAmount, ButtonAPI } from "@/components/Form";
import { storeToRefs } from "pinia";
import { sendingCurrencies, receivingCurrencies } from "@/data/data";
import { useRouter } from "vue-router";
import { useAlertStore, useDashboardStore, useStore } from "@/stores/index.js";
import { useValidation } from "@/composables/useValidation";
import {
  formValidation,
  dashboardSchema,
} from "./components/schemas/dashboardSchema";

const router = useRouter();
const transactionStore = useTransactionStore();
const { transactions } = storeToRefs(transactionStore);
const store = useStore();
const dashboardStore = useDashboardStore();
const alertStore = useAlertStore();
const { errors, validateSendingAmount, validateReceivingAmount } =
  useValidation();

// Dummy data for current currency rates
const currencies = [
  { icon: "/assets/currency/usd.svg", code: "USD", rate: "SGD 1.36" },
  { icon: "/assets/currency/eur.svg", code: "EUR", rate: "SGD 1.46" },
  { icon: "/assets/currency/gbp.svg", code: "GBP", rate: "SGD 1.72" },
  { icon: "/assets/currency/cny.svg", code: "CNY", rate: "SGD 0.19" },
  { icon: "/assets/currency/myr.svg", code: "MYR", rate: "SGD 0.30" },
];

const sendingAmount = ref("");
const sendingCurrency = ref(sendingCurrencies[1].code);
const receivingAmount = ref("");
const receivingCurrency = ref(receivingCurrencies[0].code);

const updateSendingAmount = async (amount) => {
  sendingAmount.value = parseFloat(amount).toFixed(2);

  store.setLoading(true);

  try {
    const { convertedAmount } = await dashboardStore.fetchExchangeRate(
      sendingCurrency.value,
      receivingCurrency.value,
      sendingAmount.value
    );

    receivingAmount.value = parseFloat(convertedAmount).toFixed(2);

    validateSendingAmount(
      sendingAmount.value,
      sendingCurrency.value,
      dashboardSchema
    );
    validateReceivingAmount(
      receivingAmount.value,
      receivingCurrency.value,
      dashboardSchema
    );
  } catch (error) {
    console.error("Error updating sending amount:", error);
  } finally {
    store.setLoading(false);
  }
};

const updateReceivingAmount = async (amount) => {
  receivingAmount.value = parseFloat(amount).toFixed(2);

  store.setLoading(true);

  try {
    const { convertedAmount } = await dashboardStore.fetchExchangeRate(
      receivingCurrency.value,
      sendingCurrency.value,
      receivingAmount.value
    );

    sendingAmount.value = parseFloat(convertedAmount).toFixed(2);

    validateSendingAmount(
      sendingAmount.value,
      sendingCurrency.value,
      dashboardSchema
    );
    validateReceivingAmount(
      receivingAmount.value,
      receivingCurrency.value,
      dashboardSchema
    );
  } catch (error) {
    console.error("Error updating receiving amount:", error);
  } finally {
    store.setLoading(false);
  }
};

const updateSendingCurrency = async (currency) => {
  if (sendingCurrency.value === currency) {
    console.log(
      "Sending currency is already selected. No need to recalculate."
    );
    return;
  }

  sendingCurrency.value = currency;

  if (!sendingAmount.value || parseFloat(sendingAmount.value) === 0) {
    console.log("Sending amount is empty. Skipping recalculation.");
    return;
  }

  store.setLoading(true);

  try {
    const { convertedAmount } = await dashboardStore.fetchExchangeRate(
      sendingCurrency.value,
      receivingCurrency.value,
      sendingAmount.value
    );

    receivingAmount.value = parseFloat(convertedAmount).toFixed(2);

    validateSendingAmount(
      sendingAmount.value,
      sendingCurrency.value,
      dashboardSchema
    );
    validateReceivingAmount(
      receivingAmount.value,
      receivingCurrency.value,
      dashboardSchema
    );
  } catch (error) {
    console.error("Error while updating receiving amount:", error);
  } finally {
    store.setLoading(false);
  }
};

const updateReceivingCurrency = async (currency) => {
  if (receivingCurrency.value === currency) {
    console.log(
      "Receiving currency is already selected. No need to recalculate."
    );
    return;
  }

  receivingCurrency.value = currency;

  if (!receivingAmount.value || parseFloat(receivingAmount.value) === 0) {
    console.log("Receiving amount is empty. Skipping recalculation.");
    return;
  }

  store.setLoading(true);

  try {
    const { convertedAmount } = await dashboardStore.fetchExchangeRate(
      receivingCurrency.value,
      sendingCurrency.value,
      receivingAmount.value
    );

    sendingAmount.value = parseFloat(convertedAmount).toFixed(2);

    validateSendingAmount(
      sendingAmount.value,
      sendingCurrency.value,
      dashboardSchema
    );
    validateReceivingAmount(
      receivingAmount.value,
      receivingCurrency.value,
      dashboardSchema
    );
  } catch (error) {
    console.error("Error while updating sending amount:", error);
  } finally {
    store.setLoading(false);
  }
};

const handleSubmit = () => {
  if (errors.sendingAmount || errors.receivingAmount) {
    alertStore.alert("error", "The amount is not within the acceptable range");
    return;
  }
  router.push({
    path: "/transaction/addtransaction",
    query: {
      sendingAmount: sendingAmount.value,
      sendingCurrency: sendingCurrency.value,
      receivingAmount: receivingAmount.value,
      receivingCurrency: receivingCurrency.value,
    },
  });
};
</script>

<style scoped>
@import "@/assets/dashboard.css";
</style>
