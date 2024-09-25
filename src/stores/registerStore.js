import { defineStore } from "pinia";
import apiService from "@/services/apiService";
import { useStore } from "@/stores/useStore";

export const useRegisterStore = defineStore("registerStore", {
  state: () => ({
    error: null,
  }),
  actions: {
    async register(form) {
      const store = useStore();
      this.error = null;
      store.setLoading(true);

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
          true
        );

        if (response.status === 1) {
          console.log("Registration response successful:", response);
          return response;
        } else {
          console.error("Registration failed with message:", response);
          this.error =
            response.message || "Registration failed due to an unknown error.";
          throw new Error(this.error);
        }
      } catch (error) {
        console.error("Registration request failed:", error);
        this.error =
          error.message ||
          "Request failed due to network issues or server error.";
        throw error;
      } finally {
        store.setLoading(false);
      }
    },
  },
});
