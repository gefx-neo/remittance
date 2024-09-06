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
    beneficiaryCurrency: { code: "USD", name: "US Dollar" },
    isSenderDropdownOpen: false,
    isBeneficiaryDropdownOpen: false,
  }),
  actions: {
    setSenderCurrency(currency) {
      this.senderCurrency = currency;
      this.isSenderDropdownOpen = false;
    },
    setBeneficiaryCurrency(currency) {
      this.beneficiaryCurrency = currency;
      this.isBeneficiaryDropdownOpen = false;
    },
    toggleSenderDropdown() {
      this.isSenderDropdownOpen = !this.isSenderDropdownOpen;
      if (this.isSenderDropdownOpen) {
        this.isBeneficiaryDropdownOpen = false;
      }
    },
    toggleBeneficiaryDropdown() {
      this.isBeneficiaryDropdownOpen = !this.isBeneficiaryDropdownOpen;
      if (this.isBeneficiaryDropdownOpen) {
        this.isSenderDropdownOpen = false;
      }
    },
    closeAllDropdowns() {
      this.isSenderDropdownOpen = false;
      this.isBeneficiaryDropdownOpen = false;
    },
  },
});
