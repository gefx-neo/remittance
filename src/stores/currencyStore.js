// currencyStore.js
import { defineStore } from "pinia";

export const useCurrencyStore = defineStore("currencyStore", {
  state: () => ({
    currencies: ["sgd", "USD", "EUR", "JPY", "GBP"],
    senderCurrency: "SGD",
    recipientCurrency: "USD",
    isSenderDropdownOpen: false,
    isRecipientDropdownOpen: false,
  }),
  actions: {
    setSenderCurrency(currency) {
      this.senderCurrency = currency;
      this.isSenderDropdownOpen = false;
    },
    setRecipientCurrency(currency) {
      this.recipientCurrency = currency;
      this.isRecipientDropdownOpen = false;
    },
    toggleSenderDropdown() {
      this.isSenderDropdownOpen = !this.isSenderDropdownOpen;
      if (this.isSenderDropdownOpen) {
        this.isRecipientDropdownOpen = false;
      }
    },
    toggleRecipientDropdown() {
      this.isRecipientDropdownOpen = !this.isRecipientDropdownOpen;
      if (this.isRecipientDropdownOpen) {
        this.isSenderDropdownOpen = false;
      }
    },
    closeAllDropdowns() {
      this.isSenderDropdownOpen = false;
      this.isRecipientDropdownOpen = false;
    },
  },
});
