import { defineStore } from "pinia";
import apiService from "@/services/apiService";
import { useStore, useAuthStore } from "@/stores/index";

export const useDashboardStore = defineStore("dashboardStore", {
  state: () => ({
    dashboardList: {},
  }),

  actions: {
    async getDashboardList() {
      const store = useStore();
      const authStore = useAuthStore();
      store.isLoading = true;
      try {
        const response = await apiService.getRequest(
          `/dashboard?username=${authStore.username}`
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
        this.error =
          error.message ||
          "Get Dashboard failed due to network issues or server error.";
        throw error;
      } finally {
        store.isLoading = false;
      }
    },
  },
});
