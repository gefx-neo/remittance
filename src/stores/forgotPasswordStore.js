import { defineStore } from "pinia";
import apiService from "@/services/apiService";
import { DEFAULT_ERROR_MESSAGE } from "@/services/apiService";
import { useStore, useAlertStore } from "@/stores/index";
import { encryptData } from "../services/encryptionService.js";

export const useForgotPasswordStore = defineStore("forgotPasswordstore", {
  state: () => ({
    error: null,
    hex: null,
    iv: null,
  }),
  actions: {
    async getReqKey(username) {
      const store = useStore();
      const alertStore = useAlertStore();
      store.isLoading = true;
      try {
        const response = await apiService.postRequest("/User/reqkey", username);

        if (response.status === 1) {
          this.hex = response.key;
          this.iv = response.iv;
        } else {
          alertStore.alert("error", response.message);
        }
        return response;
      } catch (error) {
        alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
        return null;
      } finally {
        store.isLoading = false;
      }
    },
    async changePassword(username) {
      const store = useStore();
      const alertStore = useAlertStore();
      store.isLoading = true;

      try {
        const response = await apiService.postRequest(
          "/User/changePassword",
          username
        );

        if (response.status === 1) {
          this.error = null;
        } else {
          alertStore.alert("error", response.message);
        }
        return response;
      } catch (error) {
        alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
        return null;
      } finally {
        store.isLoading = false;
      }
    },
    async setNewPassword(form) {
      const store = useStore();
      const alertStore = useAlertStore();
      store.isLoading = true;

      try {
        // Encrypt the new password using the fetched hex and iv
        const encryptedCode = encryptData(form.code, this.hex, this.iv);
        const encryptedPassword = encryptData(
          form.newPassword,
          this.hex,
          this.iv
        );

        const payload = {
          code: encryptedCode,
          username: form.username,
          pwd: encryptedPassword,
        };

        // Send the set new password request
        const response = await apiService.postRequest(
          "/User/setNewPassword",
          payload,
          { format: "raw" }
        );

        if (response.status === 1) {
          this.error = null;
        } else {
          alertStore.alert("error", response.message);
        }
        return response;
      } catch (error) {
        alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
        return null;
      } finally {
        store.isLoading = false;
      }
    },
    async changePasswordTimer(username) {
      const store = useStore();
      const alertStore = useAlertStore();
      store.isResendLoading = true;

      try {
        const response = await apiService.postRequest(
          "/User/changePassword",
          username
        );

        if (response.status === 1) {
          this.error = null;
        } else {
          alertStore.alert("error", response.message);
        }

        return response;
      } catch (error) {
        alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
        return null;
      } finally {
        store.isResendLoading = false;
      }
    },
  },
});
