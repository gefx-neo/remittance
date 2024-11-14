import { defineStore } from "pinia";
import apiService from "@/services/apiService"; // Import your API service

export const useBeneficiaryStore = defineStore("beneficiaryStore", {
  state: () => ({
    beneficiaryList: null,
    error: null,
    beneficiaries: [
      {
        id: 1,
        initials: "JD",
        name: "John Doe",
        accountType: "Business",
        favouriteStatus: true,
        paymentType: "localPayment",
        currency: "MYR",
        accountCurrency: "MYR account ending in 6222",
      },
      {
        id: 2,
        initials: "SG",
        name: "Sylvie Goh",
        accountType: "Individual",
        favouriteStatus: true,
        paymentType: "swiftPayment",
        currency: "IDR",
        accountCurrency: "IDR account ending in 9977",
      },
      {
        id: 3,
        initials: "SD",
        name: "Shopee Delivery",
        accountType: "Individual",
        favouriteStatus: false,
        paymentType: "localPayment",
        currency: "IDR",
        accountCurrency: "IDR account ending in 9977",
      },
      {
        id: 4,
        initials: "HL",
        name: "Henry Lim",
        accountType: "Individual",
        favouriteStatus: false,
        paymentType: "swiftPayment",
        currency: "MYR",
        accountCurrency: "MYR account ending in 6222",
      },
      {
        id: 5,
        initials: "TS",
        name: "Tan Shipperson",
        accountType: "Individual",
        favouriteStatus: false,
        paymentType: "localPayment",
        currency: "IDR",
        accountCurrency: "IDR account ending in 9977",
      },
      {
        id: 6,
        initials: "TW",
        name: "Terrance Wong",
        accountType: "Individual",
        favouriteStatus: false,
        paymentType: "swiftPayment",
        currency: "IDR",
        accountCurrency: "IDR account ending in 9977",
      },
      {
        id: 7,
        initials: "SP",
        name: "Saint Pierre",
        accountType: "Individual",
        favouriteStatus: false,
        paymentType: "localPayment",
        currency: "MYR",
        accountCurrency: "MYR account ending in 6222",
      },
      {
        id: 8,
        initials: "LW",
        name: "Laurence Wei",
        accountType: "Individual",
        favouriteStatus: false,
        paymentType: "swiftPayment",
        currency: "MYR",
        accountCurrency: "MYR account ending in 6222",
      },
      {
        id: 9,
        initials: "HN",
        name: "Hans Niemann",
        accountType: "Individual",
        favouriteStatus: false,
        paymentType: "localPayment",
        currency: "MYR",
        accountCurrency: "MYR account ending in 6222",
      },
      {
        id: 10,
        initials: "KL",
        name: "Kenny Liew",
        accountType: "Individual",
        favouriteStatus: false,
        paymentType: "swiftPayment",
        currency: "src/assets/currency/myr.svg",
        accountCurrency: "MYR account ending in 6222",
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
    async getBeneficiaryList() {
      const store = useStore();
      store.isLoading = true;
      try {
        // Retrieve the username from localStorage
        const username = getLocalStorageWithExpiry("username");
        if (!username) {
          throw new Error("No username found in localStorage");
        }

        // Call the API with username as a query parameter
        const response = await apiService.getRequest(
          `/beneficiary/list?username=${username}`
        );
        if (response.status !== 1) {
          // If response status is not 1, log out the user and redirect to login
          this.clearProfileDetails();
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          router.push("/login");
          throw new Error(
            "Invalid beneficiary list. You have been logged out."
          );
        }
        this.beneficiaryList = response;
        setLocalStorageWithExpiry("token", response.token, 4);
        setLocalStorageWithExpiry("username", username, 4);

        console.log("beneficiary response token", response.token);
        return response;
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to fetch beneficiary list";
        console.error("Error while fetching beneficiary list:", error);
      } finally {
        store.isLoading = false;
      }
    },
    async getBeneficiaryDetail(nickname) {
      const store = useStore();
      store.isLoading = true;
      try {
        // Retrieve the username from localStorage
        const username = getLocalStorageWithExpiry("username");
        if (!username) {
          throw new Error("No username found in localStorage");
        }

        // Call the API with nickname and username as query parameters
        const response = await apiService.getRequest(
          `/beneficiary/${nickname}?username=${username}`
        );

        if (response.status !== 1) {
          // If response status is not 1, handle the error by logging out the user
          this.clearProfileDetails();
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          router.push("/login");
          throw new Error(
            "Invalid beneficiary detail. You have been logged out."
          );
        }

        // Assuming this.beneficiaryDetail is where you store the details
        this.beneficiaryDetail = response;
        setLocalStorageWithExpiry("token", response.token, 4);
        setLocalStorageWithExpiry("username", username, 4);

        console.log("beneficiary detail response token", response.token);
        return response;
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to fetch beneficiary detail";
        console.error("Error while fetching beneficiary detail:", error);
      } finally {
        store.isLoading = false;
      }
    },

    async addBeneficiary(form) {
      const store = useStore();
      store.isLoading = true;
      this.error = null;

      try {
        console.log(form);
        const response = await apiService.postRequest(
          "/beneficiary/addBeneficiary",
          form,
          { format: "raw" }
        );

        if (response.status === 1) {
          this.error = null;
        } else {
          this.error = response.message;
        }

        return response;
      } catch (error) {
        this.error =
          error.message ||
          "Verification failed due to network issues or server error.";
        throw error;
      } finally {
        store.isLoading = false;
      }
    },
    async updateFavourite(nickname, status) {
      const store = useStore();
      store.isLoading = true;
      this.error = null;

      try {
        const payload = { nickname, status };

        const response = await apiService.postRequest(
          "/beneficiary/updateFavourite",
          payload
        );

        if (response.status === 1) {
          this.error = null;
        } else {
          this.error = response.message;
        }

        return response;
      } catch (error) {
        this.error =
          error.message ||
          "Failed to update favourite status due to network issues or server error.";
        console.error("Error updating favourite status:", error);
        throw error;
      } finally {
        store.isLoading = false;
      }
    },

    async deleteBeneficiary(nickname) {
      const store = useStore();
      store.isLoading = true;
      this.error = null;

      try {
        const response = await apiService.deleteRequest(
          "/beneficiary/deleteBeneficiary",
          { nickname }
        );

        if (response.status === 1) {
          this.error = null;
        } else {
          this.error = response.message;
        }

        return response;
      } catch (error) {
        this.error =
          error.message ||
          "Failed to delete beneficiary due to network issues or server error.";
        console.error("Error deleting beneficiary:", error);
        throw error;
      } finally {
        store.isLoading = false;
      }
    },

    clearBeneficiaryList() {
      this.beneficiaryList = null;
      this.error = null;
    },
  },
});
