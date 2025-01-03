import { defineStore } from "pinia";
import apiService from "@/services/apiService";
import { DEFAULT_ERROR_MESSAGE } from "@/services/apiService";
import { useStore } from "@/stores/useStore";
import { useAuthStore, useAlertStore } from "@/stores/index";

export const useBeneficiaryStore = defineStore("beneficiary", {
  state: () => ({
    beneficiaryList: null,
    error: null,
    selectedBeneficiary: null,
  }),
  actions: {
    async getBeneficiaryList() {
      const store = useStore();
      const authStore = useAuthStore();
      const alertStore = useAlertStore();

      store.isLoading = true;
      try {
        const response = await apiService.getRequest(
          `/bene/list?username=${authStore.username}`
        );
        if (response.status === 1) {
          if (response.token) {
            authStore.refreshSession(response.token, authStore.username);
          }

          console.log("beneficiary response token", response.token);
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
    async getBeneficiaryDetail(id) {
      const store = useStore();
      const authStore = useAuthStore();
      const alertStore = useAlertStore();
      store.isLoading = true;
      try {
        const response = await apiService.getRequest(
          `/bene/details?username=${authStore.username}&beneId=${id}`
        );

        if (response.status === 1) {
          if (response.token) {
            authStore.refreshSession(response.token, authStore.username);
          }

          console.log("beneficiary response token", response.token);
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
      const store = useStore();
      const alertStore = useAlertStore();
      store.isLoading = true;
      try {
        // Use the apiService to send the FormData object
        const response = await apiService.postRequest(
          "/bene/upload",
          formData,
          {
            format: "multipart/form-data",
          }
        );
        return response;
      } catch (error) {
        alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
        throw error;
      } finally {
        store.isLoading = false;
      }
    },
    async addBeneficiary(payload) {
      const store = useStore();
      const authStore = useAuthStore();
      const alertStore = useAlertStore();

      store.isLoading = true;

      try {
        const response = await apiService.postRequest(
          "/bene/addBeneficiary",
          payload,
          { format: "raw" }
        );

        if (response.status === 1) {
          if (response.token) {
            authStore.refreshSession(response.token, payload.username);
          }

          console.log("beneficiary response token", response.token);
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
    async updateFavourite(payload) {
      const authStore = useAuthStore();
      const store = useStore();
      const alertStore = useAlertStore();
      store.isLoading = true;
      try {
        const response = await apiService.putRequest(
          "/bene/updateFavourite",
          payload
        );

        if (response.status === 1) {
          console.log("Beneficiary status updated successfully", response);

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
    async deleteBeneficiary(id) {
      const store = useStore();
      const authStore = useAuthStore();
      const alertStore = useAlertStore();
      store.isLoading = true;
      try {
        const response = await apiService.deleteRequest(
          `/bene/deleteBeneficiary?username=${authStore.username}&beneId=${id}`
        );

        if (response.status === 1) {
          if (response.token) {
            authStore.refreshSession(response.token, authStore.username);
          }

          console.log("beneficiary response token", response.token);
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
    setSelectedBeneficiary(beneficiary) {
      this.selectedBeneficiary = beneficiary;
    },
    clearSelectedBeneficiary() {
      this.selectedBeneficiary = null;
    },

    clearBeneficiaryList() {
      this.beneficiaryList = null;
      this.error = null;
    },
  },
  persist: {
    enabled: true, // Enable persistence
    strategies: [
      {
        key: "beneficiary", // Key in localStorage
        storage: localStorage, // Use localStorage
        paths: ["selectedBeneficiary"], // Only persist the selectedBeneficiary
      },
    ],
  },
});
