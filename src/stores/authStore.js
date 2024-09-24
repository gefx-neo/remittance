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

export const useAuthStore = defineStore("auth", {
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
      const store = useStore();
      store.setLoading(true);
      try {
        const response = await apiService.postRequest("/User/reqkey", username);

        if (response.status === 1) {
          this.hex = response.key;
          this.iv = response.iv;

          return { hex: this.hex, iv: this.iv };
        } else {
          this.error = response.message || "Failed to fetch encryption keys";
          console.error("Failed to fetch hex and iv:", response.message);
          return null;
        }
      } catch (error) {
        this.error =
          error.response?.message || "Failed to fetch encryption keys";
        console.error("Error while fetching hex and iv:", error);
        return null;
      } finally {
        store.setLoading(false);
      }
    },

    // Step 2: Handle login with encrypted password
    async login(username, password) {
      if (!this.hex || !this.iv) {
        this.error =
          "Encryption keys are missing, please restart the login process.";
        return;
      }

      const store = useStore();
      store.setLoading(true);
      try {
        // Encrypt the password using the global encryptData function
        const encryptedPassword = encryptData(password, this.hex, this.iv);

        // Log the hex and iv used to encrypt the password
        console.log("Hex used for encryption:", this.hex);
        console.log("IV used for encryption:", this.iv);
        console.log("Encrypted password:", encryptedPassword);

        // Get device ID from the device store
        const deviceStore = useDeviceStore();
        await deviceStore.generateDeviceId();
        const deviceId = deviceStore.deviceId;

        console.log("Original password:", password);

        const payload = {
          username,
          pwd: encryptedPassword, // Encrypted password
          deviceid: deviceId,
        };

        console.log("Payload:", payload);

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
          setLocalStorageWithExpiry("username", username, 4);

          router.push({ name: "dashboard" });
        } else {
          this.user = false;
          this.error = response.message || "Login failed";
          console.error("Login failed:", this.error);
        }
      } catch (error) {
        this.user = false;
        this.error = error.response?.message;
        console.error("Error during login:", error);
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
          console.error("Logout failed:", response.message);
          this.error = response.message || "Logout failed";
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
