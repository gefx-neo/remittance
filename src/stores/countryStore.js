import { defineStore } from "pinia";
import { countryCodes } from "@/data/data";

export const useCountryStore = defineStore("countryStore", {
  state: () => ({
    countryCodes: countryCodes,
    selectedCode: countryCodes.find((country) => country.Name === "Singapore")
      .Code, // Default to Singapore's code
    isDropdownOpen: false,
  }),
  actions: {
    setSelectedCode(code) {
      this.selectedCode = code;
      this.isDropdownOpen = false;
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    closeDropdown() {
      this.isDropdownOpen = false;
    },
  },
});
