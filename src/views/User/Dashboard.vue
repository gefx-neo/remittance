<template>
  <div class="content-area">
    <div class="exchange-rate">
      <div class="form-section">
        <div class="form-group">
          <label>Sending amount</label>
          <div class="input-group">
            <input type="text" />
            <div class="dropdown">
              <button @click="currencyStore.toggleSenderDropdown">
                <img
                  :src="`src/assets/currency/${currencyStore.senderCurrency.code}.svg`"
                />
                <span>{{ currencyStore.senderCurrency.code }}</span>
                <font-awesome-icon :icon="['fa', 'chevron-down']" />
              </button>
              <CurrencyDropdown
                currencyType="sender"
                :isDropdownOpen="currencyStore.isSenderDropdownOpen"
                @updateCurrency="updateSenderCurrency"
              />
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>Receiving amount</label>
          <div class="input-group">
            <input type="text" />
            <div class="dropdown">
              <button @click="currencyStore.toggleBeneficiaryDropdown">
                <img
                  :src="`src/assets/currency/${currencyStore.beneficiaryCurrency.code}.svg`"
                  class="currency-image"
                />
                <span>{{ currencyStore.beneficiaryCurrency.code }}</span>
                <font-awesome-icon :icon="['fa', 'chevron-down']" />
              </button>
              <CurrencyDropdown
                currencyType="beneficiary"
                :isDropdownOpen="currencyStore.isBeneficiaryDropdownOpen"
                @updateCurrency="updateBeneficiaryCurrency"
              />
            </div>
          </div>
        </div>
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
        <button class="btn-red">Calculate</button>
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
      <div class="beneficiary">
        <div class="title">
          <h3>Popular Beneficiary</h3>
          <router-link to="/history">
            <font-awesome-icon :icon="['fa', 'plus']" />
          </router-link>
        </div>
        <div class="item-section">
          <div
            v-for="(beneficiary, index) in beneficiaries"
            :key="index"
            class="item"
          >
            <div class="icon-round">{{ beneficiary.initials }}</div>
            <span>{{ beneficiary.name }}</span>
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
  <div
    class="backdrop"
    :class="{
      open:
        currencyStore.isBeneficiaryDropdownOpen ||
        currencyStore.isSenderDropdownOpen,
    }"
  ></div>
</template>

<script setup>
import { onMounted, onUnmounted, watch } from "vue";
import CurrencyDropdown from "@/components/CurrencyDropdown.vue";
import { useCurrencyStore } from "@/stores/currencyStore";

const currencyStore = useCurrencyStore();

const updateSenderCurrency = (currency) => {
  currencyStore.setSenderCurrency(currency);
  console.log("Sender Currency Set To:", currencyStore.senderCurrency);
};

const updateBeneficiaryCurrency = (currency) => {
  currencyStore.setBeneficiaryCurrency(currency);
  console.log(
    "Beneficiary Currency Set To:",
    currencyStore.beneficiaryCurrency
  );
};

const transactions = [
  {
    number: "#60011234",
    status: "Unpaid",
    date: "28 July 2024",
    sendingAmount: "1,463.82 USD",
    receivingAmount: "2,000 SGD",
  },
  {
    number: "#60011233",
    status: "Pending",
    date: "27 July 2024",
    sendingAmount: "1,463.82 USD",
    receivingAmount: "2,000 SGD",
  },
  {
    number: "#60011232",
    status: "Pending",
    date: "26 July 2024",
    sendingAmount: "1,463.82 USD",
    receivingAmount: "2,000 SGD",
  },
  {
    number: "#60011231",
    status: "Completed",
    date: "16 June 2024",
    sendingAmount: "1,463.82 USD",
    receivingAmount: "2,000 SGD",
  },
  {
    number: "#60011230",
    status: "Failed",
    date: "16 June 2024",
    sendingAmount: "100,000 YEN",
    receivingAmount: "842 SGD",
  },
];

const beneficiaries = [
  { initials: "JD", name: "John Doe" },
  { initials: "CW", name: "Sylvie Goh" },
  { initials: "SD", name: "Shopee Delivery" },
  { initials: "HL", name: "Henry Lim" },
  { initials: "JD", name: "John Doe" },
  { initials: "LC", name: "Linda Cheng" },
];

const currencies = [
  { icon: "src/assets/currency/usd.svg", code: "USD", rate: "SGD 1.36" },
  { icon: "src/assets/currency/eur.svg", code: "EUR", rate: "SGD 1.46" },
  { icon: "src/assets/currency/gbp.svg", code: "GBP", rate: "SGD 1.72" },
  { icon: "src/assets/currency/cny.svg", code: "CNY", rate: "SGD 0.19" },
  { icon: "src/assets/currency/jpy.svg", code: "JPY", rate: "SGD 0.0084" },
];

const handleClickOutside = (event) => {
  if (!event.target.closest(".dropdown")) {
    currencyStore.closeAllDropdowns();
  }
};

const toggleNoScroll = () => {
  if (
    currencyStore.isSenderDropdownOpen ||
    currencyStore.isBeneficiaryDropdownOpen
  ) {
    document.body.classList.add("no-scroll");
  } else {
    document.body.classList.remove("no-scroll");
  }
};

watch(() => currencyStore.isSenderDropdownOpen, toggleNoScroll);
watch(() => currencyStore.isBeneficiaryDropdownOpen, toggleNoScroll);

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
@import "@/assets/dashboard.css";
</style>
