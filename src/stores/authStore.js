import { defineStore } from "pinia";
import { useDeviceStore } from "./deviceStore.js";
import router from "../router/index.js";
import apiService from "@/services/apiService";
import { DEFAULT_ERROR_MESSAGE } from "@/services/apiService";
import {
  useStore,
  useTransactionStore,
  useAlertStore,
} from "@/stores/index.js";
import { encryptData } from "../services/encryptionService.js";
import {
  setLocalStorageWithExpiry,
  getLocalStorageWithExpiry,
} from "@/services/localStorageService.js";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    username: getLocalStorageWithExpiry("username") || null,
    token: getLocalStorageWithExpiry("token") || null,
    error: null,
    cookieRefreshed: false,
    hex: null,
    iv: null,
  }),
  actions: {
    refreshSession(token, username) {
      if (token) {
        setLocalStorageWithExpiry("token", token, 4); // Update token with 4-hour expiry
      }
      if (username) {
        setLocalStorageWithExpiry("username", username, 4); // Update username with 4-hour expiry
        this.username = username;
      }

      this.stopSessionMonitor(); // explicitly stop previous interval
      this.startSessionMonitor(); // explicitly restart the interval

      console.log("Session refreshed and monitor restarted");
    },
    // async checkSession() {
    //   const token = getLocalStorageWithExpiry("token");
    //   const username = getLocalStorageWithExpiry("username");

    //   if (token && username) {
    //     this.user = username;
    //     return true;
    //   }

    //   // Case 2: Singpass session
    //   try {
    //     const res = await fetch("http://localhost:3080/user", {
    //       credentials: "include",
    //     });

    //     if (res.ok) {
    //       const data = await res.json();
    //       this.user = data.sub || data.username || "singpass-user";
    //       this.username = data.name.value;
    //       return true;
    //     }
    //   } catch (err) {
    //     console.error("Session check failed:", err);
    //   }

    //   this.clearSession();
    //   return false;
    // },
    async checkSession() {
      const token = getLocalStorageWithExpiry("token");
      const username = getLocalStorageWithExpiry("username");

      if (token && username) {
        this.username = username;
        return true;
      } else {
        this.clearSession();
        return false;
      }
    },

    clearSession() {
      localStorage.clear();
    },

    // Step 1: Fetch reqKey (hex and iv) for the username
    async getReqKey(username) {
      const store = useStore();
      const alertStore = useAlertStore();
      store.isLoading = true;
      try {
        const response = await apiService.postRequest("/user/reqkey", username);

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

    // Step 2: Handle login with encrypted password
    async login(form) {
      const alertStore = useAlertStore();

      if (!this.hex || !this.iv) {
        alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
        return;
      }

      const store = useStore();
      store.isLoading = true;
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
        const response = await apiService.postRequest("/user/login", payload, {
          format: "raw",
        });

        if (response.status === 1) {
          this.error = null;

          this.refreshSession(response.token, form.username);

          router.push({ name: "dashboard" });
        } else {
          this.error = response.message;
        }
      } catch (error) {
        this.error = DEFAULT_ERROR_MESSAGE;
      } finally {
        store.isLoading = false;
      }
    },

    async logout() {
      const store = useStore();
      const alertStore = useAlertStore();
      store.isLoading = true;

      try {
        const username = getLocalStorageWithExpiry("username");
        const response = await apiService.postRequest("user/logout", username);

        if (response.status === 1) {
          this.clearSession();
        } else {
          alertStore.alert("error", response.message);
        }
      } catch (error) {
        alertStore.alert("error", DEFAULT_ERROR_MESSAGE);
      } finally {
        store.isLoading = false;
        this.stopSessionMonitor();
        router.push({ name: "login" });
      }
    },

    startSessionMonitor() {
      const alertStore = useAlertStore();

      // Stop any existing interval to prevent multiple instances
      this.stopSessionMonitor();

      this.sessionCheckInterval = setInterval(() => {
        const token = getLocalStorageWithExpiry("token");
        const username = getLocalStorageWithExpiry("username");

        if (!token || !username) {
          this.stopSessionMonitor();
          // alertStore.alert(
          //   "error",
          //   "Your session has expired. Please re-login again."
          // );
          this.logout();
        }
      }, 1000);
    },

    stopSessionMonitor() {
      if (this.sessionCheckInterval) {
        clearInterval(this.sessionCheckInterval);
        this.sessionCheckInterval = null;
      }
    },
  },
});
