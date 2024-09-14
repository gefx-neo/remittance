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

      // Only include companyName if accountType is Corporate & Trading Company
      if (registrationData.accountType === "Corporate & Trading Company") {
        registrationData.companyName = form.companyName;
      }

      // Manually convert the object into a string with escaped quotes
      const payload = JSON.stringify(registrationData);
      const stringifiedPayload = `"${JSON.stringify(registrationData).replace(
        /"/g,
        '\\"'
      )}"`;

      console.log("Submitting form data:", stringifiedPayload);

      try {
        const response = await axios({
          method: "post",
          url: "http://10.100.2.6:802/User/register",
          data: stringifiedPayload, // Sending the payload as a string
          headers: {
            "Content-Type": "application/json",
          },
        });

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
