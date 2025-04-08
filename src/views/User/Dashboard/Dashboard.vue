<template>
  <div class="content-area" v-if="$isVerifiedUser(profileDetails.userStatus)">
    <div class="exchange-rate">
      <div class="form-section">
        <InputAmount
          id="sendingAmount"
          label="Sending amount"
          :modelValue="form.sendingAmount"
          :isSending="true"
          @update:modelValue="updateSendingAmount"
          :error="errors.sendingAmount"
        />
        <InputSendingCurrency
          label="Sending currency"
          id="currency"
          :modelCurrency="form.sendingCurrency"
          @update:modelCurrency="updateSendingCurrency"
        />
        <div class="exchange-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path
              d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
            />
          </svg>
        </div>

        <InputReceivingCurrency
          label="Receiving currency"
          id="receivingCurrency"
          :modelCurrency="form.receivingCurrency"
          @update:modelCurrency="updateReceivingCurrency"
        />
      </div>

      <div class="button-section">
        <div class="rate-group">
          1 {{ form.sendingCurrency }} = {{ transactionStore.rate }}
          {{ form.receivingCurrency }}
        </div>
        <div class="button-group">
          <ButtonAPI
            :disabled="store.isMoneyLoading"
            class="btn-red standard-button"
            @click="handleSubmit"
          >
            Calculate
          </ButtonAPI>
        </div>
      </div>
    </div>

    <div class="transaction">
      <div class="history">
        <div class="title">
          <h3>Transaction History</h3>
          <router-link to="/transaction">View all</router-link>
        </div>

        <div v-if="store.isLoading">
          <SkeletonLoader type="dashboardTransaction" :count="5" />
        </div>
        <div v-else-if="transactions.length === 0">
          <EmptyList />
        </div>
        <div class="item-section" v-else>
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
                      failed: transaction.status === 0,
                      completed: transaction.status === 1,
                      unpaid: transaction.status === 2,
                      pending: transaction.status === 3,
                      priority:
                        transaction.status === 3 && transaction.isUrgent === 1,
                      cancelled: transaction.status === 4,
                    }"
                  >
                    {{ getTransactionStatus(transaction.status) }}
                  </span>
                  <span
                    :class="{
                      failed: transaction.status === 0,
                      completed: transaction.status === 1,
                      unpaid: transaction.status === 2,
                      pending: transaction.status === 3,
                      cancelled: transaction.status === 4,
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
      </div>
      <div class="currency">
        <div class="title">
          <h3>Current Rates</h3>
          <!-- <router-link to="/history">View all</router-link > -->
        </div>

        <div v-if="store.isLoading">
          <SkeletonLoader type="dashboardCurrentRates" :count="5" />
        </div>
        <div v-else-if="rates.length === 0">
          <EmptyList />
        </div>
        <div v-else>
          <div class="item-section">
            <div v-for="(rate, index) in rates" :key="index" class="item">
              <div class="country">
                <div class="icon-round">
                  <img
                    :src="
                      rateToggles[rate.currency]
                        ? getCurrencyImagePath('SGD')
                        : getCurrencyImagePath(rate.currency)
                    "
                    alt="Currency"
                  />
                </div>
                <button
                  @click="toggleRate(rate.currency)"
                  class="exchange-item"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 17 17"
                    aria-hidden="true"
                    class="h-4 w-4 rotate-90 text-greyblue-400 md:rotate-0"
                  >
                    <path
                      fill="currentColor"
                      fill-rule="evenodd"
                      d="M11.726 1.273l2.387 2.394H.667V5h13.446l-2.386 2.393.94.94 4-4-4-4-.94.94zM.666 12.333l4 4 .94-.94L3.22 13h13.447v-1.333H3.22l2.386-2.394-.94-.94-4 4z"
                      clip-rule="evenodd"
                    ></path>
                    <path
                      stroke="currentColor"
                      fill="currentColor"
                      fill-rule="evenodd"
                      d="M11.726 1.273l2.387 2.394H.667V5h13.446l-2.386 2.393.94.94 4-4-4-4-.94.94zM.666 12.333l4 4 .94-.94L3.22 13h13.447v-1.333H3.22l2.386-2.394-.94-.94-4 4z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </button>
                <div class="icon-round">
                  <img
                    :src="
                      rateToggles[rate.currency]
                        ? getCurrencyImagePath(rate.currency)
                        : getCurrencyImagePath('SGD')
                    "
                    alt="Currency"
                  />
                </div>
              </div>

              <div class="rate">
                {{ rate.rate }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    class="content-area"
    v-if="$isNotVerifiedUser(profileDetails.userStatus)"
  >
    <div class="exchange-rate blur">
      <div class="form-section">
        <InputAmount
          id="sendingAmount"
          label="Sending amount"
          :modelValue="form.sendingAmount"
        />
        <InputSendingCurrency label="Sending currency" id="currency" />
        <div class="exchange-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path
              d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
            />
          </svg>
        </div>

        <InputReceivingCurrency
          label="Receiving currency"
          id="receivingCurrency"
        />
      </div>

      <div class="button-section">
        <div class="rate-group">1 SGD = 3.33 MYR</div>
        <div class="button-group">
          <button type="button" class="btn-red standard-button">
            Calculate
          </button>
        </div>
      </div>
    </div>
    <div class="onboarding" v-if="$isUnverifiedUser(profileDetails.userStatus)">
      <!-- <div class="item-section">
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
      </div> -->
      <div class="item-section">
        <div class="item">
          <div class="heading">Account Verification</div>
          <div class="body">
            Please complete your account verification to unlock full access and
            proceed with your transactions.
          </div>
          <div class="footer">
            <button
              class="btn-blue standard-button"
              @click="navigateToAccountVerification"
            >
              Verify account
            </button>
          </div>
        </div>
      </div>
      <div></div>
    </div>

    <div
      class="onboarding-pending"
      v-if="
        $isPendingUser(profileDetails.userStatus) ||
        $isRejectedUser(profileDetails.userStatus)
      "
    >
      <div class="account-locked">
        <div v-if="$isPendingUser(profileDetails.userStatus)">
          <h1>Access restricted</h1>

          <span
            >Kindly hold on while your account is awaiting management
            approval.</span
          >
          <p>For further assistance, please contact customer support.</p>
        </div>
        <div v-if="$isRejectedUser(profileDetails.userStatus)">
          <h1>Access restricted</h1>

          <span>Your account verification has been rejected.</span>

          <p>For further assistance, please contact customer support.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import { ButtonAPI } from "@/components/Form";
import InputAmount from "@/components/Form/Dashboard/InputAmount.vue";
import InputSendingCurrency from "@/components/Form/Dashboard/InputSendingCurrency.vue";
import InputReceivingCurrency from "@/components/Form/Dashboard/InputReceivingCurrency.vue";
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
import { getCurrencySymbol, formatCurrency } from "@/utils/currencyUtils";
import SkeletonLoader from "@/views/SkeletonLoader.vue";
import EmptyList from "@/views/EmptyList.vue";
import { useEnvironment } from "@/composables/useEnvironment";
import { DEFAULT_ERROR_MESSAGE } from "@/services/apiService";

const router = useRouter();
const transactionStore = useTransactionStore();
const store = useStore();
const authStore = useAuthStore();
const alertStore = useAlertStore();
const profileStore = useProfileStore();
const { errors, validateForm, validateSendingAmount, validateReceivingAmount } =
  useValidation();
const { ENV_TYPE } = useEnvironment();

const form = reactive({
  sendingAmount: 0,
  sendingCurrency: sendingCurrencies[1].code,
  receivingAmount: 0,
  receivingCurrency: receivingCurrencies[0].code,
});

const profileDetails = reactive({});

const transactions = ref([]);
const rates = ref([]);
const previousRates = ref({});
let rateInterval = null;

const updateSendingAmount = async (amount) => {
  const formattedAmount = parseFloat(amount);

  if (form.sendingAmount === formattedAmount) return;

  form.sendingAmount = formattedAmount;
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
    alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
  }
};

