import { defineStore } from "pinia";
import apiService from "@/services/apiService";
import { DEFAULT_ERROR_MESSAGE } from "@/services/apiService";
import { useStore, useAuthStore, useAlertStore } from "@/stores/index";
import socket from "@/plugins/socket";
import { CURRENCY_LIST, getAllowedCurrencies } from "@/utils/currencyUtils"; // Import the list

export const useRateStore = defineStore("rate", {
  state: () => ({
    baseCurrency: "SGD", // centralized
    rates: [], // all real-time rates received via socket
    reciprocalRates: [],
    rateClasses: {}, // Track increase or decrease classes for each currency
  }),
  actions: {
    async getRate(base) {
      const alertStore = useAlertStore();
      try {
        const baseUrl = import.meta.env.VITE_RATE_API_URL;
        const response = await fetch(`${baseUrl}/rate.html?base=${base}`);
        const data = await response.json();

        if (!data?.Rate) throw new Error("Invalid rate response");

        const allowedCurrencies = getAllowedCurrencies(base);
        const formattedRates = data.Rate.filter((rate) =>
          allowedCurrencies.includes(rate.symbol)
        ).map((rate) => ({
          currency: rate.symbol,
          rate: parseFloat(rate.value),
        }));

        // Sort the rates based on CURRENCY_LIST order
        formattedRates.sort(
          (a, b) =>
            CURRENCY_LIST.indexOf(a.currency) -
            CURRENCY_LIST.indexOf(b.currency)
        );

        this.baseCurrency = base;
        this.rates = formattedRates;

        return {
          status: 1,
          rates: formattedRates,
        };
      } catch (error) {
        alertStore.alert("error", "Failed to fetch rates from rate API");
      }
    },
    updateRateClass(currency, newRate) {
      const prevRate = this.rates.find((r) => r.currency === currency)?.rate;
      // Use rounded values for comparison to ensure displayed precision matches
      const prevDecimal = prevRate ? Math.round(prevRate * 10000) : null;
      const newDecimal = Math.round(newRate * 10000);

      // If there's no previous rate or no change in the 4th decimal, do nothing
      if (prevDecimal === null || prevDecimal === newDecimal) {
        return;
      }

      // Determine the change direction (increase or decrease)
      const className =
        newDecimal > prevDecimal ? "rate-increase" : "rate-decrease";

      // Apply the class only if it's a new change (to prevent flickering)
      if (this.rateClasses[currency] !== className) {
        this.rateClasses[currency] = className;

        // Automatically remove the class after 2 seconds
        setTimeout(() => {
          if (this.rateClasses[currency] === className) {
            this.rateClasses[currency] = ""; // Clear the class after timeout
          }
        }, 2000);
      }
    },
    toggleRateClass(currency) {
      const currentClass = this.rateClasses[currency] || "rate";

      // Determine the new class based on the current class
      let newClass;
      if (currentClass === "rate-increase") {
        newClass = "rate-decrease";
      } else if (currentClass === "rate-decrease") {
        newClass = "rate-increase";
      } else {
        // If the current class is just 'rate', do nothing
        return;
      }

      // Update the class in the store
      this.rateClasses[currency] = newClass;

      // Set timeout to remove the class after 2 seconds
      setTimeout(() => {
        if (this.rateClasses[currency] === newClass) {
          this.rateClasses[currency] = "";
        }
      }, 2000);
    },
    initSocketRateUpdates() {
      socket.on("rateUpdate", ({ base, rates, source }) => {
        if (source !== "rateStore") return;
        if (this.baseCurrency !== base) {
          this.baseCurrency = base;
        }

        // Collect changed rates in a concise format
        const changes = [];

        // Get allowed currencies, excluding the base
        const allowedCurrencies = getAllowedCurrencies(base);

        // Iterate over the received rates
        const formattedRates = Object.entries(rates)
          .filter(([currency]) => allowedCurrencies.includes(currency))
          .map(([currency, value]) => {
            const prevRate = this.rates.find(
              (r) => r.currency === currency
            )?.rate;
            const prevDecimal = prevRate ? Math.round(prevRate * 10000) : null;
            const newDecimal = Math.round(parseFloat(value) * 10000);

            // Check if the 4th decimal place has changed
            if (prevDecimal !== null && prevDecimal !== newDecimal) {
              changes.push(`${currency}: ${prevRate} ➡️ ${parseFloat(value)}`);
              this.updateRateClass(currency, parseFloat(value));
            }

            return { currency, rate: parseFloat(value) };
          });

        // Log only changed currencies with their previous and new values
        // if (changes.length) {
        //   console.log(`[RateStore] Changes: ${changes.join(", ")}`);
        // }

        // Sort the rates based on CURRENCY_LIST order before updating the store
        formattedRates.sort(
          (a, b) =>
            CURRENCY_LIST.indexOf(a.currency) -
            CURRENCY_LIST.indexOf(b.currency)
        );

        // Update the store with the mapped and sorted rates
        this.rates = formattedRates;
      });
    },
    resetStore() {
      this.$reset();
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "rateStore", // The key to use in localStorage
        storage: localStorage, // Use localStorage
        paths: [],
      },
    ],
  },
});
