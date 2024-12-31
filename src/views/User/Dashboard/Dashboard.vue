<template>
  <div class="content-area" v-if="authStore.userStatus !== '0'">
    <div class="exchange-rate">
      <div class="form-section">
        <InputAmount
          id="sendingAmount"
          label="Sending amount"
          :modelValue="form.sendingAmount"
          :modelCurrency="form.sendingCurrency"
          :isSending="true"
          @update:modelValue="updateSendingAmount"
          @update:modelCurrency="updateSendingCurrency"
          :isDashboard="true"
          :error="errors.sendingAmount"
        />

        <InputAmount
          id="receivingAmount"
          label="Receiving amount"
          :modelValue="form.receivingAmount"
          :modelCurrency="form.receivingCurrency"
          :isSending="false"
          @update:modelValue="updateReceivingAmount"
          @update:modelCurrency="updateReceivingCurrency"
          :isDashboard="true"
          :error="errors.receivingAmount"
        />
      </div>

      <div class="rate-group">
        <div>1 {{ form.sendingCurrency }}</div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path
            d="M438.6 150.6c12.5-12.5 12.5-32.8 0-45.3l-96-96c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.7 96 32 96C14.3 96 0 110.3 0 128s14.3 32 32 32l306.7 0-41.4 41.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l96-96zm-333.3 352c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 416 416 416c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0 41.4-41.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3l96 96z"
          />
        </svg>
        <div class="equal">=</div>
        <div>{{ transactionStore.rate }} {{ form.receivingCurrency }}</div>
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
          <router-link to="/transaction">View all</router-link>
        </div>
        <div class="item-section" v-if="transactions">
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
        <EmptyList v-if="!transactions" />
      </div>
      <div class="currency">
        <div class="title">
          <h3>Current Rates</h3>
          <!-- <router-link to="/history">View all</router-link> -->
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
            <div
              class="rate"
              :class="[
                rate.isIncreased ? 'increased' : '',
                rate.isDecreased ? 'decreased' : '',
                rate.animateClass,
              ]"
            >
              {{ rate.rate }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="content-area" v-if="authStore.userStatus === '0'">
    <div class="exchange-rate blur">
      <div class="form-section">
        <InputAmount
          id="sendingAmount"
          label="Sending amount"
          :modelValue="form.sendingAmount"
          :modelCurrency="form.sendingCurrency"
          :isSending="true"
          :isDashboard="true"
        />

        <InputAmount
          id="receivingAmount"
          label="Receiving amount"
          :modelValue="form.receivingAmount"
          :modelCurrency="form.receivingCurrency"
          :isSending="false"
          :isDashboard="true"
        />
      </div>

      <div class="rate-group">
        <div>1 {{ form.sendingCurrency }}</div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path
            d="M438.6 150.6c12.5-12.5 12.5-32.8 0-45.3l-96-96c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.7 96 32 96C14.3 96 0 110.3 0 128s14.3 32 32 32l306.7 0-41.4 41.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l96-96zm-333.3 352c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 416 416 416c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0 41.4-41.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3l96 96z"
          />
        </svg>
        <div class="equal">=</div>
        <div>3.3 {{ form.receivingCurrency }}</div>
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
    <div class="onboarding">
      <div class="item-section">
        <div class="item">
          <div class="heading">1. Password Change</div>
          <div class="body">
            For the safety of your account, we strongly recommend changing your
            password immediately after your first login. This helps protect your
            personal information and ensures a secure trading experience.
          </div>
          <button class="btn-blue standard-button" @click="navigateToSetting">
            Change password
          </button>
        </div>
      </div>
      <div class="item-section">
        <div class="item">
          <div class="heading">2. Account Verification</div>
          <div class="body">
            To unlock full access and continue your transactions, please
            complete your account verification. Please re-login or visit the
            Profile page to check your verification status.
          </div>
          <div class="footer">
            <button class="btn-blue standard-button" @click="navigateToProfile">
              Verify account
            </button>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, watch } from "vue";
