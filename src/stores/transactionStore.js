import { defineStore } from "pinia";
import apiService from "@/services/apiService";
import { DEFAULT_ERROR_MESSAGE } from "@/services/apiService";
import {
  useStore,
  useAuthStore,
  useAlertStore,
  useRateStore,
} from "@/stores/index";
import socket from "@/plugins/socket";
import { CURRENCY_LIST, getAllowedCurrencies } from "@/utils/currencyUtils"; // Import the list

export const useTransactionStore = defineStore("transaction", {
  state: () => ({
    memoId: null,
    rate: null,
    fee: null,
    sendingAmount: 0,
    sendingCurrency: "SGD",
    receivingAmount: 0,
    receivingCurrency: "MYR",
    error: null,
    baseCurrency: "SGD", // centralized
    rates: [], // all real-time rates received via socket
    rateClasses: {}, // Track increase or decrease classes for each currency
  }),
  actions: {
    setTransactionData(data) {
      this.sendingAmount = data.sendingAmount;
      this.receivingAmount = data.receivingAmount;
      this.sendingCurrency = data.sendingCurrency;
      this.receivingCurrency = data.receivingCurrency;
    },
    async getTransactionList() {
      const store = useStore();
      const authStore = useAuthStore();
      const alertStore = useAlertStore();
      store.isLoading = true;

      try {
        const response = await apiService.getRequest(
          `/transaction/list?username=${authStore.username}`
        );

        if (response.status === 1) {
          if (response.token) {
            authStore.refreshSession(response.token, authStore.username);
          }
        } else {
          alertStore.alert("error", response.message);
        }
        return response;
      } catch (error) {
        alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
        throw error;
      } finally {
        store.isLoading = false;
      }
    },

    async getTransactionDetail(memoId) {
      const store = useStore();
      const authStore = useAuthStore();
      const alertStore = useAlertStore();
      store.isLoading = true;

      try {
        const response = await apiService.getRequest(
          `/transaction/transactionDetails?username=${authStore.username}&memoId=${memoId}`
        );

        if (response.status === 1) {
          if (response.token) {
            authStore.refreshSession(response.token, authStore.username);
          }
        } else {
          alertStore.alert("error", response.message);
        }
        return response;
      } catch (error) {
        alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
        throw error;
      } finally {
        store.isLoading = false;
      }
    },
    async uploadFiles(formData) {
      const alertStore = useAlertStore();
      try {
        const response = await apiService.postRequest(
          "/transaction/upload",
          formData,
          {
            format: "multipart/form-data",
          }
        );
        return response;
      } catch (error) {
        alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
        throw error;
      }
    },
    async addTransaction(payload) {
      const store = useStore();
      const authStore = useAuthStore();
      const alertStore = useAlertStore();
      store.isLoading = true;

      try {
        const response = await apiService.postRequest(
          "/transaction/submitTransaction",
          payload,
          { format: "raw" }
        );

        if (response.status === 1) {
          if (response.token) {
            authStore.refreshSession(response.token, payload.username);
          }
        } else {
          alertStore.alert("error", response.message);
        }
        return response;
      } catch (error) {
        alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
        throw error;
      } finally {
        store.isLoading = false;
      }
    },

    // async getLockedRate(payCurrency, getCurrency) {
    //   const store = useStore();
    //   const authStore = useAuthStore();
    //   const alertStore = useAlertStore();
    //   store.isMoneyLoading = true;
    //   try {
    //     const response = await apiService.getRequest(
    //       `/transaction/getLockedRate?username=${authStore.username}&payCurrency=${payCurrency}&getCurrency=${getCurrency}`
    //     );
    //     if (response.status === 1) {
    //       if (response.token) {
    //         authStore.refreshSession(response.token, authStore.username);
    //       }
    //       this.memoId = response.memoId;
    //       this.rate = response.rates?.[0]?.rate || null;
    //       this.fee = response.rates?.[0]?.fee || null;
    //       this.sendingCurrency = payCurrency;
    //       this.receivingCurrency = getCurrency;
    //     } else {
    //       alertStore.alert("error", response.message);
    //     }
    //     return response;
    //   } catch (error) {
    //     alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
    //     throw error;
    //   } finally {
    //     store.isMoneyLoading = false;
    //   }
    // },

    async getLockedAmount(amount, getOrPay) {
      const store = useStore();
      const authStore = useAuthStore();
      const alertStore = useAlertStore();
      store.isMoneyLoading = true;

      try {
        const response = await apiService.getRequest(
          `/transaction/lockedAmount?username=${authStore.username}&memoId=${this.memoId}&amount=${amount}&getOrPay=${getOrPay}`
        );

        if (response.status === 1) {
          if (response.token) {
            authStore.refreshSession(response.token, authStore.username);
          }
        } else {
          alertStore.alert("error", response.message);
        }
        return response;
      } catch (error) {
        alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
        throw error;
      } finally {
        store.isMoneyLoading = false;
      }
    },
    async sendReminder(payload) {
      const store = useStore();
      const authStore = useAuthStore();
      const alertStore = useAlertStore();
      store.isLoading = true;

      try {
        // Construct the query string
        const queryParams = new URLSearchParams({
          username: payload.username || authStore.username,
          memoId: payload.memoId,
        }).toString();

        // Full URL with query parameters
        const url = `/transaction/urgent?${queryParams}`;

        // Send the POST request with any additional data in the body
        const response = await apiService.postRequest(url, payload.data || {}, {
          format: "json", // Adjust format if needed
        });

        if (response.status === 1) {
          if (response.token) {
            authStore.refreshSession(response.token, authStore.username);
          }
        } else {
          alertStore.alert("error", response.message);
        }
        return response;
      } catch (error) {
        alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
        throw error;
      } finally {
        store.isLoading = false;
      }
    },

    async sendAcknowledgement(payload) {
      const store = useStore();
      const authStore = useAuthStore();
      const alertStore = useAlertStore();
      store.isLoading = true;
      try {
        // Construct the query string
        const queryParams = new URLSearchParams({
          username: payload.username || authStore.username,
          memoId: payload.memoId,
        }).toString();

        // Full URL with query parameters
        const url = `/transaction/acknowledge?${queryParams}`;
        // Send the POST request with any additional data in the body
        const response = await apiService.postRequest(url, payload.data || {}, {
          format: "json", // Adjust format if needed
        });

        if (response.status === 1) {
          if (response.token) {
            authStore.refreshSession(response.token, authStore.username);
          }
        } else {
          alertStore.alert("error", response.message);
        }
        return response;
      } catch (error) {
        alertStore.alert("error", DEFAULT_ERROR_MESSAGE);

        throw error;
      } finally {
        store.isLoading = false;
      }
    },
    getAllowedCurrencies(base) {
      return CURRENCY_LIST.filter((currency) => currency !== base);
    },
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

    async getParticularRate(base, targetCurrency) {
      const alertStore = useAlertStore();

      try {
        const baseUrl = import.meta.env.VITE_RATE_API_URL;
        const url = `${baseUrl}/rate.html?base=${base}&to=${targetCurrency}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data?.rate) {
          console.warn(`Missing rate for ${base} ➝ ${targetCurrency}`);
          return {
            status: 0,
            error: `Missing rate for ${base} ➝ ${targetCurrency}`,
          };
        }

        const parsedRate = parseFloat(data.rate);

        // Update or insert rate
        const idx = this.rates.findIndex((r) => r.currency === targetCurrency);

        if (idx !== -1) {
          this.rates[idx].rate = parsedRate;
        } else {
          this.rates.push({ currency: targetCurrency, rate: parsedRate });
        }

        // Set base
        this.baseCurrency = base;

        // 🔔 Subscribe to single pair
        socket.emit("changeBase", {
          base,
          to: targetCurrency,
          source: "transactionStore",
        });

        return {
          status: 1,
          rate: parsedRate,
        };
      } catch (error) {
        alertStore.alert(
          "error",
          `Failed to fetch ${base} ➝ ${targetCurrency} rate`
        );

        return {
          status: 0,
          error: error.message,
        };
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
      // Clear the current rate class immediately
      this.rateClasses[currency] = "";
    },

    subscribeToMultiRateUpdates() {
      socket.on("rateUpdate", ({ base, rates, source }) => {
        if (source !== "transactionStore") return;
        if (this.baseCurrency !== base) return;

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
        if (changes.length) {
          console.log(`[TransactionStore] Changes: ${changes.join(", ")}`);
        }

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

    subscribeToSingleRateUpdates() {
      // 🔔 One-to-one socket listener (e.g. USD ➝ MYR)
      socket.on("rateUpdateOne", ({ base, to, rate, source }) => {
        if (source !== "transactionStore") return; // ✅ Add this check

        if (this.baseCurrency !== base) return;

        const prevRate = this.rates.find((r) => r.currency === to)?.rate;
        const prevDecimal = prevRate ? Math.round(prevRate * 10000) : null;
        const newDecimal = Math.round(parseFloat(rate) * 10000);

        if (prevDecimal !== null && prevDecimal !== newDecimal) {
          this.updateRateClass(to, parseFloat(rate));
          console.log(
            `[TransactionStore] One-to-one update: ${to}: ${prevRate} ➡️ ${parseFloat(
              rate
            )}`
          );
        }

        const idx = this.rates.findIndex((r) => r.currency === to);

        if (idx !== -1) {
          this.rates[idx].rate = parseFloat(rate);
        } else {
          this.rates.push({ currency: to, rate: parseFloat(rate) });
        }
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
        key: "transactionStore", // The key to use in localStorage
        storage: localStorage, // Use localStorage
        paths: [
          "memoId",
          "rate",
          "fee",
          "sendingAmount",
          "sendingCurrency",
          "receivingAmount",
          "receivingCurrency",
        ],
      },
    ],
  },
});
