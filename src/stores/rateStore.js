import { defineStore } from "pinia";
import apiService from "@/services/apiService";
import { DEFAULT_ERROR_MESSAGE } from "@/services/apiService";
import { useStore, useAuthStore, useAlertStore } from "@/stores/index";
import socket from "@/plugins/socket";
import { CURRENCY_LIST, getAllowedCurrencies } from "@/utils/currencyUtils"; // Import the list
import { useEnvironment } from "@/composables/useEnvironment";

//  Only one global socket listener used — declared outside store for proper cleanup
let rateUpdateOneHandler = null;

export const useRateStore = defineStore("rate", {
  state: () => ({
    baseCurrency: "SGD", // centralized
    rates: [], // all real-time rates received via socket
    rateClasses: {}, // Track increase or decrease classes for each currency
  }),

  actions: {
    async getParticularRate(base) {
      const alertStore = useAlertStore();
      const authStore = useAuthStore();
      const { apiRateBaseUrl } = useEnvironment();
      try {
        const allowedCurrencies = getAllowedCurrencies(base);
        const result = [];

        for (const to of allowedCurrencies) {
          const url = `${apiRateBaseUrl}/rate.html?base=${base}&to=${to}&username=${encodeURIComponent(
            authStore.username
          )}&token=${encodeURIComponent(authStore.token)}`;

          const response = await fetch(url);
          const data = await response.json();

          result.push({
            currency: to,
            rate: parseFloat(data.rate), // already adjusted by backend
          });

          // 🔔 Subscribe to one-to-one real-time updates
          socket.emit("changeBase", {
            base,
            to,
            source: "rateStore",
            username: authStore.username,
            token: authStore.token,
          });
        }

        result.sort(
          (a, b) =>
            CURRENCY_LIST.indexOf(a.currency) -
            CURRENCY_LIST.indexOf(b.currency)
        );

        this.baseCurrency = base;
        this.rates = result;
        // console.log(this.rates);

        return {
          status: 1,
          rates: result,
        };
      } catch (error) {
        alertStore.alert("error", `Failed to fetch ${base} rates`);
        return {
          status: 0,
          error: error.message,
        };
      }
    },
    // subscribeToSingleRateUpdates() {
    //   // Prevent duplicate listeners
    //   socket.on("rateUpdateOne", ({ base, to, rate, source }) => {

    //     if (source !== "rateStore") return; // ✅ Add this check
    //     if (this.baseCurrency !== base) return;

    //     const prevRate = this.rates.find((r) => r.currency === to)?.rate;
    //     const prevDecimal = prevRate ? Math.round(prevRate * 10000) : null;
    //     const newDecimal = Math.round(parseFloat(rate) * 10000);

    //     if (prevDecimal !== null && prevDecimal !== newDecimal) {
    //       this.updateRateClass(to, parseFloat(rate));
    //       // console.log(
    //       //   `[RateStore] One-to-one update: ${to}: ${prevRate} ➡️ ${parseFloat(
    //       //     rate
    //       //   )}`
    //       // );
    //     }

    //     const idx = this.rates.findIndex((r) => r.currency === to);

    //     if (idx !== -1) {
    //       this.rates[idx].rate = parseFloat(rate);
    //     } else {
    //       this.rates.push({ currency: to, rate: parseFloat(rate) });
    //     }
    //   });
    // },
    subscribeToSingleRateUpdates() {
      // Prevent duplicate listeners
      if (rateUpdateOneHandler) return;

      rateUpdateOneHandler = ({ base, to, rate, source }) => {
        if (source !== "rateStore") return;
        if (this.baseCurrency !== base) return;

        const prevRate = this.rates.find((r) => r.currency === to)?.rate;
        const prevDecimal = prevRate ? Math.round(prevRate * 10000) : null;
        const newDecimal = Math.round(parseFloat(rate) * 10000);

        if (prevDecimal !== null && prevDecimal !== newDecimal) {
          this.updateRateClass(to, parseFloat(rate));
          // console.log(
          //   `[RateStore] One-to-one update: ${to}: ${prevRate} ➡️ ${parseFloat(
          //     rate
          //   )}`
          // );
        }

        const idx = this.rates.findIndex((r) => r.currency === to);
        if (idx !== -1) {
          this.rates[idx].rate = parseFloat(rate);
        } else {
          this.rates.push({ currency: to, rate: parseFloat(rate) });
        }
      };

      socket.on("rateUpdateOne", rateUpdateOneHandler);
    },
    cleanupSocketListeners() {
      if (rateUpdateOneHandler) {
        socket.off("rateUpdateOne", rateUpdateOneHandler);
        rateUpdateOneHandler = null;
        console.log("disconnected websocket");
      }
    },
    updateRateClass(currency, newRate) {
      const prevRate = this.rates.find((r) => r.currency === currency)?.rate;
      const prevDecimal = prevRate ? Math.round(prevRate * 10000) : null;
      const newDecimal = Math.round(newRate * 10000);

      // Handle reciprocal state comparison
      const isReciprocal = this.rateClasses[currency]?.includes("reciprocal");
      let prevReciprocalDecimal = null;
      let newReciprocalDecimal = null;

      if (isReciprocal) {
        prevReciprocalDecimal = prevRate
          ? Math.round((1 / prevRate) * 10000)
          : null;

        newReciprocalDecimal = Math.round((1 / newRate) * 10000);
      }

      // Determine if there is a meaningful change
      const hasChanged = isReciprocal
        ? prevReciprocalDecimal !== newReciprocalDecimal
        : prevDecimal !== newDecimal;

      if (!hasChanged) return;

      // Determine the change direction (increase or decrease) based on the state
      let className;

      if (isReciprocal) {
        className =
          newReciprocalDecimal > prevReciprocalDecimal
            ? "rate-increase"
            : "rate-decrease";
      } else {
        className =
          newDecimal > prevDecimal ? "rate-increase" : "rate-decrease";
      }

      // Apply the class only if it's a new change (to prevent flickering)
      if (this.rateClasses[currency] !== className) {
        this.rateClasses[currency] = className;

        // Automatically remove the class after 2 seconds
        setTimeout(() => {
          this.rateClasses[currency] = ""; // Clear the class after timeout
        }, 2000);
      }
    },
    toggleRateClass(currency) {
      // Clear the current rate class immediately
      this.rateClasses[currency] = "";
    },
    // subscribeToMultiRateUpdates() {
    //   socket.on("rateUpdate", ({ base, rates, source }) => {
    //     if (source !== "rateStore") return;

    //     if (this.baseCurrency !== base) return;
    //     // Collect changed rates in a concise format
    //     const changes = [];

    //     // Get allowed currencies, excluding the base
    //     const allowedCurrencies = getAllowedCurrencies(base);

    //     // Iterate over the received rates
    //     const formattedRates = Object.entries(rates)
    //       .filter(([currency]) => allowedCurrencies.includes(currency))
    //       .map(([currency, value]) => {
    //         const prevRate = this.rates.find(
    //           (r) => r.currency === currency
    //         )?.rate;

    //         const prevDecimal = prevRate ? Math.round(prevRate * 10000) : null;
    //         const newDecimal = Math.round(parseFloat(value) * 10000);

    //         // Check if the 4th decimal place has changed
    //         if (prevDecimal !== null && prevDecimal !== newDecimal) {
    //           changes.push(`${currency}: ${prevRate} ➡️ ${parseFloat(value)}`);
    //           this.updateRateClass(currency, parseFloat(value));
    //         }
    //         return { currency, rate: parseFloat(value) };
    //       });

    //     // Log only changed currencies with their previous and new values
    //     if (changes.length) {
    //       console.log(`[RateStore] Changes: ${changes.join(", ")}`);
    //     }

    //     // Sort the rates based on CURRENCY_LIST order before updating the store
    //     formattedRates.sort(
    //       (a, b) =>
    //         CURRENCY_LIST.indexOf(a.currency) -
    //         CURRENCY_LIST.indexOf(b.currency)
    //     );

    //     // Update the store with the mapped and sorted rates
    //     this.rates = formattedRates;
    //   });
    // },
    // For fetch multi in the future if needed
    // async getRate(base) {
    //   const alertStore = useAlertStore();
    //   const authStore = useAuthStore();

    //   try {
    //     const baseUrl = import.meta.env.VITE_RATE_API_URL;
    //     const response = await fetch(`${baseUrl}/rate.html?base=${base}`);
    //     const data = await response.json();

    //     if (!data?.Rate) throw new Error("Invalid rate response");

    //     const allowedCurrencies = getAllowedCurrencies(base);
    //     const formattedRates = data.Rate.filter((rate) =>
    //       allowedCurrencies.includes(rate.symbol)
    //     ).map((rate) => ({
    //       currency: rate.symbol,
    //       rate: parseFloat(rate.value),
    //     }));

    //     // Sort the rates based on CURRENCY_LIST order
    //     formattedRates.sort(
    //       (a, b) =>
    //         CURRENCY_LIST.indexOf(a.currency) -
    //         CURRENCY_LIST.indexOf(b.currency)
    //     );

    //     this.baseCurrency = base;
    //     this.rates = formattedRates;
    //     console.log(this.rates);

    //     return {
    //       status: 1,
    //       rates: formattedRates,
    //     };
    //   } catch (error) {
    //     alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
    //   }
    // },
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
