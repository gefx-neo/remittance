// stores/registerStore.js
import { defineStore } from "pinia";
import axios from "axios";

export const useRegisterStore = defineStore("registerStore", {
  state: () => ({
    error: null,
  }),
  actions: {
    async register(form) {
      this.error = null;
      const registrationData = {
        surname: form.surname,
        givenName: form.givenName,
        emailAddress: form.emailAddress,
        accountType: form.accountType,
      };

      if (form.accountType === "Corporate & Trading Company") {
        registrationData.companyName = form.companyName;
      }
      console.log("Submitting form data:", registrationData);

      try {
        const response = await axios.post(
          "http://10.100.2.6:82/User/register",
          registrationData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Registration response successful:", response.data);
        return response.data;
      } catch (error) {
        console.error("Registration request failed with error:", error);
        if (error.response) {
          console.error(
            "Error response data:",
            error.response.data,
            error.response.status
          );
        }
        this.error = error.response?.data?.message || error.message;
        throw error;
      }
    },
  },
});
