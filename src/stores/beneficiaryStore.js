import { defineStore } from "pinia";
import apiService from "@/services/apiService";
import { useStore } from "@/stores/useStore";
import { useAuthStore } from "@/stores/authStore";

export const useBeneficiaryStore = defineStore("beneficiaryStore", {
  state: () => ({
    beneficiaryList: null,
    error: null,
    selectedBeneficiary: null,
  }),
  actions: {
    async getBeneficiaryList() {
      const store = useStore();
      const authStore = useAuthStore();
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
    async getBeneficiaryDetail(id) {
      const store = useStore();
      const authStore = useAuthStore();
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

    async uploadFiles(formData) {
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
        console.error("File upload failed:", error);
        throw error;
      }
    },
    async addBeneficiary(payload) {
      const store = useStore();
      const authStore = useAuthStore();
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
    async updateFavourite(payload) {
      const authStore = useAuthStore();

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
          console.warn(
            "Failed to update beneficiary status:",
            response.message
          );
        }

        // Return the response for component handling
        return response;
      } catch (error) {
        console.error("Error in updateFavourite:", error);
        throw error;
      }
    },

    async deleteBeneficiary(id) {
      const store = useStore();
      const authStore = useAuthStore();
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

    setSelectedBeneficiary(beneficiary) {
      this.selectedBeneficiary = beneficiary;
    },
    clearBeneficiaryList() {
      this.beneficiaryList = null;
      this.error = null;
    },
  },
});
