import { defineStore } from "pinia";

export const useAlertStore = defineStore("alert", {
  state: () => ({
    alerts: [],
  }),
  actions: {
    alert(type, message) {
      const id = Date.now();
      const alert = { id, type, message, isVisible: true };

      this.alerts.push(alert);

      setTimeout(() => {
        this.clearAlert(id);
      }, 3000);
    },
    clearAlert(id) {
      this.alerts = this.alerts.filter((alert) => alert.id !== id);
    },
  },
});
