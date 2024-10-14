import { defineStore } from "pinia";

export const useAlertStore = defineStore("alert", {
  state: () => ({
    message: "",
    type: "", // 'success', 'error', etc.
    isVisible: false,
  }),
  actions: {
    alert(type, message) {
      this.message = message;
      this.type = type;
      this.isVisible = true;

      // Automatically hide the alert after a few seconds
      setTimeout(() => {
        this.clearAlert();
      }, 300000); // Display alert for 3 seconds
    },
    clearAlert() {
      this.message = "";
      this.type = "";
      this.isVisible = false;
    },
  },
});