import { InputAmount, ButtonAPI } from "@/components/Form";
import { sendingCurrencies, receivingCurrencies } from "@/data/data";
import { useRouter } from "vue-router";
import {
  useAlertStore,
  useProfileStore,
  useTransactionStore,
  useAuthStore,
  useStore,
} from "@/stores/index.js";
import { useValidation } from "@/composables/useValidation";
import {
  formValidation,
  currencySchema,
} from "./components/schemas/dashboardSchema";
import { getCurrencyImagePath } from "@/utils/beneficiaryUtils.js";
import {
  formatNumber,
  getTransactionStatus,
  formatDateTime,
} from "@/utils/transactionUtils.js";
import EmptyList from "@/views/EmptyList.vue";
import { encryptQueryParams } from "@/services/encryptionService";

const router = useRouter();
const transactionStore = useTransactionStore();
const store = useStore();
const authStore = useAuthStore();
const alertStore = useAlertStore();
const profileStore = useProfileStore();
const { errors, validateForm, validateSendingAmount, validateReceivingAmount } =
  useValidation();

const form = reactive({
  sendingAmount: 0,
  sendingCurrency: sendingCurrencies[1].code,
  receivingAmount: 0,
  receivingCurrency: receivingCurrencies[0].code,
});

const transactions = ref([]);
const rates = ref([]);
const previousRates = ref({});
let rateInterval = null;

const updateSendingAmount = async (amount) => {
  const formattedAmount = parseFloat(amount).toFixed(2);

  if (form.sendingAmount === formattedAmount) return;

  form.sendingAmount = formattedAmount;

  try {
    const response = await transactionStore.getLockedAmount(
      form.sendingAmount,
      "pay"
    );

    if (response && response.status === 1) {
      form.receivingAmount = parseFloat(response.getAmount);
    }
  } catch (error) {
    console.error("Error in updateSendingAmount:", error);
  }
};

const updateReceivingAmount = async (amount) => {
  const formattedAmount = parseFloat(amount).toFixed(2);

  if (form.receivingAmount === formattedAmount) return;

  form.receivingAmount = formattedAmount;

  try {
    const response = await transactionStore.getLockedAmount(
      form.receivingAmount,
      "get"
    );

    if (response && response.status === 1) {
      form.sendingAmount = parseFloat(response.payAmount);
    }
  } catch (error) {
    console.error("Error in updateReceivingAmount:", error);
  }
};

const updateSendingCurrency = async (currency) => {
  if (form.sendingCurrency === currency) return;

  form.sendingCurrency = currency;

  try {
    const lockedRateResponse = await transactionStore.getLockedRate(
      form.sendingCurrency,
      form.receivingCurrency
    );

    if (lockedRateResponse && lockedRateResponse.status === 1) {
      if (form.sendingAmount) {
        const response = await transactionStore.getLockedAmount(
          form.sendingAmount,
          "pay"
        );

        if (response && response.status === 1) {
          form.receivingAmount = parseFloat(response.getAmount).toFixed(2);
        }
      }
    }
  } catch (error) {
    console.error("Failed to update sending currency:", error);
  }
};

const updateReceivingCurrency = async (currency) => {
  if (form.receivingCurrency === currency) return;

  form.receivingCurrency = currency;
  // store.isLoading(true);

  try {
    const lockedRateResponse = await transactionStore.getLockedRate(
      form.sendingCurrency,
      form.receivingCurrency
    );

    if (lockedRateResponse && lockedRateResponse.status === 1) {
      if (form.receivingAmount) {
        const response = await transactionStore.getLockedAmount(
          form.receivingAmount,
          "get"
        );

        if (response && response.status === 1) {
          form.sendingAmount = parseFloat(response.payAmount).toFixed(2);
        }
      }
    }
  } catch (error) {
    console.error("Failed to update receiving currency:", error);
  } finally {
    // store.isLoading(false);
  }
};

watch(
  () => [
    form.sendingAmount,
    form.receivingAmount,
    form.sendingCurrency,
    form.receivingCurrency,
  ],
  ([
    newSendingAmount,
    newReceivingAmount,
    newSendingCurrency,
    newReceivingCurrency,
  ]) => {
    // Validate sending amount
    validateSendingAmount(
      newSendingAmount,
      newSendingCurrency,
      currencySchema,
      "sending"
    );

    // Validate receiving amount
    validateReceivingAmount(
      newReceivingAmount,
      newReceivingCurrency,
      currencySchema,
      "receiving"
    );
  }
);

