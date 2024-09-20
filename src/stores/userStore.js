import { defineStore } from "pinia";
import apiService from "@/services/apiService";
import cookieService from "../services/cookieService";
import { useStore } from "@/stores/useStore";

export const useUserStore = defineStore("user", {
  state: () => ({
    profileDetails: null,
    error: null,
  }),
  actions: {
    async getProfileDetail() {
      const store = useStore();
      store.setLoading(true);
      try {
        // Retrieve the username from the cookie
        const username = cookieService.getCookie("username");
        if (!username) {
          throw new Error("No username cookie found");
        }

        // Call the API with username as a query parameter
        const response = await apiService.getRequest(
          `/Profile/user?username=${username}`
        );

        this.profileDetails = response;
        localStorage.setItem("token", response.token);
        console.log("profile response token", response.token);
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to fetch profile details";
        console.error("Error while fetching profile details:", error);
      } finally {
        store.setLoading(false);
      }
    },

    // Clear profile details
    clearProfileDetails() {
      this.profileDetails = null;
      this.error = null;
    },
  },
});
