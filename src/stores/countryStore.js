import { defineStore } from "pinia";
import { countries } from "@/data/data";

export const useCountryStore = defineStore("countryStore", {
  state: () => ({
    countries: countries,
    selectedCountry: countries.find((country) => country.name === "Singapore")
      .value, // Default to Singapore's value
    isDropdownOpen: false,
  }),
  actions: {
    setSelectedCountry(value) {
      this.selectedCountry = value;
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
