import { defineStore } from "pinia";
import apiService from "@/services/apiService";
import { useStore } from "@/stores/useStore";
import { useAuthStore } from "@/stores/authStore";

export const useTransactionStore = defineStore("transaction", {
  state: () => ({
    transactionList: null,
    error: null,
    transactions: [
      {
        id: 1,
        number: "#60011234",
        date: "28 July 2024",
        status: "Unpaid",
        beneficiaryName: "John Doe",
        beneficiaryBankName: "Bank of America",
        beneficiaryBankAccountNumber: "987541012",
        sendingAmount: "1,463.82 USD",
        receivingAmount: "2,000 SGD",
      },
      {
        id: 2,
        number: "#60011233",
        date: "27 July 2024",
        status: "Pending",
        beneficiaryName: "John Doe",
        beneficiaryBankName: "Bank of America",
        beneficiaryBankAccountNumber: "987541012",
        sendingAmount: "1,463.82 USD",
        receivingAmount: "2,000 SGD",
      },
      {
        id: 3,
        number: "#60011232",
        date: "26 July 2024",
        status: "Pending",
        beneficiaryName: "John Doe",
        beneficiaryBankName: "Bank of America",
        beneficiaryBankAccountNumber: "987541012",
        sendingAmount: "1,463.82 USD",
        receivingAmount: "2,000 SGD",
      },
      {
        id: 4,
        number: "#60011231",
        date: "16 June 2024",
        status: "Completed",
        beneficiaryName: "John Doe",
        beneficiaryBankName: "Bank of America",
        beneficiaryBankAccountNumber: "987541012",
        sendingAmount: "1,463.82 USD",
        receivingAmount: "2,000 SGD",
      },
      {
        id: 5,
        number: "#60011230",
        date: "28 July 2024",
        status: "Failed",
        beneficiaryName: "Caleb Takamura",
        beneficiaryBankName: "Bank of Japan",
        beneficiaryBankAccountNumber: "66335012",
        sendingAmount: "100,000 YEN",
        receivingAmount: "842 SGD",
      },
    ],
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
        this.error =
          error.message ||
          "Delete beneficiary failed due to network issues or server error.";
        throw error;
      } finally {
        store.isLoading = false;
      }
    },
    async getTransactionDetail(trxnNum) {
      const store = useStore();
      const authStore = useAuthStore();
      store.isLoading = true;
      try {
        const response = await apiService.getRequest(
          `/transaction/details?username=${authStore.username}&trxnNum=${trxnNum}`
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
        this.error =
          error.message ||
          "Get transaction detail failed due to network issues or server error.";
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
        console.error("File upload failed:", error);
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

          console.log("beneficiary response token", response.token);
        } else {
          this.error = response.message;
        }

        return response;
      } catch (error) {
        this.error =
          error.message ||
          "Process failed due to network issues or server error.";
        throw error;
      } finally {
        store.isLoading = false;
      }
    },
  },
});
