import { defineStore } from "pinia";
import { useDeviceStore } from "./deviceStore.js";
import router from "../router/index.js";
import apiService from "@/services/apiService";
import { useStore } from "@/stores/useStore";
import { encryptData } from "../services/encryptionService.js";
import {
  setLocalStorageWithExpiry,
  getLocalStorageWithExpiry,
  removeLocalStorageWithExpiry,
} from "@/services/localStorageService.js";

export const useAdminAuthStore = defineStore("adminauth", {
  state: () => ({
    user: getLocalStorageWithExpiry("username") || null,
    error: null,
    cookieRefreshed: false,
    hex: null,
    iv: null,
  }),
  actions: {
    checkSession() {
      const token = getLocalStorageWithExpiry("token");
      const username = getLocalStorageWithExpiry("username");

      if (token && username) {
        // If both token and username are found, assume the user is logged in
        this.user = true;
        console.log("User session found with token:", token);
      } else if (!token || !username) {
        // If token or username are missing or expired, clear them and log out the user
        removeLocalStorageWithExpiry("token");
        removeLocalStorageWithExpiry("username");
        this.user = null;
      } else if (token === null) {
        this.logout;
      } else {
        this.user = false;
      }
    },

    // Step 1: Fetch reqKey (hex and iv) for the username
    async getReqKey(username) {
      try {
        const response = await apiService.postRequest(
          "/gefx/ad-min/reqKey",
          username
        );

        if (response.status === 1) {
          this.hex = response.key;
          this.iv = response.iv;
        } else {
          this.error = response.message;
        }
        return response;
      } catch (error) {
        this.error = error.response?.message;
        return null;
      }
    },

    // Step 2: Handle login with encrypted password
    async login(form) {
      if (!this.hex || !this.iv) {
        this.error =
          "Encryption keys are missing, please restart the login process.";
        return;
      }

      const store = useStore();
      store.setLoading(true);
      try {
        // Encrypt the password using the global encryptData function
        const encryptedPassword = encryptData(form.password, this.hex, this.iv);

        // Get device ID from the device store
        const deviceStore = useDeviceStore();
        await deviceStore.generateDeviceId();
        const deviceId = deviceStore.deviceId;

        const payload = {
          username: form.username,
          pwd: encryptedPassword, // Encrypted password
          deviceid: deviceId,
        };

        // Send the login request
        const response = await apiService.postRequest(
          "/User/login",
          payload,
          true
        );

        if (response.status === 1) {
          this.user = true;
          this.error = null;

          // Set token and username in localStorage with a 4-hour expiration
          setLocalStorageWithExpiry("token", response.token, 4);
          setLocalStorageWithExpiry("username", form.username, 4);

          router.push({ name: "dashboard" });
        } else {
          this.user = false;
          this.error = response.message;
        }
      } catch (error) {
        this.user = false;
        this.error = error.response?.message;
      } finally {
        store.setLoading(false);
      }
    },

    async logout() {
      const store = useStore();
      store.setLoading(true);
      try {
        const username = getLocalStorageWithExpiry("username");

        const response = await apiService.postRequest("/User/logout", username);

        if (response.status === 1) {
          this.user = false;
          this.error = null;

          removeLocalStorageWithExpiry("token");
          removeLocalStorageWithExpiry("username");
          router.push("/");

          console.log("Logged out successfully and session cleared.");
        } else {
          this.error = response.message || "Logout failed";
        }
      } catch (error) {
        this.error = error.response?.message || "Error during logout";
      } finally {
        store.setLoading(false);
      }
    },
  },
});
