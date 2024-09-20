import { defineStore } from "pinia";
import apiService from "@/services/apiService";
import { useStore } from "@/stores/useStore";
import { encryptData } from "../services/encryptionService.js";
import router from "@/router";

export const useForgotPasswordStore = defineStore("forgotPasswordstore", {
  state: () => ({
    error: null,
    hex: null,
    iv: null,
  }),
  actions: {
    // Step 2: Change password
    async changePassword(username) {
      const store = useStore();
      store.setLoading(true);

      try {
        const response = await apiService.postRequest(
          "/User/changePassword",
          username
        );

        if (response.status === 1) {
          this.error = null;
        } else {
          this.error = response.message || "Failed to change password";
        }
      } catch (error) {
        this.error = error.response?.message || "Failed to change password";
        console.error("Error in changePassword:", error);
      } finally {
        store.setLoading(false);
      }
    },

    // Step 3: Set new password
    async setNewPassword(code, username, password) {
      const store = useStore();
      store.setLoading(true);

      try {
        console.log("Original code:", code);
        console.log("Original password:", password);

        // Encrypt the new password using the fetched hex and iv
        const encryptedCode = encryptData(code, this.hex, this.iv);
        const encryptedPassword = encryptData(password, this.hex, this.iv);

        console.log("Encrypted code:", encryptedCode);
        console.log("Encrypted password:", encryptedPassword);

        const requestBody = {
          code: encryptedCode,
          username,
          pwd: encryptedPassword, // Encrypted password
        };

        // Send the set new password request
        const setPasswordResponse = await apiService.postRequest(
          "/User/setNewPassword",
          requestBody,
          true
        );

        if (setPasswordResponse.status === 1) {
          this.error = null;
        } else {
          this.error = setPasswordResponse.message || "Password reset failed";
          console.error("Password reset failed:", this.error);
        }
      } catch (error) {
        this.error = error.response?.message || "Failed to set new password";
        console.error("Error during password reset:", error);
      } finally {
        store.setLoading(false);
      }
    },
  },
});
