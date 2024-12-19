<template>
  <div class="content-area">
    <div class="exchange-rate">
      <div class="form-section">
        <InputAmount
          :key="sendingAmount"
          id="sendingAmount"
          label="Sending amount"
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
          label="Receiving amount"
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
        <div>1 {{ sendingCurrency }}</div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path
            d="M438.6 150.6c12.5-12.5 12.5-32.8 0-45.3l-96-96c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.7 96 32 96C14.3 96 0 110.3 0 128s14.3 32 32 32l306.7 0-41.4 41.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l96-96zm-333.3 352c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 416 416 416c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0 41.4-41.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3l96 96z"
          />
        </svg>
        <div class="equal">=</div>
        <div>{{ transactionStore.rate }} {{ receivingCurrency }}</div>
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
            @click="navigateToTransactionDetail(transaction.memoId)"
          >
            <div class="icon-round">
              <font-awesome-icon :icon="['fas', 'dollar-sign']" />
            </div>
            <div class="detail">
              <div class="first-column">
                <div class="first-row">{{ transaction.memoId }}</div>
                <div class="second-row">
                  <span
                    :class="{
                      unpaid:
                        getTransactionStatus(transaction.status) === 'Unpaid',
                      pending:
                        getTransactionStatus(transaction.status) === 'Pending',
                      completed:
                        getTransactionStatus(transaction.status) === 'Success',
                      failed:
                        getTransactionStatus(transaction.status) === 'Rejected',
                    }"
                  >
                    {{ getTransactionStatus(transaction.status) }}
                  </span>
                  <span
                    :class="{
                      unpaid:
                        getTransactionStatus(transaction.status) === 'Unpaid',
                      pending:
                        getTransactionStatus(transaction.status) === 'Pending',
                      completed:
                        getTransactionStatus(transaction.status) === 'Success',
                      failed:
                        getTransactionStatus(transaction.status) === 'Rejected',
                    }"
                  >
                  </span>
                  <!-- <span
                    :class="{
                      unpaid: transaction.status === 'Unpaid',
                      pending: transaction.status.includes('Pending'),
                      completed: transaction.status === 'Completed',
                      failed: transaction.status === 'Failed',
                    }"
                  ></span> -->
                  <span>{{ formatDateTime(transaction.date) }}</span>
                </div>
              </div>
              <div class="second-column">
                <div class="first-row">
                  {{ formatNumber(transaction.payAmount) }}
                  {{ transaction.payCurrency }}
                </div>
                <div class="second-row">
                  {{ formatNumber(transaction.getAmount) }}
                  {{ transaction.getCurrency }}
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
          <div v-for="(rate, index) in rates" :key="index" class="item">
            <div class="country">
              <div class="icon-round">
                <img
                  :src="getCurrencyImagePath(rate.currency)"
                  alt="Currency"
                />
              </div>
              <div class="name">{{ rate.currency }}</div>
            </div>
            <div class="rate">{{ rate.rate }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { InputAmount, ButtonAPI } from "@/components/Form";
import { sendingCurrencies, receivingCurrencies } from "@/data/data";
import { useRouter } from "vue-router";
import {
  useAlertStore,
  useDashboardStore,
  useTransactionStore,
  useStore,
} from "@/stores/index.js";
import { useValidation } from "@/composables/useValidation";
import {
  formValidation,
  dashboardSchema,
} from "./components/schemas/dashboardSchema";
import { getCurrencyImagePath } from "@/utils/beneficiaryUtils.js";
import {
  formatNumber,
  getTransactionStatus,
  formatDateTime,
} from "@/utils/transactionUtils.js";
const router = useRouter();
const transactionStore = useTransactionStore();
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
const transactions = ref([]);
const rates = ref([]);
const sendingAmount = ref();
const sendingCurrency = ref(sendingCurrencies[1].code);
const receivingAmount = ref();
const receivingCurrency = ref(receivingCurrencies[0].code);

const updateSendingAmount = async (amount) => {
  const formattedAmount = parseFloat(amount).toFixed(2);

  if (sendingAmount.value === formattedAmount) {
    return;
  }

  sendingAmount.value = formattedAmount;
  store.setLoading(true);

  try {
    // Call lockedAmount API
    const response = await transactionStore.getLockedAmount(
      sendingAmount.value,
      "pay"
    );

    if (response && response.status === 1) {
      receivingAmount.value = parseFloat(response.getAmount).toFixed(2); // Update receiving amount
    }
  } catch (error) {
    console.error("Error in updateSendingAmount:", error);
  } finally {
    store.setLoading(false);
  }
};

const updateReceivingAmount = async (amount) => {
  const formattedAmount = parseFloat(amount).toFixed(2);

  if (receivingAmount.value === formattedAmount) {
    return;
  }

  receivingAmount.value = formattedAmount;
  store.setLoading(true);

  try {
    // Call lockedAmount API
    const response = await transactionStore.getLockedAmount(
      receivingAmount.value,
      "get"
    );

    if (response && response.status === 1) {
      sendingAmount.value = parseFloat(response.payAmount);
    }
  } catch (error) {
    console.error("Error in updateReceivingAmount:", error);
  } finally {
    store.setLoading(false);
  }
};

const updateSendingCurrency = async (currency) => {
  if (sendingCurrency.value === currency) {
    return;
  }

  sendingCurrency.value = currency;

  store.setLoading(true);

  try {
    // Call lockedRate API first
    const lockedRateResponse = await transactionStore.getLockedRate(
      receivingCurrency.value,
      sendingCurrency.value
    );

    if (lockedRateResponse && lockedRateResponse.status === 1) {
      transactionStore.setLockedRate(lockedRateResponse.rate);

      // Only call lockedAmount API if there is a valid sending amount
      if (sendingAmount.value) {
        const response = await transactionStore.getLockedAmount(
          sendingAmount.value,
          "pay"
        );

        if (response && response.status === 1) {
          receivingAmount.value = parseFloat(response.getAmount).toFixed(2);
        }
      }
    }
  } catch (error) {
    console.error("Failed to update sending currency:", error);
  } finally {
    store.setLoading(false);
  }
};

const updateReceivingCurrency = async (currency) => {
  if (receivingCurrency.value === currency) {
    return;
  }

  receivingCurrency.value = currency;

  store.setLoading(true);

  try {
    // Call lockedRate API first
    const lockedRateResponse = await transactionStore.getLockedRate(
      receivingCurrency.value,
      sendingCurrency.value
    );

    if (lockedRateResponse && lockedRateResponse.status === 1) {
      transactionStore.setLockedRate(lockedRateResponse.rate);

      // Only call lockedAmount API if there is a valid receiving amount
      if (receivingAmount.value) {
        const response = await transactionStore.getLockedAmount(
          receivingAmount.value,
          "get"
        );

        if (response && response.status === 1) {
          sendingAmount.value = parseFloat(response.payAmount).toFixed(2);
        }
      }
    }
  } catch (error) {
    console.error("Failed to update receiving currency:", error);
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

// onMounted(async () => {
//   if (authStore.userStatus === "0") {
//     await profileStore.getProfileDetail();
//     console.log("Checking if user is verified");
//   }
// });
onMounted(async () => {
  const getCurrency = receivingCurrency.value;
  const payCurrency = sendingCurrency.value;

  try {
    const lockedRateResponse = await transactionStore.getLockedRate(
      getCurrency,
      payCurrency
    );

    if (lockedRateResponse) {
      console.log("Locked rate successfully retrieved:", lockedRateResponse);
    }
  } catch (error) {
    console.error("Failed to retrieve locked rate:", error);
  }
});

onMounted(async () => {
  try {
    const response = await transactionStore.getTransactionList();
    if (response?.trxns) {
      transactions.value = response.trxns
        .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date (most recent first)
        .slice(0, 5); // Limit to the first 5 transactions
      console.log("Transactions successfully retrieved:", transactions.value);
    } else {
      console.error("Failed to retrieve transactions:", response?.message);
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
  }
});

onMounted(async () => {
  try {
    const response = await transactionStore.getRate();
    if (response?.status === 1 && response?.rates) {
      rates.value = response.rates
        .map((rate) => ({
          currency: rate.currency,
          rate: parseFloat(rate.rate).toFixed(4),
          fee: parseFloat(rate.fee).toFixed(4),
        }))
        .slice(0, 5); // Limit to the first 5 rates
      console.log("Rates successfully retrieved:", rates.value);
    } else {
      console.error("Failed to retrieve rates:", response?.message);
    }
  } catch (error) {
    console.error("Error fetching rates:", error);
  }
});

const navigateToTransactionDetail = async (memoId) => {
  const transaction = transactions.value.find((txn) => txn.memoId === memoId);

  if (transaction) {
    router.push({
      name: "transaction-detail",
      params: { memoId: transaction.memoId },
    });
  } else {
    console.error("Transaction not found with memoId:", memoId);
  }
};
</script>

<style scoped>
@import "@/assets/dashboard.css";
</style>
