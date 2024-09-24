import { defineStore } from "pinia";
import apiService from "@/services/apiService";
import { useStore } from "@/stores/useStore";
import { encryptData } from "../services/encryptionService.js";

export const useForgotPasswordStore = defineStore("forgotPasswordstore", {
  state: () => ({
    error: null,
    hex: null,
    iv: null,
  }),
  actions: {
    async getReqKey(username) {
      try {
        const response = await apiService.postRequest("/User/reqkey", username);

        if (response.status === 1) {
          this.hex = response.key;
          this.iv = response.iv;
          return { hex: this.hex, iv: this.iv };
        } else {
          this.error = response.message || "Failed to fetch encryption keys";
          return null;
        }
      } catch (error) {
        this.error =
          error.response?.message || "Failed to fetch encryption keys";
        return null;
      }
    },
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

        const payload = {
          code: encryptedCode,
          username,
          pwd: encryptedPassword, // Encrypted password
        };

        // Send the set new password request
        const response = await apiService.postRequest(
          "/User/setNewPassword",
          payload,
          true
        );

        if (response.status === 1) {
          this.error = null;
        } else {
          this.error = response.message || "Password reset failed";
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
