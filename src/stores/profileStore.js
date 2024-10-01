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

    clearProfileDetails() {
      this.profileDetails = null;
      this.error = null;
    },
  },
});
