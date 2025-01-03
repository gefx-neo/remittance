import { defineStore } from "pinia";
import apiService from "@/services/apiService";
import { DEFAULT_ERROR_MESSAGE } from "@/services/apiService";
import { useStore } from "@/stores/useStore";

export const useRegisterStore = defineStore("registerStore", {
  state: () => ({
    error: null,
  }),
  actions: {
    async register(form) {
      const store = useStore();
      store.isLoading = true;

      const payload = {
        surname: form.surname,
        givenName: form.givenName,
        emailAddress: form.emailAddress,
        accountType: form.accountType,
      };

      // Only include companyName if accountType is Corporate & Trading Company
      if (payload.accountType === "Corporate & Trading Company") {
        payload.companyName = form.companyName;
      }

      try {
        const response = await apiService.postRequest(
          "User/register",
          payload,
          { format: "raw" }
        );

        if (response.status === 1) {
          this.error = null;
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
  },
});
