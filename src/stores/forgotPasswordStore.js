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
    // Step 1: Fetch encryption keys
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

    // Step 2: Change password
    async changePassword(username) {
      const store = useStore();
      store.setLoading(true);

      try {
        // // Fetch encryption keys (hex and iv) using the new getReqKey function
        // const { hex, iv } = await this.getReqKey(username);

        // if (!hex || !iv) {
        //   this.error = "Failed to fetch encryption keys";
        //   return;
        // }

        // // Store hex and iv in the state
        // this.hex = hex;
        // this.iv = iv;

        // Call changePassword API
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
    async logout() {
      const store = useStore();
      store.setLoading(true);
      try {
        // Retrieve the username from localStorage
        const username = localStorage.getItem("username");
        if (!username) {
          throw new Error("No username found in localStorage");
        }

        // Call the logout API
        const logoutResponse = await apiService.postRequest(
          "/User/logout",
          username
        );

        if (logoutResponse.status === 1) {
          this.user = false;
          this.error = null;

          // Erase session data
          localStorage.removeItem("token");
          localStorage.removeItem("username");

          console.log("Logged out successfully and session cleared.");
        } else {
          console.error("Logout failed:", logoutResponse.message);
          this.error = logoutResponse.message || "Logout failed";
        }
      } catch (error) {
        console.error("Error during logout:", error);
        this.error = error.response?.message || "Error during logout";
      } finally {
        store.setLoading(false);
      }
    },
  },
});
