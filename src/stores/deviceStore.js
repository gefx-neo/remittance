import { defineStore } from "pinia";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import UAParser from "ua-parser-js";
import cookieService from "../services/cookieService.js";

export const useDeviceStore = defineStore("device", {
  state: () => ({
    deviceId: cookieService.getCookie("deviceId") || null,
    deviceName: null,
  }),
  actions: {
    async generateDeviceId() {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        this.deviceId = result.visitorId;

        this.getDeviceName();
      } catch (error) {
        console.error("Error generating device ID:", error);
      }
    },
    clearDeviceId() {
      this.deviceId = null;
    },
    getDeviceName() {
      const parser = new UAParser();
      const result = parser.getResult();

      let deviceName = "Unknown Device";

      if (result.device.model) {
        deviceName = `${result.device.vendor} ${result.device.model}`;
      } else if (result.os.name && result.os.version) {
        deviceName = `${result.os.name} ${result.os.version}`;
      } else if (result.browser.name && result.browser.version) {
        deviceName = `${result.browser.name} ${result.browser.version}`;
      }

      this.deviceName = deviceName;
    },
  },
});
