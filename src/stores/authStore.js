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
    async getReqKey(username) {
      try {
        const response = await axios.post(
          "http://172.188.98.99:802/User/reqkey",
          {
            username,
          }
        );

        if (response.data.status === 200) {
          const hex = response.data.key;
          const iv = response.data.iv;

          // Save hex and iv to local state and storage
          this.hex = hex;
          this.iv = iv;
          localStorage.setItem("sessionKey", hex);
          localStorage.setItem("sessionIv", iv);

          return { hex, iv };
        } else {
          console.error("Failed to fetch hex and iv:", response.data.message);
          return null;
        }
      } catch (error) {
        console.error("Error while fetching hex and iv:", error);
        this.error = error.response?.data?.message || "Failed to fetch data";
        return null;
      }
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
