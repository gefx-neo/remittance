import { defineStore } from "pinia";

export const useDashboardStore = defineStore("dashboardStore", {
  state: () => ({
    exchangeRates: {}, // We will store rates dynamically
  }),
  getters: {
    // Getter to get the exchange rate for a given currency pair
    getExchangeRate: (state) => (currencyPair) => {
      console.log(`Getting rate for currency pair: ${currencyPair}`);
      const rate = state.exchangeRates[currencyPair];
      if (rate) {
        console.log(`Rate found: ${rate}`);
        return rate;
      } else {
        console.log("Rate not found");
        return null;
      }
    },
  },
  actions: {
    // Simulated API to fetch the rate and update state
    async fetchExchangeRate(fromCurrency, toCurrency, amount) {
      const currencyPair = `${fromCurrency}-${toCurrency}`;
      console.log(`Fetching rate for pair: ${currencyPair}`);

      // Simulate an API call that returns { currency, sellRate }
      // Mocking an API response here
      const apiResponse = await this.mockApiResponse(fromCurrency, toCurrency);

      const rate = apiResponse.sellRate;
      if (rate !== null) {
        const convertedAmount = amount * rate;
        console.log(`Converted amount for ${currencyPair}: ${convertedAmount}`);
        return { currency: currencyPair, convertedAmount };
      } else {
        console.log(`Error: Rate not found for ${currencyPair}`);
        throw new Error("Rate not found for the given currency pair.");
      }
    },

    // Mock API response
    async mockApiResponse(fromCurrency, toCurrency) {
      // Example mock API response based on the currencies
      // You would replace this with an actual API call
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockRates = {
            "USD-MYR": { currency: "USD-MYR", sellRate: 4.3, buyRate: 4.2 },
            "MYR-USD": { currency: "MYR-USD", sellRate: 0.238, buyRate: 0.22 },
            "USD-IDR": { currency: "USD-IDR", sellRate: 15000, buyRate: 14900 },
            "IDR-USD": {
              currency: "IDR-USD",
              sellRate: 0.000067,
              buyRate: 0.000066,
            },
            "SGD-MYR": { currency: "SGD-MYR", sellRate: 3.1, buyRate: 3.05 },
            "MYR-SGD": { currency: "MYR-SGD", sellRate: 0.328, buyRate: 0.322 },
            "SGD-IDR": { currency: "SGD-IDR", sellRate: 11000, buyRate: 10900 },
            "IDR-SGD": {
              currency: "IDR-SGD",
              sellRate: 0.000092,
              buyRate: 0.000091,
            },
          };

          const rate = mockRates[`${fromCurrency}-${toCurrency}`];
          if (rate) {
            resolve(rate);
          } else {
            resolve({ currency: null, sellRate: null });
          }
        }, 500); // Simulate network delay
      });
    },
  },
});
