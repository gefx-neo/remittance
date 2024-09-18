import { defineStore } from "pinia";
import apiService from "@/services/apiService"; // Adjust the path according to your project structure

export const useRegisterStore = defineStore("registerStore", {
  state: () => ({
    error: null,
  }),
  actions: {
    async register(form, sendAsPlainString = false) {
      this.error = null;

      const registrationData = {
        surname: form.surname,
        givenName: form.givenName,
        emailAddress: form.emailAddress,
        accountType: form.accountType,
      };

      // Only include companyName if accountType is Corporate & Trading Company
      if (registrationData.accountType === "Corporate & Trading Company") {
        registrationData.companyName = form.companyName;
      }

      const url = "http://172.188.98.99:802/User/register";

      try {
        const response = await apiService.postRequest(
          url,
          registrationData,
          sendAsPlainString
        );

        console.log("Registration response successful:", response);
        return response;
      } catch (error) {
        console.error("Registration requestt failed:", error);
        this.error = error;
        throw error;
      }
    },
  },
});
