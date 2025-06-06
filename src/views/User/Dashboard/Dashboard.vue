<template>
  <div class="content-area" v-if="$isVerifiedUser(profileDetails.userStatus)">
    <div class="exchange-rate">
      <div class="form-section">
        <InputAmount
          id="sendingAmount"
          label="Sending amount"
          :modelValue="form.sendingAmount"
          @update:modelValue="updateSendingAmount"
          :isSending="true"
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
          1 {{ form.sendingCurrency }} ≈
          {{ formatCurrency(transactionStore.rate) }}
          {{ form.receivingCurrency }}
        </div>

        <div class="button-group">
          <ButtonAPI
            :disabled="isDashboardLoading"
            :loading="isDashboardLoading"
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
        <div class="tabs">
          <div class="title">Transactions</div>
          <!-- <router-link to="/transaction">View all</router-link> -->
        </div>

        <div v-if="isDashboardLoading">
          <SkeletonLoader type="dashboardTransaction" :count="9" />
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
                      priority:
                        transaction.status === 3 && transaction.isUrgent === 1,
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
        <button class="btn-load" @click="navigateToTransaction">
          View all
        </button>
      </div>
      <div class="currency">
        <div class="tabs">
          <Tooltip
            text="SGD"
            :class="{
              active: rateStore.baseCurrency === 'SGD',
              animating: isAnimating,
            }"
            @animationstart="startAnimation"
            @animationend="endAnimation"
            @click="updateRate('SGD')"
          >
            <img
              :src="
                $getImagePath(
                  `currency/sgd.${
                    rateStore.baseCurrency === 'SGD' ? 'png' : 'svg'
                  }`
                )
              "
            />
          </Tooltip>
          <Tooltip
            text="USD"
            :class="{
              active: rateStore.baseCurrency === 'USD',
              animating: isAnimating,
            }"
            @animationstart="startAnimation"
            @animationend="endAnimation"
            @click="updateRate('USD')"
          >
            <img
              :src="
                $getImagePath(
                  `currency/usd.${
                    rateStore.baseCurrency === 'USD' ? 'png' : 'svg'
                  }`
                )
              "
            />
          </Tooltip>
        </div>

        <div v-if="isDashboardLoading">
          <SkeletonLoader type="dashboardCurrentRates" :count="6" />
        </div>
        <div v-else-if="rates.length === 0">
          <EmptyList />
        </div>
        <div v-else>
          <div class="item-section">
            <div v-for="(rate, index) in rates" :key="index" class="item">
              <div
                class="country"
                :class="{ reciprocal: rateToggles[rate.currency] }"
              >
                <!-- First Image: Other currency (non-base) -->
                <Tooltip :text="rate.currency">
                  <div class="icon-round">
                    <img :src="getCurrencyImagePath(rate.currency)" />
                  </div>
                </Tooltip>

                <!-- Toggle Button -->
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

                <!-- Second Image: Base currency (always PNG) -->
                <Tooltip :text="rateStore.baseCurrency">
                  <div class="icon-round">
                    <img :src="getCurrencyImagePath(rateStore.baseCurrency)" />
                  </div>
                </Tooltip>
              </div>
              <div v-if="isRateLoading" class="skeleton text-sm h-sm"></div>
              <div
                class="rate"
                :class="rateStore.rateClasses[rate.currency] || ''"
                v-else
              >
                {{
                  formatCurrency(
                    rate.rate,
                    rate.currency,
                    rateToggles[rate.currency]
                  )
                }}
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
import { ref, reactive, onMounted, onUnmounted, watch, nextTick } from "vue";
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
  useRateStore,
  useAuthStore,
  useStore,
} from "@/stores/index.js";
import { useValidation } from "@/composables/useValidation";
import {
  formValidation,
  currencySchema,
} from "./components/schemas/dashboardSchema";
import {
  formatNumber,
  getTransactionStatus,
  formatDateTime,
} from "@/utils/transactionUtils.js";
import {
  formatCurrency,
  getAllowedCurrencies,
  getCurrencyImagePath,
} from "@/utils/currencyUtils";
import SkeletonLoader from "@/views/SkeletonLoader.vue";
import EmptyList from "@/views/EmptyList.vue";
import { useEnvironment } from "@/composables/useEnvironment";
import { DEFAULT_ERROR_MESSAGE } from "@/services/apiService";
import socket from "@/plugins/socket";
import Tooltip from "@/components/Tooltip.vue";
import { CURRENCY_LIST } from "@/utils/currencyUtils"; // Import the list