const handleSubmit = () => {
  const schema = formValidation(form);

  // Validate the form fields
  const isValid = validateForm(form, schema);
  console.log("Validation Errors:", errors);

  if (isValid) {
    // If all validations pass, navigate to the next page
    router.push({
      path: "/transaction/addtransaction",
      query: {
        sendingAmount: form.sendingAmount,
        sendingCurrency: form.sendingCurrency,
        receivingAmount: form.receivingAmount,
        receivingCurrency: form.receivingCurrency,
        fromDashboard: "true",
      },
    });
  } else {
    // If sendingAmount is 0, show a specific error message for required fields
    if (form.sendingAmount === 0 || form.receivingAmount === 0) {
      alertStore.alert("error", "Please fill in the required fields.");
    } else if (errors.sendingAmount || errors.receivingAmount) {
      // If there are range validation errors, show the appropriate message
      alertStore.alert(
        "error",
        "Please provide valid amounts for both sending and receiving"
      );
    } else {
      alertStore.alert(
        "error",
        "Please provide valid amounts for both sending and receiving"
      );
    }
  }
};

onMounted(async () => {
  if (authStore.userStatus === "0") {
    await profileStore.getProfileDetail();
    console.log("User is not verified. Skipping API calls.");
    return; // Skip the rest of the initialization if user is not verified
  }

  try {
    // Step 1: Call getLockedRate
    const lockedRateResponse = await transactionStore.getLockedRate(
      form.sendingCurrency,
      form.receivingCurrency
    );

    if (lockedRateResponse?.status === 1) {
      console.log("Locked rate successfully retrieved:", lockedRateResponse);

      // Step 2: Call getTransactionList
      const transactionListResponse =
        await transactionStore.getTransactionList();

      if (transactionListResponse?.trxns) {
        transactions.value = transactionListResponse.trxns
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5); // Limit to 5 transactions
        console.log("Transactions successfully retrieved:", transactions.value);

        // Step 3: Call getRate and start interval
        await fetchRates();
        rateInterval = setInterval(fetchRates, 1000); // Fetch rates every second
      } else {
        console.error(
          "Failed to retrieve transactions:",
          transactionListResponse?.message
        );
      }
    } else {
      console.error(
        "Failed to retrieve locked rate:",
        lockedRateResponse?.message
      );
    }
  } catch (error) {
    console.error("Error in API call sequence:", error);
  }
});

// const fetchRates = async () => {
//   if (authStore.userStatus === "0") {
//     console.log("User is not verified. Skipping rate fetching.");
//     return; // Skip fetching rates if user is not verified
//   }

//   try {
//     const response = await transactionStore.getRate();
//     if (response?.status === 1 && response?.rates) {
//       const newRates = response.rates
//         .map((rate) => ({
//           currency: rate.currency,
//           rate: parseFloat(rate.rate).toFixed(4),
//           fee: parseFloat(rate.fee).toFixed(4),
//           isIncreased:
//             previousRates.value[rate.currency] &&
//             parseFloat(rate.rate) > previousRates.value[rate.currency],
//           isDecreased:
//             previousRates.value[rate.currency] &&
//             parseFloat(rate.rate) < previousRates.value[rate.currency],
//         }))
//         .slice(0, 5);

//       previousRates.value = Object.fromEntries(
//         newRates.map((rate) => [rate.currency, parseFloat(rate.rate)])
//       );

//       rates.value = newRates;
//     } else {
//       console.error("Failed to retrieve rates:", response?.message);
//     }
//   } catch (error) {
//     console.error("Error fetching rates:", error);
//   }
// };

// onMounted(async () => {
//   if (authStore.userStatus === "0") {
//     await profileStore.getProfileDetail();
//     console.log("Checking if user is verified");
//   }
// });

// const fetchRates = async () => {
//   try {
//     const response = await transactionStore.getRate();
//     if (response?.status === 1 && response?.rates) {
//       const newRates = response.rates
//         .map((rate) => ({
//           currency: rate.currency,
//           rate: parseFloat(rate.rate).toFixed(4),
//           fee: parseFloat(rate.fee).toFixed(4),
//           isIncreased:
//             previousRates.value[rate.currency] &&
//             parseFloat(rate.rate) > previousRates.value[rate.currency],
//           isDecreased:
//             previousRates.value[rate.currency] &&
//             parseFloat(rate.rate) < previousRates.value[rate.currency],
//         }))
//         .slice(0, 5);

