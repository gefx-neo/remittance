import { defineStore } from "pinia";
import cookieService from "../services/cookieService.js";
import { useDeviceStore } from "./deviceStore.js";
import router from "../router/index.js";
import apiService from "@/services/apiService";
import { useStore } from "@/stores/useStore";
import { encryptData, decryptData } from "../services/encryptionService.js";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: cookieService.getCookie("sessionData") || null,
    error: null,
    cookieRefreshed: false,
    hex: null,
    iv: null,
  }),
  actions: {
    // Check if the user is already logged in based on session data stored in cookies
    checkSession() {
      const token = localStorage.getItem("token"); // Check for token in localStorage
      const username = cookieService.getCookie("username"); // Check for username in cookies

      if (token && username) {
        this.user = true;
        console.log("User session found with token:", token);
      } else {
        this.user = null;
        console.log("No active session found.");
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

        const requestBody = {
          username,
          pwd: encryptedPassword, // Encrypted password
          deviceid: deviceId,
        };

        console.log("Request body:", requestBody);

        // Send the login request
        const loginResponse = await apiService.postRequest(
          "/User/login",
          requestBody,
          true
        );

        if (loginResponse.status === 1) {
          this.user = true;
          this.error = null;
          localStorage.setItem("token", loginResponse.token);
          cookieService.setCookie("username", username, 7);

          router.push({ name: "dashboard" });
        } else {
          this.user = false;
          this.error = loginResponse.message || "Login failed";
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
        // Retrieve the username from the cookie
        const username = cookieService.getCookie("username");
        if (!username) {
          throw new Error("No username cookie found");
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
          localStorage.removeItem("token"); // Erase token from localStorage
          cookieService.eraseCookie("username"); // Erase the username cookie
          router.push("/");

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
