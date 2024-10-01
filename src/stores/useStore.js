import { defineStore } from "pinia";

export const useStore = defineStore("main", {
  state: () => ({
    isSidebarOpen: false, // User tablet sidebar
    isDropdownOpen: false, // User profile dropdown
    isLoading: false, // Button API loading
    isModalOpen: false, // Modal
    isResendLoading: false, // Loading state for "Send again"
    resendTime: 0, // Timer countdown for "Send again"
  }),
  actions: {
    openSidebar() {
      this.isSidebarOpen = true;
    },
    closeSidebar() {
      this.isSidebarOpen = false;
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    openDropdown() {
      this.isDropdownOpen = true;
    },
    closeDropdown() {
      this.isDropdownOpen = false;
    },
    setLoading(isLoading) {
      this.isLoading = isLoading;
    },
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    startResendTimer() {
      this.resendTime = 180;
      this.isResendLoading = true;

      const timer = setInterval(() => {
        if (this.resendTime > 0) {
          this.resendTime--;
        } else {
          clearInterval(timer);
          this.isResendLoading = false;
        }
      }, 1000);
    },
    resetResendTimer() {
      this.isResendLoading = false;
      this.resendTime = 0;
    },
  },
});