//       previousRates.value = Object.fromEntries(
//         newRates.map((rate) => [rate.currency, parseFloat(rate.rate)])
//       );

//       rates.value = newRates;
//     } else {
//       console.error("Failed to retrieve rates:", response?.message);
//     }
//   } catch (error) {
//     console.error("Error fetching rates:", error);
//   }
// };

// onMounted(async () => {
//   console.log(form.sendingCurrency, "form sending currency");
//   try {
//     // Step 1: Call getLockedRate
//     const lockedRateResponse = await transactionStore.getLockedRate(
//       form.sendingCurrency,
//       form.receivingCurrency
//     );

//     if (lockedRateResponse?.status === 1) {
//       console.log("Locked rate successfully retrieved:", lockedRateResponse);

//       // Step 2: Call getTransactionList
//       const transactionListResponse =
//         await transactionStore.getTransactionList();

//       if (transactionListResponse?.trxns) {
//         transactions.value = transactionListResponse.trxns
//           .sort((a, b) => new Date(b.date) - new Date(a.date))
//           .slice(0, 5); // Limit to 5 transactions
//         console.log("Transactions successfully retrieved:", transactions.value);

//         // Step 3: Call getRate and start interval
//         await fetchRates();
//         rateInterval = setInterval(fetchRates, 1000); // Fetch rates every second
//       } else {
//         console.error(
//           "Failed to retrieve transactions:",
//           transactionListResponse?.message
//         );
//       }
//     } else {
//       console.error(
//         "Failed to retrieve locked rate:",
//         lockedRateResponse?.message
//       );
//     }
//   } catch (error) {
//     console.error("Error in API call sequence:", error);
//   }
// });

const fetchRates = async () => {
  if (authStore.userStatus === "0") {
    console.log("User is not verified. Skipping rate fetching.");
    return; // Skip fetching rates if user is not verified
  }

  try {
    const response = await transactionStore.getRate();
    if (response?.status === 1 && response?.rates) {
      const allowedCurrencies = ["USD", "MYR", "IDR", "YEN", "THB"]; // Specify the currencies to display

      const newRates = response.rates
        .filter((rate) => allowedCurrencies.includes(rate.currency)) // Filter allowed currencies
        .sort(
          (a, b) =>
            allowedCurrencies.indexOf(a.currency) -
            allowedCurrencies.indexOf(b.currency) // Sort by specified order
        )
        .map((rate) => ({
          currency: rate.currency,
          rate: parseFloat(rate.rate).toFixed(4),
          fee: parseFloat(rate.fee).toFixed(4),
          isIncreased:
            previousRates.value[rate.currency] &&
            parseFloat(rate.rate) > previousRates.value[rate.currency],
          isDecreased:
            previousRates.value[rate.currency] &&
            parseFloat(rate.rate) < previousRates.value[rate.currency],
          animateClass: "fade-in", // Initialize animation class
        }));

      // Trigger the fade-out animation before updating
      rates.value.forEach((rate) => {
        rate.animateClass = "fade-up-out";
      });

      setTimeout(() => {
        previousRates.value = Object.fromEntries(
          newRates.map((rate) => [rate.currency, parseFloat(rate.rate)])
        );
        rates.value = newRates;
      }, 500); // Wait for fade-up-out animation to complete
    } else {
      console.error("Failed to retrieve rates:", response?.message);
    }
  } catch (error) {
    console.error("Error fetching rates:", error);
  }
};

onBeforeUnmount(() => {
  if (rateInterval) clearInterval(rateInterval);
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

const navigateToProfile = () => {
  router.push({ name: "profiledetail" }); // Replace "profile" with the route name or path
};

const navigateToSetting = () => {
  router.push({ name: "setting" }); // Replace "settings" with the route name or path
};
</script>

<style scoped>
@import "@/assets/dashboard.css";
@keyframes fadeUpOut {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.rate {
  position: relative;
  display: inline-block;
  transition: opacity 0.5s, transform 0.5s;
}

.rate.fade-up-out {
  animation: fadeUpOut 0.5s ease forwards;
}

.rate.fade-in {
  animation: fadeIn 0.5s ease forwards;
}
</style>