const router = useRouter();
const transactionStore = useTransactionStore();
const rateStore = useRateStore();
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

const profileDetails = reactive({});

const transactions = ref([]);
const rates = ref([]);
const previousRates = ref({});
const baseCurrency = ref("SGD");

const updateSendingAmount = async (amount) => {
  const formattedAmount = parseFloat(amount);

  if (form.sendingAmount === formattedAmount) return;

  form.sendingAmount = formattedAmount;
};

const updateSendingCurrency = async (currency) => {
  if (form.sendingCurrency === currency) return;

  form.sendingCurrency = currency;
  const target = form.receivingCurrency;

  transactionStore.baseCurrency = currency;

  await transactionStore.getParticularRate(currency, target);
};

const updateReceivingCurrency = async (currency) => {
  if (form.receivingCurrency === currency) return;

  form.receivingCurrency = currency;
  const base = form.sendingCurrency;

  await transactionStore.getParticularRate(base, currency);
};

const handleSubmit = async () => {
  form.sendingAmount = parseFloat(form.sendingAmount);

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
    alertStore.alert("error", "Please fill in valid amounts.");
    return;
  }

  try {
    const result = await transactionStore.getLockedTransaction(
      form.sendingAmount,
      form.sendingCurrency,
      form.receivingCurrency,
      transactionStore.paymentType
    );

    if (!result) return;

    form.receivingAmount = parseFloat(
      (form.sendingAmount * result.rate).toFixed(2)
    );

    transactionStore.setTransactionData({
      sendingAmount: form.sendingAmount,
      sendingCurrency: form.sendingCurrency,
      receivingAmount: form.receivingAmount,
      receivingCurrency: form.receivingCurrency,
      memoId: result.memoId,
      rate: result.rate,
      fee: result.fee,
      paymentType: "localpayment",
    });

    router.push({
      path: "/transaction/addtransaction",
      query: { fromDashboard: "true" },
    });
  } catch (error) {
    alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
  }
};

const isRateLoading = ref(false);

const updateRate = async (selectedBase) => {
  if (rateStore.baseCurrency === selectedBase || isRateLoading.value) return;

  // Step 1: Immediately update baseCurrency to reflect flag switch
  rateStore.baseCurrency = selectedBase;

  // Step 2: Delay before showing loader so flag changes first
  await nextTick(); // Allow DOM to update first
  await new Promise((resolve) => setTimeout(resolve, 100)); // Slight delay (~100ms)

  isRateLoading.value = true;

  try {
    socket.emit("changeBase", {
      base: selectedBase,
      source: "rateStore",
    });

    const rateResponse = await rateStore.getParticularRate(selectedBase);

    if (rateResponse.status === 1 && rateResponse.rates) {
      previousRates.value = Object.fromEntries(
        rateResponse.rates.map((rate) => [rate.currency, rate.rate])
      );

      rates.value = rateResponse.rates.map((rate) => {
        const isReciprocal = rateToggles.value[rate.currency];
        return {
          currency: rate.currency,
          rate: isReciprocal ? 1 / rate.rate : rate.rate,
        };
      });
    }
  } catch (error) {
    alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
  } finally {
    isRateLoading.value = false;
  }
};

const isDashboardLoading = ref(true);

onMounted(async () => {
  console.log("dashboard token", authStore.token);
  await profileStore.getProfileDetail();
  Object.assign(profileDetails, profileStore.profileDetails);

  if (profileDetails.userStatus !== 3) return;

  rateStore.resetStore(); // Clear rate classes
  try {
    const base = baseCurrency.value;
    const target = form.receivingCurrency;

    // Call both getParticularRate in parallel
    const transactionRatePromise = transactionStore.getParticularRate(
      base,
      target
    );
    const rateStoreRatePromise = rateStore.getParticularRate(base);

    // Fetch rates + transaction list simultaneously
    const [transactionListResponse] = await Promise.all([
      transactionStore.getTransactionList(),
      transactionRatePromise,
      rateStoreRatePromise,
    ]);

    // Always subscribe to single rate updates only
    rateStore.subscribeToSingleRateUpdates();

    if (transactionListResponse?.trxns) {
      transactions.value = transactionListResponse.trxns
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 9);
    }
    isDashboardLoading.value = false;
  } catch (error) {
    alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
  }
});

// Track toggle state for each currency
const rateToggles = ref({}); // Object to store toggle state

