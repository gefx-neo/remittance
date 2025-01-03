import { defineStore } from "pinia";
import apiService from "@/services/apiService";
import { DEFAULT_ERROR_MESSAGE } from "@/services/apiService";
import { useStore } from "@/stores/useStore";
import { useAuthStore } from "@/stores/authStore";

export const useTransactionStore = defineStore("transaction", {
  state: () => ({
    // lockedRate: null,
    // sendingAmount: 0,
    // sendingCurrency: "SGD",
    // receivingAmount: 0,
    // receivingCurrency: "MYR",
    memoId: null,
    rate: null,
    fee: null,
    error: null,
  }),
  actions: {
    async getTransactionList() {
      const store = useStore();
      const authStore = useAuthStore();
      store.isLoading = true;
      try {
        const response = await apiService.getRequest(
          `/transaction/list?username=${authStore.username}`
        );
        if (response.status === 1) {
          if (response.token) {
            authStore.refreshSession(response.token, authStore.username);
          }

          console.log("transaction response token", response.token);
        } else {
          this.error = response.message;
        }

        return response;
      } catch (error) {
        this.error = DEFAULT_ERROR_MESSAGE;
        throw error;
      } finally {
        store.isLoading = false;
      }
    },
    async getTransactionDetail(memoId) {
      const store = useStore();
      const authStore = useAuthStore();
      store.isLoading = true;
      try {
        const response = await apiService.getRequest(
          `/transaction/transactionDetails?username=${authStore.username}&memoId=${memoId}`
        );

        if (response.status === 1) {
          if (response.token) {
            authStore.refreshSession(response.token, authStore.username);
          }

          console.log("transaction response token", response.token);
        } else {
          this.error = response.message;
        }

        return response;
      } catch (error) {
        this.error = DEFAULT_ERROR_MESSAGE;
        throw error;
      } finally {
        store.isLoading = false;
      }
    },
    async uploadFiles(formData) {
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
        this.error = DEFAULT_ERROR_MESSAGE;
        throw error;
      }
    },
    async addTransaction(payload) {
      const store = useStore();
      const authStore = useAuthStore();
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
          this.resetStore();

          console.log("transation response token", response.token);
        } else {
          this.error = response.message;
        }

        return response;
      } catch (error) {
        this.error = DEFAULT_ERROR_MESSAGE;
        throw error;
      } finally {
        store.isLoading = false;
      }
    },
    async getLockedRate(payCurrency, getCurrency) {
      const store = useStore();
      const authStore = useAuthStore();
      store.isLoading = true;
      try {
        const response = await apiService.getRequest(
          `/transaction/getLockedRate?username=${authStore.username}&payCurrency=${payCurrency}&getCurrency=${getCurrency}`
        );
        if (response.status === 1) {
          if (response.token) {
            authStore.refreshSession(response.token, authStore.username);
          }
          this.memoId = response.memoId;
          this.rate = response.rates?.[0]?.rate || null;
          this.fee = response.rates?.[0]?.fee || null;

          console.log("transaction response token", response.token);
        } else {
          this.error = response.message;
        }

        return response;
      } catch (error) {
        this.error = DEFAULT_ERROR_MESSAGE;
        throw error;
      } finally {
        store.isLoading = false;
      }
    },
    // setLockedRate(rate) {
    //   this.lockedRate = rate;
    // },
    async getLockedAmount(amount, getOrPay) {
      const store = useStore();
      const authStore = useAuthStore();
      store.isLoading = true;

      try {
        const response = await apiService.getRequest(
          `/transaction/lockedAmount?username=${authStore.username}&memoId=${this.memoId}&amount=${amount}&getOrPay=${getOrPay}`
        );

        if (response.status === 1) {
          if (response.token) {
            authStore.refreshSession(response.token, authStore.username);
          }
          console.log("Locked Amount Response:", response);
        } else {
          this.error = response.message;
        }

        return response;
      } catch (error) {
        this.error = DEFAULT_ERROR_MESSAGE;
        throw error;
      } finally {
        store.isLoading = false;
      }
    },
    async sendReminder(payload) {
      const store = useStore();
      const authStore = useAuthStore();
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
          console.log("Reminder sent successfully:", response);
        } else {
          this.error = response.message;
        }

        return response;
      } catch (error) {
        this.error = DEFAULT_ERROR_MESSAGE;
        throw error;
      } finally {
        store.isLoading = false;
      }
    },
    async getRate() {
      const store = useStore();
      const authStore = useAuthStore();
      // store.isLoading = true;
      try {
        const response = await apiService.getRequest(
          `/transaction/getRate?username=${authStore.username}`
        );
        if (response.status === 1) {
          if (response.token) {
            authStore.refreshSession(response.token, authStore.username);
          }

          console.log("dashboard response token", response.token);
        } else {
          this.error = response.message;
        }

        return response;
      } catch (error) {
        this.error = DEFAULT_ERROR_MESSAGE;
        throw error;
      } finally {
        // store.isLoading = false;
      }
    },
    resetStore() {
      this.$reset();
    },
    setTransactionData(data) {
      this.sendingAmount = data.sendingAmount || this.sendingAmount;
      this.sendingCurrency = data.sendingCurrency || this.sendingCurrency;
      this.receivingAmount = data.receivingAmount || this.receivingAmount;
      this.receivingCurrency = data.receivingCurrency || this.receivingCurrency;
    },
    clearTransactionData() {
      localStorage.removeItem("transaction");
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
