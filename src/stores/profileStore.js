import { defineStore } from "pinia";
import apiService from "@/services/apiService";
import { useStore, useAuthStore } from "@/stores/index.js";

export const useProfileStore = defineStore("profile", {
  state: () => ({
    profileDetails: null,
    error: null,
  }),
  actions: {
    async getProfileDetail() {
      const store = useStore();
      const authStore = useAuthStore();
      store.isLoading = true;
      try {
        const response = await apiService.getRequest(
          `/profile/user?username=${authStore.username}`
        );
        if (response.status === 1) {
          this.profileDetails = response;

          if (response.token) {
            authStore.refreshSession(response.token, authStore.username);
          }

          console.log("profile response token", response.token);
        } else {
          this.error = response.message;
        }

        return response;
      } catch (error) {
        this.error =
          error.message ||
          "Get profile failed due to network issues or server error.";
        throw error;
      } finally {
        store.isLoading = false;
      }
    },
    async uploadFiles(formData) {
      try {
        // Use the apiService to send the FormData object
        const response = await apiService.postRequest(
          "/profile/upload",
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
    async verifyAccount(form) {
      const store = useStore();
      const authStore = useAuthStore();
      store.isLoading = true;

      try {
        console.log(form);
        const response = await apiService.postRequest(
          "/profile/verifyAccount",
          form,
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
          "Verification failed due to network issues or server error.";
        throw error;
      } finally {
        store.isLoading = false;
      }
    },
    async sendReminder(username) {
      try {
        const response = await apiService.postRequest(
          "/profile/urgent",
          username
        );

        if (response.status === 1) {
        } else {
          this.error = response.message;
        }
        return response;
      } catch (error) {
        this.error = error.response?.message;
        return null;
      }
    },
    clearProfileDetails() {
      this.profileDetails = null;
      this.error = null;
    },
  },
});
