import { defineStore } from "pinia";
import cookieService from "../services/cookieService.js";
import { useDeviceStore } from "./deviceStore.js";
import router from "../router/index.js";
import apiService from "@/services/apiService"; // Adjust the path as needed
import CryptoJS from "crypto-js";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: cookieService.getComplexCookie("sessionData") || null,
    error: null,
    cookieRefreshed: false,
    hex: null,
    iv: null,
  }),
  actions: {
    // Step 1: Fetch reqKey (hex and iv) for the username
    async getReqKey(username) {
      try {
        const response = await apiService.postRequest(
          "http://172.188.98.99:802/User/reqkey",
          username
        );

        if (response.status === 200) {
          const hex = response.key;
          const iv = response.iv;

          // Save hex and iv to state only (not in localStorage)
          this.hex = hex;
          this.iv = iv;

          return { hex, iv };
        } else {
          console.error("Failed to fetch hex and iv:", response.message);
          return null;
        }
      } catch (error) {
        console.error("Error while fetching hex and iv:", error);
        this.error = error || "Failed to fetch data";
        return null;
      }
    },
    // Step 2: Handle login with encrypted password
    async login(username, password) {
      try {
        // Step 1: Check if hex and iv are available in the state
        if (!this.hex || !this.iv) {
          this.error =
            "Key and IV are missing, please restart the login process.";
          return;
        }

        // Step 2: Convert hex and iv to CryptoJS format for encryption
        const key = CryptoJS.enc.Hex.parse(this.hex);
        const ivCrypto = CryptoJS.enc.Hex.parse(this.iv);

        // Step 3: Encrypt the password using AES
        const encryptedPassword = CryptoJS.AES.encrypt(password, key, {
          iv: ivCrypto,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }).ciphertext.toString(CryptoJS.enc.Hex);

        // Step 4: Get the device ID from the device store
        const deviceStore = useDeviceStore();
        await deviceStore.generateDeviceId();
        const deviceId = deviceStore.deviceId;

        // Step 5: Construct the login request body
        const requestBody = {
          username, // Send the username directly
          pwd: encryptedPassword, // Send the encrypted password as "pwd"
          deviceid: deviceId, // Send the device ID
        };

        // Step 6: Send the login request
        const loginResponse = await apiService.postRequest(
          "http://172.188.98.99:802/User/login",
          requestBody
        );

        // Step 7: Handle the response from login
        if (loginResponse.data.status === 1) {
          this.user = true;
          this.error = null;
          router.push({ name: "dashboard" });

          const sessionData = {
            username,
            token: loginResponse.data.token, // Store the token from response
            deviceId: deviceStore.deviceId,
            deviceName: deviceStore.deviceName,
          };

          // Set session data in cookie
          cookieService.setComplexCookie("sessionData", sessionData, 7);
        } else if (
          loginResponse.data.status === 0 ||
          loginResponse.data.status === 406
        ) {
          this.user = false;
          this.error = loginResponse.data.message;
        }
      } catch (error) {
        this.user = false;
        this.error = error.response?.data?.message || "Login failed";
      }
    },
    // Handle user logout
    logout() {
      this.user = false;
      this.error = null;
      cookieService.eraseCookie("sessionData");
      console.log("Removed sessionData cookie and session keys");
      router.push("/");
    },

    // Refresh the session cookie
    refreshCookie() {
      if (this.user) {
        setTimeout(() => {
          const sessionData = cookieService.getComplexCookie("sessionData");

          if (sessionData) {
            cookieService.setComplexCookie("sessionData", sessionData, 7);
            console.log(
              "Refreshed sessionData cookie after 3 seconds:",
              sessionData
            );
            this.cookieRefreshed = true;
          } else {
            console.error("Session data is missing, cannot refresh the cookie");
          }
        }, 3000);
      }
    },
  },
});
