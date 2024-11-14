import { defineStore } from "pinia";

export const useAlertStore = defineStore("alert", {
  state: () => ({
    alerts: [], // Array to hold multiple alerts
  }),
  actions: {
    alert(type, message) {
      const id = Date.now(); // Unique identifier for each alert
      const alert = { id, type, message, isVisible: true };

      // Add the new alert to the array
      this.alerts.push(alert);

      // Automatically hide the alert after a few seconds
      setTimeout(() => {
        this.clearAlert(id);
      }, 3000); // Display alert for 3 seconds
    },
    clearAlert(id) {
      // Find the alert by id and remove it
      this.alerts = this.alerts.filter((alert) => alert.id !== id);
    },
  },
});