const toggleRate = async (currency) => {
  rateToggles.value[currency] = !rateToggles.value[currency];
  await nextTick();

  const originalRate = previousRates.value[currency];
  const index = rates.value.findIndex((r) => r.currency === currency);

  if (index !== -1 && originalRate) {
    const isReciprocal = rateToggles.value[currency];
    const newRate = isReciprocal ? 1 / originalRate : originalRate;
    rates.value[index].rate = newRate;

    // Call the centralized toggleRateClass in the store
    rateStore.toggleRateClass(currency);
  }
};

const navigateToTransaction = () => {
  router.push({
    name: "transaction",
  });
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

const navigateToAccountVerification = () => {
  router.push({ name: "accountverification" });
};

watch(
  () => rateStore.rates,
  (newRates) => {
    if (!Array.isArray(newRates)) return; // ✅ prevent crash

    const allowedRates = newRates
      .filter((rate) =>
        getAllowedCurrencies(rateStore.baseCurrency).includes(rate.currency)
      )
      .sort(
        (a, b) =>
          CURRENCY_LIST.indexOf(a.currency) - CURRENCY_LIST.indexOf(b.currency)
      );

    previousRates.value = Object.fromEntries(
      allowedRates.map((rate) => [rate.currency, rate.rate])
    );

    rates.value = allowedRates.map((rate) => {
      const isReciprocal = rateToggles.value[rate.currency] || false;
      const displayRate = isReciprocal ? 1 / rate.rate : rate.rate;

      // Update the class inversion if in reciprocal state
      const currentClass = rateStore.rateClasses[rate.currency];
      if (isReciprocal && currentClass) {
        rateStore.rateClasses[rate.currency] =
          currentClass === "rate-increase" ? "rate-decrease" : "rate-increase";
      }

      return {
        currency: rate.currency,
        rate: displayRate,
      };
    });
  },
  { deep: true, immediate: true }
);

const isAnimating = ref(false);

const startAnimation = () => {
  isAnimating.value = true;
};

const endAnimation = () => {
  isAnimating.value = false;
};

onUnmounted(() => {
  rateStore.cleanupSocketListeners();
});
</script>
<style scoped>
@import "@/assets/dashboard.css";

.rate {
  color: var(--black);
  font-weight: bold;
  transition: background-color 2s ease-in-out, color 2s ease-in-out;
  display: flex;
  justify-content: end;
  padding: 0 var(--size-4);
  margin-inline: -4px;
  border-radius: var(--border-sm);
}

.rate-increase {
  animation: flashBackground 2s forwards;
}

.rate-decrease {
  animation: flashBackgroundRed 2s forwards;
}

@keyframes flashBackground {
  0% {
    background-color: transparent;
    color: var(--black);
  }
  10% {
    background-color: rgba(103, 204, 137, 0.8);
    color: var(--white);
  }
  90% {
    background-color: rgba(103, 204, 137, 0.8);
    color: var(--white);
  }
  100% {
    background-color: transparent;
    color: var(--black);
  }
}

@keyframes flashBackgroundRed {
  0% {
    background-color: transparent;
    color: var(--black);
  }
  10% {
    background-color: rgba(226, 10, 59, 0.8);
    color: white;
    padding-left: var(--size-4);
    border-radius: var(--border-sm);
  }
  90% {
    background-color: rgba(226, 10, 59, 0.8);
    color: white;
    padding-left: var(--size-4);
    border-radius: var(--border-sm);
  }
  100% {
    background-color: transparent;
    color: var(--black);
  }
}

.icon-rectangle {
  min-width: var(--size-56);
  max-width: var(--size-56);
  min-height: var(--size-48);
  max-height: var(--size-48);
  border-radius: var(--border-sm);
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--sky-blue);
}

.icon-rectangle img {
  min-width: var(--size-56);
  max-width: var(--size-56);
  min-height: var(--size-48);
  max-height: var(--size-48);
  border: 1px solid var(--light-grey);
  border-radius: var(--border-sm);
}

@keyframes pulse {
  50% {
    opacity: 0.5;
  }
}

.skeleton {
  background: var(--lighter-grey);
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  border-radius: var(--border-sm);
}

.text-sm {
  width: var(--size-64);
}

.text-xl {
  width: var(--size-176);
}

.h-sm {
  height: 14px;
  border-radius: var(--size-4);
}

.h-md {
  height: 16px;
}

@media (max-width: 1023px) {
  .h-sm {
    height: 13px;
    border-radius: var(--size-4);
  }

  .h-md {
    height: 15px;
  }
}
</style>
