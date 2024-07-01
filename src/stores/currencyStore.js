import { defineStore } from "pinia";

export const useCurrencyStore = defineStore("currencyStore", {
  state: () => ({
    currencies: [
      { code: "SGD", name: "Singapore Dollar" },
      { code: "USD", name: "US Dollar" },
      { code: "EUR", name: "Euro" },
      { code: "JPY", name: "Japanese Yen" },
      { code: "GBP", name: "British Pound" },
      { code: "AUD", name: "Australian Dollar" },
      { code: "CNY", name: "Chinese Yuan" },
      { code: "MYR", name: "Malaysian Ringgit" },
      { code: "NZD", name: "New Zealand Dollar" },
    ],
    senderCurrency: { code: "SGD", name: "Singapore Dollar" },
    recipientCurrency: { code: "USD", name: "US Dollar" },
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
