import { defineStore } from "pinia";

export const useStore = defineStore("main", {
  state: () => ({
    isSidebarOpen: false,
    isDropdownOpen: false,
    isLoading: false,
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
  },
});
