import { defineStore } from "pinia";

export const useStore = defineStore("main", {
  state: () => ({
    // isMenuOpen: false, // Guest mobile menu
    isSidebarOpen: false, // User tablet sidebar
    isDropdownOpen: false, // User profile dropdown
    isLoading: false,
  }),
  actions: {
    // toggleMenu() {
    //   this.isMenuOpen = !this.isMenuOpen;
    // },
    // openMenu() {
    //   this.isMenuOpen = true;
    // },
    // closeMenu() {
    //   this.isMenuOpen = false;
    // },
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
