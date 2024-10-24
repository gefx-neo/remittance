import { defineStore } from "pinia";
import apiService from "@/services/apiService";
import { useStore } from "@/stores/useStore";
import {
  setLocalStorageWithExpiry,
  getLocalStorageWithExpiry,
} from "@/services/localStorageService.js";

export const useProfileStore = defineStore("profile", {
  state: () => ({
    profileDetails: null,
    error: null,
  }),
  actions: {
    async getProfileDetail() {
      const store = useStore();
      store.isLoading = true;
      try {
        // Retrieve the username from localStorage
        const username = getLocalStorageWithExpiry("username");
        if (!username) {
          throw new Error("No username found in localStorage");
        }

        // Call the API with username as a query parameter
        const response = await apiService.getRequest(
          `/Profile/user?username=${username}`
        );
        if (response.status !== 1) {
          // If response status is not 1, log out the user and redirect to login
          this.clearProfileDetails();
          localStorage.removeItem("token"); // Clear any sensitive data
          localStorage.removeItem("username");
          router.push("/login"); // Redirect user to login page
          throw new Error("Invalid profile details. You have been logged out.");
        }
        this.profileDetails = response;
        setLocalStorageWithExpiry("token", response.token, 4);
        setLocalStorageWithExpiry("username", username, 4);

        console.log("profile response token", response.token);
        return response;
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to fetch profile details";
        console.error("Error while fetching profile details:", error);
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
      store.isLoading = true;
      this.error = null;

      try {
        console.log(form);
        const response = await apiService.postRequest(
          "/profile/verifyAccount",
          form,
          { format: "raw" }
        );

        if (response.status === 1) {
          this.successMessage = "Account verification successful!";
          this.error = null;
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
