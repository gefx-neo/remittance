import { defineStore } from "pinia";

export const useBeneficiaryStore = defineStore("beneficiaryStore", {
  state: () => ({
    beneficiaries: [
      {
        id: 1,
        initials: "JD",
        name: "John Doe",
        accountType: "Business",
        favouriteStatus: true,
        paymentType: "localPayment",
      },
      {
        id: 2,
        initials: "SG",
        name: "Sylvie Goh",
        accountType: "Individual",
        favouriteStatus: true,
        paymentType: "swiftPayment",
      },
      {
        id: 3,
        initials: "SD",
        name: "Shopee Delivery",
        accountType: "Individual",
        favouriteStatus: false,
        paymentType: "localPayment",
      },
      {
        id: 4,
        initials: "HL",
        name: "Henry Lim",
        accountType: "Individual",
        favouriteStatus: false,
        paymentType: "swiftPayment",
      },
      {
        id: 5,
        initials: "TS",
        name: "Tan Shipperson",
        accountType: "Individual",
        favouriteStatus: false,
        paymentType: "localPayment",
      },
      {
        id: 6,
        initials: "TW",
        name: "Terrance Wong",
        accountType: "Individual",
        favouriteStatus: false,
        paymentType: "swiftPayment",
      },
      {
        id: 7,
        initials: "SP",
        name: "Saint Pierre",
        accountType: "Individual",
        favouriteStatus: false,
        paymentType: "localPayment",
      },
      {
        id: 8,
        initials: "LW",
        name: "Laurence Wei",
        accountType: "Individual",
        favouriteStatus: false,
        paymentType: "swiftPayment",
      },
      {
        id: 9,
        initials: "HN",
        name: "Hans Niemann",
        accountType: "Individual",
        favouriteStatus: false,
        paymentType: "localPayment",
      },
      {
        id: 10,
        initials: "KL",
        name: "Kenny Liew",
        accountType: "Individual",
        favouriteStatus: false,
        paymentType: "swiftPayment",
      },
    ],
  }),
  getters: {
    localPaymentBeneficiaries: (state) =>
      state.beneficiaries.filter(
        (beneficiary) => beneficiary.paymentType === "localPayment"
      ),
    swiftPaymentBeneficiaries: (state) =>
      state.beneficiaries.filter(
        (beneficiary) => beneficiary.paymentType === "swiftPayment"
      ),
  },
  actions: {
    // Toggle favourite status for a beneficiary by ID
    toggleFavourite(id) {
      const beneficiary = this.beneficiaries.find((b) => b.id === id);
      if (beneficiary) {
        beneficiary.favouriteStatus = !beneficiary.favouriteStatus;
      }
    },
  },
});
