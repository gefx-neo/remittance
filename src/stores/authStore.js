import { defineStore } from "pinia";
import axios from "axios";
import cookieService from "../services/cookieService.js";
import { useDeviceStore } from "./deviceStore.js";
import router from "../router/index.js";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: cookieService.getComplexCookie("sessionData") || null,
    error: null,
  }),
  actions: {
    async loginn(login, password) {
      try {
        const response = await axios.post(
          "https://recruitment-api.pyt1.stg.jmr.pl/login",
          {
            login,
            password,
          }
        );
        console.log("API Response:", response.data); // Log the response data
        if (response.data.status === "ok") {
          this.user = true;
          this.error = null;
          router.push({ name: "dashboard" });

          // Generate and store the device ID
          const deviceStore = useDeviceStore();
          await deviceStore.generateDeviceId();

          // Set a cookie with the session and device information
          const sessionData = {
            username: login, // Store the login value
            token: response.data.status,
            deviceId: deviceStore.deviceId,
            deviceName: deviceStore.deviceName,
          };
          cookieService.setComplexCookie("sessionData", sessionData, 7);
        } else {
          this.user = false;
          this.error = response.data.message;
        }
      } catch (error) {
        this.user = false;
        this.error = error.response?.data?.message;
        console.error("Failed to login:", error);
      }
    },
    logout() {
      this.user = false;
      this.error = null;
      cookieService.eraseCookie("sessionData");
      console.log("Removed sessionData cookie");
      router.push("/");
    },
    refreshCookie() {
      if (this.user) {
        const sessionData = cookieService.getComplexCookie("sessionData");
        if (sessionData) {
          cookieService.setComplexCookie("sessionData", sessionData, 7);
          console.log("Refreshed sessionData cookie:", sessionData);
          this.cookieRefreshed = true; // Set the flag to true after refreshing
        }
      }
    },
  },
});