const updateReceivingCurrency = async (currency) => {
  if (form.receivingCurrency === currency) return;

  form.receivingCurrency = currency;

  try {
    const lockedRateResponse = await transactionStore.getLockedRate(
      form.sendingCurrency,
      form.receivingCurrency
    );

    if (lockedRateResponse && lockedRateResponse.status === 1) {
      if (form.sendingAmount) {
        // Fetch the receiving amount based on the current sending amount
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
    alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
  }
};

const handleSubmit = async () => {
  form.sendingAmount = parseFloat(form.sendingAmount);
  form.receivingAmount = parseFloat(form.receivingAmount);

  validateSendingAmount(
    form.sendingAmount,
    form.sendingCurrency,
    currencySchema,
    "sending"
  );

  if (errors.sendingAmount) {
    alertStore.alert("error", errors.sendingAmount);
    return;
  }

  const schema = formValidation(form);
  const isValid = validateForm(form, schema);

  if (!isValid) {
    if (form.sendingAmount === 0 || form.receivingAmount === 0) {
      alertStore.alert("error", "Please fill in the required fields.");
    } else {
      alertStore.alert(
        "error",
        "Please provide valid amounts for both sending and receiving"
      );
    }
    return;
  }

  try {
    const lockedAmountResponse = await transactionStore.getLockedAmount(
      form.sendingAmount,
      "pay"
    );

    if (!lockedAmountResponse || lockedAmountResponse.status !== 1) {
      alertStore.alert("error", "Failed to retrieve locked amount.");
      return;
    }

    form.receivingAmount = parseFloat(lockedAmountResponse.getAmount);

    transactionStore.setTransactionData({
      sendingAmount: form.sendingAmount,
      sendingCurrency: form.sendingCurrency,
      receivingAmount: form.receivingAmount,
      receivingCurrency: form.receivingCurrency,
    });

    router.push({
      path: "/transaction/addtransaction",
      query: { fromDashboard: "true" },
    });
  } catch (error) {
    alertStore.alert(
      "error",
      "An error occurred while processing your request."
    );
  }
};

onMounted(async () => {
  await profileStore.getProfileDetail();
  Object.assign(profileDetails, profileStore.profileDetails); // Assign store data to reactive object

  if (profileDetails.userStatus !== 3) {
    return;
  }

  try {
    const [lockedRateResponse, transactionListResponse, rateResponse] =
      await Promise.all([
        transactionStore.getLockedRate(
          form.sendingCurrency,
          form.receivingCurrency
        ),
        transactionStore.getTransactionList(),
        transactionStore.getRate(),
      ]);

    if (transactionListResponse?.trxns) {
      transactions.value = transactionListResponse.trxns
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    }

    if (rateResponse?.status === 1 && rateResponse?.rates) {
      const allowedCurrencies =
        ENV_TYPE === "PRODUCTION"
          ? ["USD", "MYR", "IDR", "JPY", "THB"]
          : ["USD", "MYR", "IDR", "YEN", "THB"];

      previousRates.value = Object.fromEntries(
        rateResponse.rates.map((rate) => [rate.currency, parseFloat(rate.rate)])
      );

      rates.value = rateResponse.rates
        .filter((rate) => allowedCurrencies.includes(rate.currency))
        .map((rate) => {
          const currency = rate.currency;
          const isToggled = rateToggles.value[currency] || false;

          return {
            currency,
            rate: formatCurrency(
              previousRates.value[currency],
              currency,
              isToggled
            ), // Just the rate
          };
        })
        .sort(
          (a, b) =>
            allowedCurrencies.indexOf(a.currency) -
            allowedCurrencies.indexOf(b.currency)
        );
    }
  } catch (error) {
    alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
    alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
  }
});

// Track toggle state for each currency
const rateToggles = ref({}); // Object to store toggle state

const toggleRate = async (currency) => {
  rateToggles.value[currency] = !rateToggles.value[currency];

  await nextTick(); // Wait for Vue to apply updates

  const rateObj = rates.value.find((rate) => rate.currency === currency);
  if (rateObj) {
    rateObj.rate = rateToggles.value[currency]
      ? formatCurrency(1 / previousRates.value[currency], currency, true) // Reciprocal uses unique currency symbol
      : formatCurrency(previousRates.value[currency], currency, false); // Normal uses "S$"
  }
};

const navigateToTransactionDetail = async (memoId) => {
  const transaction = transactions.value.find((txn) => txn.memoId === memoId);

  if (transaction) {
    router.push({
      name: "transaction-detail",
      params: { memoId: transaction.memoId },
    });
  } else {
    alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
  }
};

const navigateToProfile = () => {
  router.push({ name: "profile" });
};

const navigateToAccountVerification = () => {
  router.push({ name: "accountverification" });
};
</script>

<style scoped>
@import "@/assets/dashboard.css";

/* @keyframes fadeUpOut {
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
} */
</style>
