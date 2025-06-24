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
import { useEnvironment } from "@/composables/useEnvironment";
let rateUpdateOneHandler = null;

export const useTransactionStore = defineStore("transaction", {
  state: () => ({
    sendingAmount: 0,
    sendingCurrency: "SGD",
    receivingAmount: 0,
    receivingCurrency: "MYR",
    memoId: null,
    rate: null,
    fee: null,
    paymentType: "localpayment",
    error: null,
    rateClasses: {}, // Track increase or decrease classes for each currency
  }),
  actions: {
    setTransactionData(data) {
      this.sendingAmount = data.sendingAmount;
      this.receivingAmount = data.receivingAmount;
      this.sendingCurrency = data.sendingCurrency;
      this.receivingCurrency = data.receivingCurrency;
      this.memoId = data.memoId;
      this.rate = data.rate;
      this.fee = data.fee;
      this.paymentType = data.paymentType;
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
    async getParticularRate(base, targetCurrency) {
      const authStore = useAuthStore();
      const alertStore = useAlertStore();

      try {
        const { apiRateBaseUrl } = useEnvironment();
        const url = `${apiRateBaseUrl}/rate.html?base=${base}&to=${targetCurrency}&username=${encodeURIComponent(
          authStore.username
        )}&token=${encodeURIComponent(authStore.token)}`;

        const response = await fetch(url);
        const data = await response.json();

        const parsedRate = parseFloat(data.rate);

        // ✅ Only assign to this.rate
        this.rate = parsedRate;

        // 🔔 Still emit socket if needed (optional)
        socket.emit("changeBase", {
          base,
          to: targetCurrency,
          source: "transactionStore",
          username: authStore.username,
          token: authStore.token,
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
    async getLockedTransaction(
      amountInput,
      base,
      to,
      paymentType,
      direction = " sending"
    ) {
      const authStore = useAuthStore();
      const alertStore = useAlertStore();
      const { apiRateBaseUrl } = useEnvironment();

      const rate = this.rate;
      if (!rate || isNaN(rate)) {
        alertStore.alert("error", "Missing or invalid rate. Please refresh.");
        return null;
      }

      // 🔁 Local calculation
      let payAmount, getAmount;

      if (direction === "receiving") {
        getAmount = parseFloat(amountInput);
        payAmount = parseFloat((getAmount / rate).toFixed(2));
      } else {
        payAmount = parseFloat(amountInput);
        getAmount = parseFloat((payAmount * rate).toFixed(2));
      }

      const url = `${apiRateBaseUrl}/lock-transaction.html?username=${encodeURIComponent(
        authStore.username
      )}&token=${encodeURIComponent(
        authStore.token
      )}&payCurrency=${base}&getCurrency=${to}&paymentType=${paymentType}&payAmount=${payAmount}&amount=${getAmount}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data?.memoId || typeof data?.status !== "number") {
          alertStore.alert("error", "Failed to lock transaction.");
          return null;
        }

        this.memoId = data.memoId;

        return {
          ...data,
          rate,
          payAmount, //  computed locally
          getAmount, //  computed locally
        };
      } catch (error) {
        alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
        return null;
      }
    },
    updateRateClass(currency, newRate) {
      const prevRate = this.rate;

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
    subscribeToSingleRateUpdates() {
      if (rateUpdateOneHandler) return;

      rateUpdateOneHandler = ({ base, to, rate, source }) => {
        if (source !== "transactionStore") return;
        if (this.sendingCurrency !== base) return;
        if (this.receivingCurrency !== to) return;

        const newRate = parseFloat(rate);
        const prevRate = this.rate;

        const prevDecimal = prevRate ? Math.round(prevRate * 10000) : null;
        const newDecimal = Math.round(newRate * 10000);

        if (prevDecimal !== null && prevDecimal !== newDecimal) {
          this.updateRateClass(to, newRate);
          // console.log(
          //   `[TransactionStore] One-to-one update: ${to}: ${prevRate} ➡️ ${newRate}`
          // );
        }

        // ✅ Only update single rate — do NOT touch this.rates
        this.rate = newRate;
      };
      socket.on("rateUpdateOne", rateUpdateOneHandler);
    },
    cleanupSocketListeners() {
      if (rateUpdateOneHandler) {
        socket.off("rateUpdateOne", rateUpdateOneHandler);
        rateUpdateOneHandler = null;
      }
    },
    resetStore() {
      this.$reset();
    },
    resetStoreForDashboard() {
      const preserved = {
        sendingAmount: this.sendingAmount,
        sendingCurrency: this.sendingCurrency,
        receivingCurrency: this.receivingCurrency,
      };

      this.$reset();

      // Restore preserved values
      this.sendingAmount = preserved.sendingAmount;
      this.sendingCurrency = preserved.sendingCurrency;
      this.receivingCurrency = preserved.receivingCurrency;
    },
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: "transactionStore", // The key to use in localStorage
        storage: localStorage, // Use localStorage
        paths: [
          "sendingAmount",
          "sendingCurrency",
          "receivingAmount",
          "receivingCurrency",
          "memoId",
          "rate",
          "fee",
          "paymentType",
        ],
      },
    ],
  },
});
