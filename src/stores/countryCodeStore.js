import { defineStore } from "pinia";
import { countryCodes } from "@/data/data";

export const useCountryCodeStore = defineStore("countryCodeStore", {
  state: () => ({
    countryCodes: countryCodes,
    selectedID: countryCodes.find((country) => country.Name === "Singapore").ID, // Default to Singapore's ID
    isDropdownOpen: false,
  }),
  actions: {
    setSelectedID(id) {
      this.selectedID = id;
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
