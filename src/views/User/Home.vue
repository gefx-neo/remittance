<template>
  <div class="content-area">
    <div class="exchange-rate">
      <div class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
          <path
            d="M535 41c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l64 64c4.5 4.5 7 10.6 7 17s-2.5 12.5-7 17l-64 64c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l23-23L384 112c-13.3 0-24-10.7-24-24s10.7-24 24-24l174.1 0L535 41zM105 377l-23 23L256 400c13.3 0 24 10.7 24 24s-10.7 24-24 24L81.9 448l23 23c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L7 441c-4.5-4.5-7-10.6-7-17s2.5-12.5 7-17l64-64c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9zM96 64H337.9c-3.7 7.2-5.9 15.3-5.9 24c0 28.7 23.3 52 52 52l117.4 0c-4 17 .6 35.5 13.8 48.8c20.3 20.3 53.2 20.3 73.5 0L608 169.5V384c0 35.3-28.7 64-64 64H302.1c3.7-7.2 5.9-15.3 5.9-24c0-28.7-23.3-52-52-52l-117.4 0c4-17-.6-35.5-13.8-48.8c-20.3-20.3-53.2-20.3-73.5 0L32 342.5V128c0-35.3 28.7-64 64-64zm64 64H96v64c35.3 0 64-28.7 64-64zM544 320c-35.3 0-64 28.7-64 64h64V320zM320 352a96 96 0 1 0 0-192 96 96 0 1 0 0 192z"
          />
        </svg>
      </div>
      <div class="form-group">
        <label>You send</label>
        <div class="input-group">
          <input type="text" />
          <div class="dropdown">
            <button @click="currencyStore.toggleSenderDropdown">
              <img
                :src="`src/assets/currency/${currencyStore.senderCurrency}.svg`"
                class="currency-image"
              />
              <span>{{ currencyStore.senderCurrency }}</span>
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
        <label>Recipent gets</label>
        <div class="input-group">
          <input type="text" />
          <div class="dropdown">
            <button @click="currencyStore.toggleRecipientDropdown">
              <img
                :src="`src/assets/currency/${currencyStore.recipientCurrency}.svg`"
                class="currency-image"
              />
              <span>{{ currencyStore.recipientCurrency }}</span>
              <font-awesome-icon :icon="['fa', 'chevron-down']" />
            </button>
            <CurrencyDropdown
              currencyType="recipient"
              :isDropdownOpen="currencyStore.isRecipientDropdownOpen"
              @updateCurrency="updateRecipientCurrency"
            />
          </div>
        </div>
      </div>
      <div class="button-group">
        <label>&nbsp;</label>
        <button class="btn-red">Send money</button>
      </div>
    </div>

    <div class="transaction">
      <div class="history">
        <div class="title">
          <h3>Past Transactions</h3>
          <router-link to="/history">View all</router-link>
        </div>
        <div class="item-section">
          <div
            v-for="(transaction, index) in transactions"
            :key="index"
            class="item"
          >
            <div class="icon-round">
              <font-awesome-icon :icon="['fas', 'dollar-sign']" />
            </div>
            <div class="detail">
              <div class="first-row">
                <div class="name">{{ transaction.name }}</div>
                <div class="status">
                  <span>Sent</span>
                  <span></span>
                  <span>{{ transaction.date }}</span>
                </div>
              </div>
              <div class="second-row">
                <div class="remitted-amount">
                  {{ transaction.remittedAmount }}
                </div>
                <div class="paid-amount">{{ transaction.paidAmount }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="recipent">
        <div class="title">
          <h3>Popular Recipients</h3>
          <router-link to="/history">View</router-link>
        </div>
        <div class="item-section">
          <div
            v-for="(recipient, index) in recipients"
            :key="index"
            class="item in recipents"
          >
            <div class="icon-round">{{ recipient.initials }}</div>
            <span>{{ recipient.name }}</span>
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
import { onMounted, onUnmounted, watch } from "vue";
import CurrencyDropdown from "@/components/CurrencyDropdown.vue";
import { useCurrencyStore } from "@/stores/currencyStore";

const currencyStore = useCurrencyStore();

const updateSenderCurrency = (currency) => {
  currencyStore.setSenderCurrency(currency);
};

const updateRecipientCurrency = (currency) => {
  currencyStore.setRecipientCurrency(currency);
};

const transactions = [
  {
    name: "John Doe",
    date: "2 May 2024",
    remittedAmount: "1,463.82 USD",
    paidAmount: "2,000 SGD",
  },
  {
    name: "John Doe",
    date: "2 May 2024",
    remittedAmount: "1,463.82 USD",
    paidAmount: "2,000 SGD",
  },
  {
    name: "John Doe",
    date: "2 May 2024",
    remittedAmount: "1,463.82 USD",
    paidAmount: "2,000 SGD",
  },
  {
    name: "John Doe",
    date: "2 May 2024",
    remittedAmount: "1,463.82 USD",
    paidAmount: "2,000 SGD",
  },
  {
    name: "John Doe",
    date: "2 May 2024",
    remittedAmount: "1,463.82 USD",
    paidAmount: "2,000 SGD",
  },
];

const recipients = [
  { initials: "JD", name: "John Doe" },
  { initials: "CW", name: "Sylvie Goh" },
  { initials: "SD", name: "Shopee Delivery" },
  { initials: "HL", name: "Henry Lim" },
  { initials: "JD", name: "John Doe" },
  { initials: "LC", name: "Linda Cheng" },
];

const currencies = [
  { icon: "src/assets/currency/usd.svg", code: "USD", rate: "SGD 1.36" },
  { icon: "src/assets/currency/usd.svg", code: "USD", rate: "SGD 1.36" },
  { icon: "src/assets/currency/usd.svg", code: "USD", rate: "SGD 1.36" },
  { icon: "src/assets/currency/usd.svg", code: "USD", rate: "SGD 1.36" },
  { icon: "src/assets/currency/usd.svg", code: "USD", rate: "SGD 1.36" },
];
const handleClickOutside = (event) => {
  if (!event.target.closest(".dropdown")) {
    currencyStore.closeAllDropdowns();
  }
};

const toggleNoScroll = () => {
  if (
    currencyStore.isSenderDropdownOpen ||
    currencyStore.isRecipientDropdownOpen
  ) {
    document.body.classList.add("no-scroll");
  } else {
    document.body.classList.remove("no-scroll");
  }
};

watch(() => currencyStore.isSenderDropdownOpen, toggleNoScroll);
watch(() => currencyStore.isRecipientDropdownOpen, toggleNoScroll);

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  console.log("onmountedclick");
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  console.log("onountedclick");
});
</script>

<style scoped>
@import "src/assets/home.css";
</style>
