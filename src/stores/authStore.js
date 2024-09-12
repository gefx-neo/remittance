import { defineStore } from "pinia";
import axios from "axios";
import cookieService from "../services/cookieService.js";
import { useDeviceStore } from "./deviceStore.js";
import router from "../router/index.js";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: cookieService.getComplexCookie("sessionData") || null,
    error: null,
    cookieRefreshed: false,
    hex: null,
    iv: null,
  }),
  actions: {
    async fetchHexAndIv() {
      // Simulate API call to fetch hex and iv with a delay
      return new Promise((resolve) => {
        setTimeout(() => {
          const hex =
            "a1c91b5f95d37b3c48f59861c21156e31e1176f7c5ec3c5512dfb63a70c8ffbd";
          const iv = "51d94482ec57e7b0fde837dbf1380eeb";

          // Log the fetched hex and iv values
          console.log("Fetched hex:", hex);
          console.log("Fetched iv:", iv);

          // Set hex and iv in the store and local storage
          this.hex = hex;
          this.iv = iv;
          localStorage.setItem("sessionKey", hex);
          localStorage.setItem("sessionIv", iv);

          resolve({ hex, iv });
        }, 1000); // Simulate 1-second delay
      });
    },

    async loginn(login, password) {
      try {
        const response = await axios.post(
          "https://recruitment-api.pyt1.stg.jmr.pl/login",
          {
            login,
            password,
            key: this.hex,
            iv: this.iv,
          }
        );
        if (response.data.status === "ok") {
          this.user = true;
          this.error = null;
          router.push({ name: "dashboard" });

          const deviceStore = useDeviceStore();
          await deviceStore.generateDeviceId();

          const sessionData = {
            username: login,
            token: response.data.status,
            deviceId: deviceStore.deviceId,
            deviceName: deviceStore.deviceName,
            key: this.hex,
            iv: this.iv,
          };

          cookieService.setComplexCookie(
            "sessionData",
            sessionData,
            7,
            this.hex,
            this.iv
          );
        } else {
          this.user = false;
          this.error = response.data.message;
        }
      } catch (error) {
        this.user = false;
        this.error = error.response?.data?.message;
      }
    },
    logout() {
      this.user = false;
      this.error = null;
      cookieService.eraseCookie("sessionData");
      localStorage.removeItem("sessionKey");
      localStorage.removeItem("sessionIv");
      console.log("Removed sessionData cookie and session keys");
      router.push("/");
    },
    refreshCookie() {
      if (this.user) {
        setTimeout(() => {
          const sessionData = cookieService.getComplexCookie("sessionData");

          // Ensure sessionData exists and key/iv are available in local storage
          const key = localStorage.getItem("sessionKey");
          const iv = localStorage.getItem("sessionIv");

          if (sessionData && key && iv) {
            cookieService.setComplexCookie(
              "sessionData",
              sessionData,
              7,
              key,
              iv
            );
            console.log(
              "Refreshed sessionData cookie after 3 seconds:",
              sessionData
            );
            this.cookieRefreshed = true;
          } else {
            console.error("Key or IV is missing, cannot refresh the cookie");
          }
        }, 3000);
      }
    },
  },
});
